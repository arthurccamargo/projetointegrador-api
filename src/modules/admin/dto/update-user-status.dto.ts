import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class UpdateUserStatusDto {
  @ApiProperty({
    enum: UserStatus,
    example: 'ACTIVE',
    description: 'Novo status do usuário (PENDING, ACTIVE ou BLOCKED)',
    examples: {
      active: {
        value: 'ACTIVE',
        description: 'Ativar usuário - permite login e uso do sistema',
      },
      blocked: {
        value: 'BLOCKED',
        description: 'Bloquear usuário - impede login e acesso',
      },
      pending: {
        value: 'PENDING',
        description: 'Marcar como pendente - aguardando aprovação',
      },
    },
  })
  @IsEnum(UserStatus)
  status!: UserStatus;
}
