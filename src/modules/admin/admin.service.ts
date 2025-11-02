import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Listar todos os usuários (com filtros opcionais)
  async getAllUsers(role?: string, status?: UserStatus) {
    return this.prisma.user.findMany({
      where: {
        ...(role && { role: role as any }),
        ...(status && { status }),
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        volunteerProfile: {
          select: {
            fullName: true,
            cpf: true,
            phone: true,
          },
        },
        ongProfile: {
          select: {
            name: true,
            cnpj: true,
            responsibleName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Atualizar status de qualquer usuário (ACTIVE, BLOCKED, PENDING)
  async updateUserStatus(userId: string, status: UserStatus) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { 
        volunteerProfile: true, 
        ongProfile: true 
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Não permite alterar status de outros admins
    if (user.role === 'ADMIN') {
      throw new Error('Não é possível alterar status de administradores');
    }

    // Atualizar o status
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { status },
      include: { 
        volunteerProfile: true, 
        ongProfile: true 
      },
    });

    let message = '';
    const userName = user.volunteerProfile?.fullName || user.ongProfile?.name || user.email;
    
    switch (status) {
      case UserStatus.ACTIVE:
        message = `${user.role === 'ONG' ? 'ONG' : 'Voluntário'} "${userName}" ativado(a) com sucesso`;
        break;
      case UserStatus.BLOCKED:
        message = `${user.role === 'ONG' ? 'ONG' : 'Voluntário'} "${userName}" bloqueado(a) com sucesso`;
        break;
      case UserStatus.PENDING:
        message = `Status de "${userName}" alterado para PENDENTE`;
        break;
    }

    return {
      message,
      user: updatedUser,
    };
  }

  // Listar todas as ONGs (pendentes primeiro)
  async getAllOngs() {
    return this.prisma.user.findMany({
      where: { role: 'ONG' },
      include: {
        ongProfile: true,
      },
      orderBy: [
        { status: 'asc' }, // PENDING vem antes de ACTIVE
        { createdAt: 'desc' },
      ],
    });
  }

  // Listar todos os voluntários
  async getAllVolunteers() {
    return this.prisma.user.findMany({
      where: { role: 'VOLUNTEER' },
      include: {
        volunteerProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
