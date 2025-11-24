import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";

@Injectable()
export class ReviewService {
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

  // Voluntário cria avaliação
  async create(dto: CreateReviewDto, userId: string) {
    const volunteer = await this.prisma.volunteerProfile.findUnique({
      where: { userId },
    });

    if (!volunteer) {
      throw new ForbiddenException("Usuário não é um voluntário válido");
    }

    // Busca a candidatura com todos os dados necessários
    const application = await this.prisma.eventApplication.findUnique({
      where: { id: dto.applicationId },
      include: {
        event: true,
        review: true,
      },
    });

    if (!application) {
      throw new NotFoundException("Candidatura não encontrada");
    }

    // Validação: só o voluntário da candidatura pode avaliar
    if (application.volunteerId !== volunteer.id) {
      throw new ForbiddenException(
        "Você não pode avaliar uma candidatura que não é sua"
      );
    }

    // Validação: precisa ter feito check-in
    if (!application.checkedIn) {
      throw new BadRequestException(
        "Você precisa ter feito check-in no evento para avaliá-lo"
      );
    }

    // Validação: evento precisa estar IN_PROGRESS ou COMPLETED
    const eventStatus = this.computeStatus(application.event);
    if (!["IN_PROGRESS", "COMPLETED"].includes(eventStatus)) {
      throw new BadRequestException(
        `Você só pode avaliar eventos em andamento ou concluídos. Status atual: ${eventStatus}`
      );
    }

    // Validação: prazo de 48 horas após check-in
    const checkInTime = application.checkInAt;
    if (!checkInTime) {
      throw new BadRequestException("Check-in não encontrado");
    }

    const now = new Date();
    const hoursSinceCheckIn =
      (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

    if (hoursSinceCheckIn > 48) {
      throw new BadRequestException(
        "O prazo de 48 horas para avaliar este evento já expirou"
      );
    }

    // Validação: não pode avaliar duas vezes
    if (application.review) {
      throw new BadRequestException("Você já avaliou este evento");
    }

    // Cria a avaliação
    const review = await this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        applicationId: dto.applicationId,
        volunteerId: volunteer.id,
        ongId: application.event.ongId,
        eventId: application.eventId,
      },
      include: {
        volunteer: {
          select: {
            id: true,
            fullName: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Atualiza média e total de avaliações da ONG
    await this.updateOngRatingStats(application.event.ongId);

    return review;
  }

  // Atualiza estatísticas de avaliação da ONG
  private async updateOngRatingStats(ongId: string) {
    const stats = await this.prisma.review.aggregate({
      where: { ongId },
      _avg: { rating: true },
      _count: true,
    });

    await this.prisma.ongProfile.update({
      where: { id: ongId },
      data: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count,
      },
    });
  }

  // Voluntário atualiza sua avaliação (dentro de 48h do check-in)
  async update(id: string, dto: UpdateReviewDto, userId: string) {
    const volunteer = await this.prisma.volunteerProfile.findUnique({
      where: { userId },
    });

    if (!volunteer) {
      throw new ForbiddenException("Usuário não é um voluntário válido");
    }

    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        application: true,
      },
    });

    if (!review) {
      throw new NotFoundException("Avaliação não encontrada");
    }

    if (review.volunteerId !== volunteer.id) {
      throw new ForbiddenException("Você não pode editar avaliação de outro voluntário");
    }

    // Validação: prazo de 48 horas após check-in
    const checkInTime = review.application.checkInAt;
    if (!checkInTime) {
      throw new BadRequestException("Check-in não encontrado");
    }

