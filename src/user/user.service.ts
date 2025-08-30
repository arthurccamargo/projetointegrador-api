import { Injectable } from '@nestjs/common'; // indica que o NestJS pode injetar essa classe em outros módulos
import { PrismaService } from '../../prisma/prisma.service'; // cliente Prisma para acessar o banco de dados
import { CreateUserDto } from './dto/create-user.dto'; // DTO que define os campos que um usuário precisa para ser criado
import bcrypt from 'bcrypt'; // para criptografar senhas
 
@Injectable()
export class UserService {
  // injeta o PrismaService automaticamente para acessar o banco de dados
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Criar usuário
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role,
        volunteerProfile: data.role === 'VOLUNTEER'
          ? {
              create: {
                fullName: data.fullName,
                cpf: data.cpf,
                birthDate: data.birthDate,
                phone: data.phone,
                city: data.city,
                state: data.state,
                experiences: data.experiences,
              },
            }
          : undefined,
      },
      include: {
        volunteerProfile: true,
        ongProfile: true,
      },
    });

    return user;
  }
}
