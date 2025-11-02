import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateOngUserDto, CreateVolunteerUserDto } from "./dto/create-user.dto";
import { UpdateVolunteerDto, UpdateOngDto } from "./dto/update-user.dto";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateVolunteerUserDto | CreateOngUserDto) {
    const { email, password, role } = data;

    if (!["VOLUNTEER", "ONG"].includes(role)) {
      throw new BadRequestException("Invalid role");
    }

    // Verifica se email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException("Email já existe");
    }

    // Verifica se CPF já existe apenas para VOLUNTEER
    if (role === "VOLUNTEER") {
      const { cpf } = data as CreateVolunteerUserDto;
      const existingCpf = await this.prisma.volunteerProfile.findUnique({
        where: { cpf },
      });

      if (existingCpf) {
        throw new BadRequestException("CPF já existe");
      }
    }

    // Verifica se CNPJ já existe apenas para ONG
    if (role === "ONG") {
      const { cnpj } = data as CreateOngUserDto;
      const existingCnpj = await this.prisma.ongProfile.findUnique({
        where: { cnpj },
      });

      if (existingCnpj) {
        throw new BadRequestException("CNPJ já existe");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userStatus = role === "VOLUNTEER" ? "ACTIVE" : "PENDING";

    // Cria o usuário com o perfil apropriado ONG ou Voluntário
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        status: userStatus,
        volunteerProfile:
          role === "VOLUNTEER"
            ? {
                create: {
                  fullName: (data as CreateVolunteerUserDto).fullName,
                  cpf: (data as CreateVolunteerUserDto).cpf,
                  birthDate: (data as CreateVolunteerUserDto).birthDate
                    ? new Date((data as CreateVolunteerUserDto).birthDate!)
                    : undefined,
                  phone: (data as CreateVolunteerUserDto).phone,
                  cep: (data as CreateVolunteerUserDto).cep || null,
                  street: (data as CreateVolunteerUserDto).street,
                  number: (data as CreateVolunteerUserDto).number,
                  complement: (data as CreateVolunteerUserDto).complement,
                  neighborhood: (data as CreateVolunteerUserDto).neighborhood,
                  city: (data as CreateVolunteerUserDto).city,
                  state: (data as CreateVolunteerUserDto).state,
                  experiences: (data as CreateVolunteerUserDto).experiences,
                },
              }
            : undefined,
        ongProfile:
          role === "ONG"
            ? {
                create: {
                  name: (data as CreateOngUserDto).name,
                  cnpj: (data as CreateOngUserDto).cnpj,
                  description: (data as CreateOngUserDto).description,
                  cep: (data as CreateOngUserDto).cep,
                  street: (data as CreateOngUserDto).street,
                  number: (data as CreateOngUserDto).number,
                  complement: (data as CreateOngUserDto).complement,
                  neighborhood: (data as CreateOngUserDto).neighborhood,
                  city: (data as CreateOngUserDto).city,
                  state: (data as CreateOngUserDto).state,
                  responsibleName: (data as CreateOngUserDto).responsibleName,
                  responsibleCpf: (data as CreateOngUserDto).responsibleCpf,
                  responsibleEmail: (data as CreateOngUserDto).responsibleEmail,
                  documentUrl: (data as CreateOngUserDto).documentUrl,
                },
              }
            : undefined,
      },
      include: {
        volunteerProfile: true,
        ongProfile: true,
      },
    });

    // Remove a senha do retorno
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Atualiza o perfil de um voluntário
   */
  async updateVolunteerProfile(userId: string, data: UpdateVolunteerDto) {
    // Verifica se o usuário existe e é VOLUNTEER
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { volunteerProfile: true },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    if (user.role !== "VOLUNTEER") {
      throw new BadRequestException("Usuário não é um voluntário");
    }

    if (!user.volunteerProfile) {
      throw new NotFoundException("Perfil de voluntário não encontrado");
    }

    // Atualiza o perfil do voluntário
    const updatedProfile = await this.prisma.volunteerProfile.update({
      where: { userId },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        experiences: data.experiences,
        cep: data.cep,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
      },
    });

    return updatedProfile;
  }

  /**
   * Atualiza o perfil de uma ONG
   */
  async updateOngProfile(userId: string, data: UpdateOngDto) {
    // Verifica se o usuário existe e é ONG
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { ongProfile: true },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    if (user.role !== "ONG") {
      throw new BadRequestException("Usuário não é uma organização");
    }

    if (!user.ongProfile) {
      throw new NotFoundException("Perfil de organização não encontrado");
    }

    // Atualiza o perfil da ONG
    const updatedProfile = await this.prisma.ongProfile.update({
      where: { userId },
      data: {
        name: data.name,
        description: data.description,
        cep: data.cep,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        responsibleName: data.responsibleName,
        responsibleCpf: data.responsibleCpf,
        documentUrl: data.documentUrl,
      },
    });

    return updatedProfile;
  }

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        volunteerProfile: true,
        ongProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
