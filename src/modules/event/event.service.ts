import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { PrismaService } from "../../../prisma/prisma.service";
import { BadRequestException } from "@nestjs/common";

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

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

  // combina dados do body (DTO) com dados internos (JWT) em um único objeto
  async create(data: CreateEventDto & { userId: string }) {
    const ongProfile = await this.prisma.ongProfile.findUnique({
      where: { userId: data.userId },
    });

    if (!ongProfile) {
      throw new NotFoundException(
        "Perfil de ONG não encontrado para este usuário"
      );
    }

    return this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        durationMinutes: data.durationMinutes,
        location: data.location,
        maxCandidates: data.maxCandidates,
        categoryId: data.categoryId,
        ongId: ongProfile.id,
      },
    });
  }

  async findAll(userId?: string) {
    const events = await this.prisma.event.findMany({
      include: {
        category: true,
        ong: true,
        applications: true,
      },
      orderBy: { startDate: "asc" },
    });

    let volunteerProfileId: string | null = null;
    if (userId) {
      const volunteerProfile = await this.prisma.volunteerProfile.findUnique({
        where: { userId },
      });
      volunteerProfileId = volunteerProfile?.id || null;
    }

    return events
      .map((e) => ({ ...e, status: this.computeStatus(e) }))
      .filter((e) => {
        if (!["SCHEDULED"].includes(e.status)) return false;

        // Se não há voluntário logado, retorna todos eventos ativos
        if (!volunteerProfileId) return true;

        // Filtrar eventos onde o voluntário NÃO se aplicou ainda
        const hasApplied = e.applications.some(
          (app) => app.volunteerId === volunteerProfileId
        );
        return !hasApplied;
      });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        ong: true,
        applications: {
          include: { volunteer: true },
        },
      },
    });

    if (!event) throw new NotFoundException("Evento não encontrado");
    return { ...event, status: this.computeStatus(event) };
  }

  async update(id: string, data: UpdateEventDto, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException("Evento não encontrado");

    const ongProfile = await this.prisma.ongProfile.findUnique({
      where: { userId },
    });
    if (!ongProfile) {
      throw new NotFoundException(
        "Perfil de ONG não encontrado para este usuário"
      );
    }
    if (event.ongId !== ongProfile.id) {
      throw new NotFoundException("Evento não pertence a esta ONG");
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    const ongProfile = await this.prisma.ongProfile.findUnique({
      where: { userId },
    });

    if (!ongProfile) {
      throw new NotFoundException(
        "Perfil de ONG não encontrado para este usuário"
      );
    }

    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException("Evento não encontrado");
    if (event.ongId !== ongProfile.id) {
      throw new NotFoundException("Evento não pertence a esta ONG");
    }

    return this.prisma.event.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  }

  async findEventsByOngUserId(userId: string) {
    const ongProfile = await this.prisma.ongProfile.findUnique({
      where: { userId: userId },
    });
    if (!ongProfile) {
      throw new NotFoundException(
        "Perfil de ONG não encontrado para este usuário"
      );
    }
    const events = await this.prisma.event.findMany({
      where: { ongId: ongProfile.id },
      include: { category: true, ong: false },
      orderBy: { startDate: "asc" },
    });
    return events.map((e) => ({ ...e, status: this.computeStatus(e) }));
  }

  async findActiveEventsByOngUserId(userId: string) {
    const ongProfile = await this.prisma.ongProfile.findUnique({
      where: { userId: userId },
    });
    if (!ongProfile) {
      throw new NotFoundException(
        "Perfil de ONG não encontrado para este usuário"
      );
    }
    const events = await this.prisma.event.findMany({
      where: { ongId: ongProfile.id },
      include: { category: true, ong: false },
      orderBy: { startDate: "asc" },
    });
    return events
      .map((e) => ({ ...e, status: this.computeStatus(e) }))
      .filter((e) => ["SCHEDULED", "IN_PROGRESS"].includes(e.status));
  }

  async findPastEventsByOngUserId(userId: string) {
    const ongProfile = await this.prisma.ongProfile.findUnique({
      where: { userId: userId },
    });
    if (!ongProfile) {
      throw new NotFoundException(
        "Perfil de ONG não encontrado para este usuário"
      );
    }
    const events = await this.prisma.event.findMany({
      where: { ongId: ongProfile.id },
      include: { 
        category: true, 
        ong: false, 
        applications: {
          where: { checkedIn: true },
          include: {
            volunteer: {
              select: {
                id: true,
                userId: true,
                fullName: true,
              }
            }
          }
        }
      },
      orderBy: { startDate: "desc" },
    });
    return events
      .map((e) => ({ ...e, status: this.computeStatus(e) }))
      .filter((e) => ["COMPLETED", "CANCELLED"].includes(e.status));
  }

  private generateCheckInCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // ONG obtém notificações de eventos em andamento (com códigos gerados automaticamente)
  async getInProgressEventsWithCodes(userId: string) {
    const ongProfile = await this.prisma.ongProfile.findUnique({
      where: { userId },
    });
    if (!ongProfile) {
      throw new NotFoundException(
        "Perfil de ONG não encontrado para este usuário"
      );
    }

    // Busca todos os eventos da ONG
    const events = await this.prisma.event.findMany({
      where: {
        ongId: ongProfile.id,
        status: { not: "CANCELLED" },
      },
      include: {
        category: true,
        applications: {
          where: { status: "ACCEPTED" },
        },
      },
      orderBy: { startDate: "asc" },
    });

    // Filtra eventos IN_PROGRESS e gera códigos automaticamente
    const inProgressEvents = [];

    for (const event of events) {
      const currentStatus = this.computeStatus(event);

      if (currentStatus === "IN_PROGRESS") {
        // Se não tem código ainda, gera automaticamente
        let eventWithCode = event;
        if (!event.checkInCode) {
          const code = this.generateCheckInCode();
          eventWithCode = await this.prisma.event.update({
            where: { id: event.id },
            data: {
              checkInCode: code,
              checkInCodeGeneratedAt: new Date(),
            },
            include: {
              category: true,
              applications: {
                where: { status: "ACCEPTED" },
              },
            },
          });
        }

        inProgressEvents.push({
          id: eventWithCode.id,
          title: eventWithCode.title,
          description: eventWithCode.description,
          startDate: eventWithCode.startDate,
          durationMinutes: eventWithCode.durationMinutes,
          location: eventWithCode.location,
          category: eventWithCode.category,
          status: currentStatus,
          checkInCode: eventWithCode.checkInCode,
          checkInCodeGeneratedAt: eventWithCode.checkInCodeGeneratedAt,
        });
      }
    }

    return inProgressEvents;
  }
}
