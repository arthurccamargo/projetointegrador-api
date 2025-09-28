import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    const exists = await this.prisma.category.findUnique({
      where: { name: data.name },
    });

    if (exists) {
      throw new BadRequestException("Categoria já existe");
    }

    return this.prisma.category.create({ data });
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException("Categoria não encontrada");
    return category;
  }

  async update(id: string, data: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException("Categoria não encontrada");
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException("Categoria não encontrada");

    const fallbackCategory = await this.prisma.category.findUnique({
      where: { name: "Outros" },
    });

    if (!fallbackCategory) {
      throw new BadRequestException(
        'Categoria "Outros" não existe. Crie antes de continuar.'
      );
    }

    // Reatribuir eventos para a categoria "Outros"
    await this.prisma.event.updateMany({
      where: { categoryId: id },
      data: { categoryId: fallbackCategory.id },
    });

    return this.prisma.category.delete({ where: { id } });
  }
}
