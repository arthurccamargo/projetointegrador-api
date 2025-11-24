import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { CreateEventApplicationDto } from "./dto/create-event-application.dto";
import { UpdateEventApplicationDto } from "./dto/update-event-application.dto";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class EventApplicationService {
  constructor(private prisma: PrismaService) {}

  // Voluntário se candidata
  async apply(dto: CreateEventApplicationDto, userId: string) {
    const volunteer = await this.prisma.volunteerProfile.findUnique({
      where: { userId },
    });
    if (!volunteer) {
      throw new ForbiddenException("Usuário não é um voluntário válido");
    }

    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
    });

    if (!event) throw new NotFoundException("Evento não encontrado");

    // regra: limite de candidatos (usando campo currentCandidates)
    if (event.currentCandidates >= event.maxCandidates) {
      throw new BadRequestException("Número máximo de candidatos atingido");
    }

    // regra: não duplicar candidatura
    const alreadyApplied = await this.prisma.eventApplication.findFirst({
      where: {
        eventId: dto.eventId,
        volunteerId: volunteer.id,
      },
    });
    if (alreadyApplied) {
      throw new BadRequestException("Você já se candidatou a este evento");
    }

    // transação para consistência
    const [application] = await this.prisma.$transaction([
      this.prisma.eventApplication.create({
        data: {
          eventId: dto.eventId,
          volunteerId: volunteer.id,
        },
      }),
      this.prisma.event.update({
        where: { id: dto.eventId },
        data: { currentCandidates: { increment: 1 } },
      }),
    ]);

    return application;
  }

  private computeStatus(event: {
    startDate: Date;
    durationMinutes: number;
    status?: string;
  }) {
    if (event.status === "CANCELLED") return "CANCELLED";

    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(
      start.getTime() + (event.durationMinutes || 0) * 60000
    );

    if (now < start) return "SCHEDULED";
    if (now >= start && now < end) return "IN_PROGRESS";
    return "COMPLETED";
  }

  // Lista eventos do histórico: COMPLETED/CANCELLED OU eventos que o voluntário cancelou candidatura
  async findMyPastEvents(userId: string) {
    const volunteer = await this.prisma.volunteerProfile.findUnique({
      where: { userId },
    });
    if (!volunteer) {
      throw new ForbiddenException("Usuário não é um voluntário válido");
    }

    const applications = await this.prisma.eventApplication.findMany({
      where: { volunteerId: volunteer.id },
      include: { event: { include: { ong: true, category: true } } },
    });

    return applications
      .map((app) => ({
        ...app.event,
        status: this.computeStatus(app.event),
        applicationStatus: app.status,
        applicationId: app.id,
      }))
      .filter((event) => {
        if (["COMPLETED", "CANCELLED"].includes(event.status)) return true;

        if (
          ["SCHEDULED", "IN_PROGRESS"].includes(event.status) &&
          event.applicationStatus === "CANCELLED"
        ) {
          return true;
        }

        return false;
      });
  }

  // Lista eventos SCHEDULED ou IN_PROGRESS onde o voluntário tem candidatura ativa
  async findMyActiveEvents(userId: string) {
    const volunteer = await this.prisma.volunteerProfile.findUnique({
      where: { userId },
    });
    if (!volunteer) {
      throw new ForbiddenException("Usuário não é um voluntário válido");
    }

    const applications = await this.prisma.eventApplication.findMany({
      where: {
        volunteerId: volunteer.id,
        status: { in: ["PENDING", "ACCEPTED"] },
      },
      include: {
        event: {
          include: { ong: true, category: true },
        },
      },
    });

    return applications
      .map((app) => ({
        ...app.event,
        status: this.computeStatus(app.event),
        applicationStatus: app.status,
        applicationId: app.id,
      }))
      .filter((event) => ["SCHEDULED", "IN_PROGRESS"].includes(event.status));
  }

  // ONG lista candidaturas PENDING ou ACCEPTED de um evento específico
  async findAllByEventForOng(eventId: string, userId: string) {
    const ongProfile = await this.prisma.ongProfile.findUnique({
      where: { userId },
    });
    if (!ongProfile) {
      throw new ForbiddenException("Usuário não é uma ONG válida");
    }

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException("Evento não encontrado");
    }
    if (event.ongId !== ongProfile.id) {
      throw new ForbiddenException("Este evento não pertence à sua ONG");
    }

    return this.prisma.eventApplication.findMany({
      where: {
        eventId,
        status: { in: ["PENDING", "ACCEPTED"] },
      },
      include: {
        volunteer: {
          select: {
            id: true,
            userId: true,      // 👈 ID do User (para rota /profile/:id)
            fullName: true,
          },
        },
      },
    });
  }

  // ONG aceita ou rejeita candidatura
  async updateStatus(
    id: string,
    dto: UpdateEventApplicationDto,
    userId: string
  ) {
    const ongProfile = await this.prisma.ongProfile.findUnique({
      where: { userId },
    });
    if (!ongProfile) {
      throw new ForbiddenException("Usuário não é uma ONG válida");
    }

    const application = await this.prisma.eventApplication.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!application) throw new NotFoundException("Candidatura não encontrada");
    if (application.event.ongId !== ongProfile.id) {
      throw new ForbiddenException("Este evento não pertence à sua ONG");
    }

    // Se o novo status for REJECTED e o antigo era PENDING ou ACCEPTED,
    // a vaga deve ser liberada.
    if (
      dto.status === "REJECTED" &&
      (application.status === "PENDING" || application.status === "ACCEPTED")
    ) {
      // Transação para garantir consistência
      const [updatedApplication] = await this.prisma.$transaction([
        this.prisma.eventApplication.update({
          where: { id },
          data: { status: "REJECTED" },
        }),
        this.prisma.event.update({
          where: { id: application.eventId },
          data: { currentCandidates: { decrement: 1 } },
        }),
      ]);
      return updatedApplication;
    }

    // Para outros status (ex: PENDING -> ACCEPTED), apenas atualiza
    return this.prisma.eventApplication.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  // Voluntário cancela a candidatura
  async cancel(id: string, userId: string) {
    const volunteer = await this.prisma.volunteerProfile.findUnique({
      where: { userId },
    });
    if (!volunteer) {
      throw new ForbiddenException("Usuário não é um voluntário válido");
    }

    const application = await this.prisma.eventApplication.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!application) throw new NotFoundException("Candidatura não encontrada");
    if (application.volunteerId !== volunteer.id) {
      throw new ForbiddenException("Você não pertence a essa candidatura");
    }

    // transação: marca como CANCELLED e decrementa contador
    const [cancelled] = await this.prisma.$transaction([
      this.prisma.eventApplication.update({
        where: { id },
        data: { status: "CANCELLED" },
      }),
      this.prisma.event.update({
        where: { id: application.eventId },
        data: { currentCandidates: { decrement: 1 } },
      }),
    ]);

    return cancelled;
  }
}
