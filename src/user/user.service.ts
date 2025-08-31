import { Injectable, BadRequestException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto, CreateVolunteerDto, CreateOngDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto & (CreateVolunteerDto | CreateOngDto)) {
    const { email, password, role } = data;

    // Valida role
    if (!["VOLUNTEER", "ONG"].includes(role)) {
      throw new BadRequestException("Invalid role");
    }

    // Verifica se email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário com o perfil apropriado ONG ou Voluntário
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        status: "PENDING",
        volunteerProfile:
          role === "VOLUNTEER"
            ? {
                create: {
                  fullName: (data as CreateVolunteerDto).fullName,
                  cpf: (data as CreateVolunteerDto).cpf,
                  birthDate: (data as CreateVolunteerDto).birthDate,
                  phone: (data as CreateVolunteerDto).phone,
                  city: (data as CreateVolunteerDto).city,
                  state: (data as CreateVolunteerDto).state,
                  experiences: (data as CreateVolunteerDto).experiences,
                },
              }
            : undefined,
        ongProfile:
          role === "ONG"
            ? {
                create: {
                  name: (data as CreateOngDto).name,
                  cnpj: (data as CreateOngDto).cnpj,
                  description: (data as CreateOngDto).description,
                  address: (data as CreateOngDto).address,
                  responsibleName: (data as CreateOngDto).responsibleName,
                  responsibleCpf: (data as CreateOngDto).responsibleCpf,
                  responsibleEmail: (data as CreateOngDto).responsibleEmail,
                  documentUrl: (data as CreateOngDto).documentUrl,
                },
              }
            : undefined,
      },
      include: {
        volunteerProfile: true,
        ongProfile: true,
      },
    });

    // Remove a senha do retorno por segurança
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}