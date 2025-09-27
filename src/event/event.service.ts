import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

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

  async findAll() {
    return this.prisma.event.findMany({
      include: { category: true, ong: true },
      orderBy: { startDate: "asc" },
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
    return event;
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

    return this.prisma.event.delete({ where: { id } });
  }
}
