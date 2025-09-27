import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateEventApplicationDto } from "./dto/create-event-application.dto";
import { UpdateEventApplicationDto } from "./dto/update-event-application.dto";

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
      include: { applications: true },
    });

    if (!event) throw new NotFoundException("Evento não encontrado");

    // regra: até 48h antes do evento
    const diffHours =
      (event.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    if (diffHours < 48) {
      throw new BadRequestException("Não é possível se candidatar a menos de 48h do evento");
    }

    // regra: limite de candidatos
    if (event.applications.length >= event.maxCandidates) {
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

    return this.prisma.eventApplication.create({
      data: {
        eventId: dto.eventId,
        volunteerId: volunteer.id,
      },
    });
  }

  // ONG aceita ou rejeita candidatura
  async updateStatus(id: string, dto: UpdateEventApplicationDto, userId: string) {
    // verificar se o user é ONG
    const ongProfile = await this.prisma.ongProfile.findUnique({
      where: { userId },
    });
    if (!ongProfile) {
      throw new ForbiddenException("Usuário não é uma ONG válida");
    }

    // carregar candidatura + evento
    const application = await this.prisma.eventApplication.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!application) throw new NotFoundException("Candidatura não encontrada");
    if (application.event.ongId !== ongProfile.id) {
      throw new ForbiddenException("Este evento não pertence à sua ONG");
    }

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

    // regra: só pode cancelar até 48h antes
    const diffHours =
      (application.event.startDate.getTime() - new Date().getTime()) /
      (1000 * 60 * 60);
    if (diffHours < 48) {
      throw new BadRequestException("Não é possível cancelar a menos de 48h do evento");
    }

    return this.prisma.eventApplication.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  }
}
