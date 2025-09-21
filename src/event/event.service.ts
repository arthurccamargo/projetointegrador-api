import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        durationMinutes: data.durationMinutes,
        location: data.location,
        maxCandidates: data.maxCandidates,
        categoryId: data.categoryId,
        ongId: req.user.userId,
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

  async update(id: string, data: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException("Evento não encontrado");

    return this.prisma.event.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException("Evento não encontrado");

    return this.prisma.event.delete({ where: { id } });
  }
}