    const now = new Date();
    const hoursSinceCheckIn =
      (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

    if (hoursSinceCheckIn > 48) {
      throw new BadRequestException(
        "O prazo de 48 horas para editar esta avaliação já expirou"
      );
    }

    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: dto,
      include: {
        volunteer: {
          select: {
            id: true,
            fullName: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Atualiza média e total de avaliações da ONG
    await this.updateOngRatingStats(review.ongId);

    return updatedReview;
  }

  // Voluntário deleta sua avaliação (dentro de 48h do check-in)
  async remove(id: string, userId: string) {
    const volunteer = await this.prisma.volunteerProfile.findUnique({
      where: { userId },
    });

    if (!volunteer) {
      throw new ForbiddenException("Usuário não é um voluntário válido");
    }

    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        application: true,
      },
    });

    if (!review) {
      throw new NotFoundException("Avaliação não encontrada");
    }

    if (review.volunteerId !== volunteer.id) {
      throw new ForbiddenException("Você não pode excluir avaliação de outro voluntário");
    }

    // Validação: prazo de 48 horas após check-in
    const checkInTime = review.application.checkInAt;
    if (!checkInTime) {
      throw new BadRequestException("Check-in não encontrado");
    }

    const now = new Date();
    const hoursSinceCheckIn =
      (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

    if (hoursSinceCheckIn > 48) {
      throw new BadRequestException(
        "O prazo de 48 horas para excluir esta avaliação já expirou"
      );
    }

    const ongId = review.ongId;

    await this.prisma.review.delete({
      where: { id },
    });

    // Atualiza média e total de avaliações da ONG
    await this.updateOngRatingStats(ongId);

    return { message: "Avaliação excluída com sucesso" };
  }

  // Listar avaliações de uma ONG (público)
  async findByOng(ongId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total, ongProfile] = await Promise.all([
      this.prisma.review.findMany({
        where: { ongId },
        include: {
          volunteer: {
            select: {
              id: true,
              fullName: true,
            },
          },
          event: {
            select: {
              id: true,
              title: true,
              startDate: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where: { ongId } }),
      this.prisma.ongProfile.findUnique({
        where: { id: ongId },
        select: {
          id: true,
          name: true,
          averageRating: true,
          totalReviews: true,
        },
      }),
    ]);

    if (!ongProfile) {
      throw new NotFoundException("ONG não encontrada");
    }

    return {
      ong: ongProfile,
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Voluntário lista candidaturas elegíveis para avaliação
  async findEligibleApplications(userId: string) {
    const volunteer = await this.prisma.volunteerProfile.findUnique({
      where: { userId },
    });

    if (!volunteer) {
      throw new ForbiddenException("Usuário não é um voluntário válido");
    }

    // Busca candidaturas com check-in feito e sem avaliação
    const applications = await this.prisma.eventApplication.findMany({
      where: {
        volunteerId: volunteer.id,
        checkedIn: true,
        review: null,
      },
      include: {
        event: {
          include: {
            ong: {
              select: {
                id: true,
                name: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        checkInAt: "desc",
      },
    });

    const now = new Date();

    // Filtra apenas eventos IN_PROGRESS ou COMPLETED dentro do prazo de 48h
    const eligible = applications
      .filter((app) => {
        const eventStatus = this.computeStatus(app.event);
        if (!["IN_PROGRESS", "COMPLETED"].includes(eventStatus)) {
          return false;
        }

        // Verifica prazo de 48h
        const checkInTime = app.checkInAt;
        if (!checkInTime) return false;

        const hoursSinceCheckIn =
          (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
        return hoursSinceCheckIn <= 48;
      })
      .map((app) => {
        const checkInTime = app.checkInAt!;
        const hoursSinceCheckIn =
          (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
        const hoursRemaining = Math.max(0, 48 - hoursSinceCheckIn);

        return {
          applicationId: app.id,
          event: {
            id: app.event.id,
            title: app.event.title,
            description: app.event.description,
            startDate: app.event.startDate,
            location: app.event.location,
            ong: app.event.ong,
            category: app.event.category,
          },
          checkInAt: app.checkInAt,
          hoursRemaining: Math.round(hoursRemaining * 10) / 10,
          canReview: hoursRemaining > 0,
        };
      });

    return eligible;
  }

  // Voluntário lista suas próprias avaliações
  async findMyReviews(userId: string) {
    const volunteer = await this.prisma.volunteerProfile.findUnique({
      where: { userId },
    });

    if (!volunteer) {
      throw new ForbiddenException("Usuário não é um voluntário válido");
    }

    return this.prisma.review.findMany({
      where: { volunteerId: volunteer.id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startDate: true,
          },
        },
        ong: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
