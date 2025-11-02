import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserStatus } from '@prisma/client';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Listar todos os usuários (apenas Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async getAllUsers(
    @Query('role') role?: string,
    @Query('status') status?: UserStatus,
  ) {
    return this.adminService.getAllUsers(role, status);
  }

  @Patch('users/:id/status')
  @ApiOperation({ 
    summary: 'Atualizar status de qualquer usuário (ONG ou Voluntário)',
    description: 'Permite ativar, bloquear ou marcar como pendente qualquer usuário. Não funciona para outros admins.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Status atualizado com sucesso',
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Não é possível alterar status de administradores' 
  })
  async updateUserStatus(
    @Param('id') userId: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(userId, dto.status);
  }

  @Get('ongs')
  @ApiOperation({ summary: 'Listar todas as ONGs cadastradas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ONGs',
  })
  async getAllOngs() {
    return this.adminService.getAllOngs();
  }

  @Get('volunteers')
  @ApiOperation({ summary: 'Listar todos os voluntários cadastrados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de voluntários',
  })
  async getAllVolunteers() {
    return this.adminService.getAllVolunteers();
  }
}
