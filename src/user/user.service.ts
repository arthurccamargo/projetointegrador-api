import { Injectable, BadRequestException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateOngUserDto, CreateVolunteerUserDto } from "./dto/create-user.dto";

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
      throw new BadRequestException("Email already exists");
    }

    // Verifica se CPF já existe apenas para VOLUNTEER
    if (role === "VOLUNTEER") {
      const { cpf } = data as CreateVolunteerUserDto;
      const existingCpf = await this.prisma.volunteerProfile.findUnique({
        where: { cpf },
      });

      if (existingCpf) {
        throw new BadRequestException("CPF already exists");
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
                  status: "PENDING",
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
}
