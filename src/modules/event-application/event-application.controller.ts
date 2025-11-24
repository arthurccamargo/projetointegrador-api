import { Controller, Post, Patch, Param, Body, UseGuards, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import { EventApplicationService } from "./event-application.service";
import { CreateEventApplicationDto } from "./dto/create-event-application.dto";
import { UpdateEventApplicationDto } from "./dto/update-event-application.dto";
import { CheckInDto } from "./dto/check-in.dto";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard";
import { RolesGuard } from "../../common/guard/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UserPayload } from "../auth/types/users-payload";

@ApiTags('Applications')
@ApiBearerAuth('JWT-auth')
@Controller("applications")
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventApplicationController {
  constructor(private readonly service: EventApplicationService) {}

  @Post()
  @Roles("VOLUNTEER")
  @ApiOperation({ summary: 'Candidatar-se a um evento (apenas voluntários)' })
  @ApiResponse({
    status: 201,
    description: 'Candidatura criada com sucesso',
    schema: {
      example: {
        id: 'clxy123456789',
        eventId: 'clxy987654321',
        userId: 'clxy111222333',
        status: 'PENDING',
        appliedAt: '2024-01-15T10:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Apenas voluntários podem se candidatar' })
  @ApiResponse({ status: 409, description: 'Já existe uma candidatura para este evento' })
  apply(@Body() dto: CreateEventApplicationDto, @CurrentUser() user: UserPayload) {
    return this.service.apply(dto, user.sub);
  }

  @Get("notifications")
  @Roles("VOLUNTEER")
  @ApiOperation({ 
    summary: 'Notificações de check-in para voluntários',
    description: 'Retorna eventos IN_PROGRESS onde o voluntário tem candidatura ACCEPTED e ainda não fez check-in.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos que começaram e aguardam check-in',
  })
  @ApiResponse({ status: 403, description: 'Apenas voluntários podem acessar' })
  getNotifications(@CurrentUser() user: UserPayload) {
    return this.service.getVolunteerNotifications(user.sub);
  }

  @Get("past")
  @Roles("VOLUNTEER")
  @ApiOperation({ 
    summary: 'Histórico de eventos do voluntário',
    description: 'Retorna eventos COMPLETED ou CANCELLED, OU eventos SCHEDULED/IN_PROGRESS onde o voluntário cancelou a candidatura',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos COMPLETED ou CANCELLED com candidatura',
  })
  @ApiResponse({ status: 403, description: 'Apenas voluntários podem acessar' })
  findMyPastEvents(@CurrentUser() user: UserPayload) {
    return this.service.findMyPastEvents(user.sub);
  }

  @Get("active")
  @Roles("VOLUNTEER")
  @ApiOperation({ 
    summary: 'Eventos ativos do voluntário',
    description: 'Retorna eventos SCHEDULED ou IN_PROGRESS onde o voluntário tem candidatura PENDING ou ACCEPTED',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos SCHEDULED ou IN_PROGRESS com candidatura ativa',
  })
  @ApiResponse({ status: 403, description: 'Apenas voluntários podem acessar' })
  findMyActiveEvents(@CurrentUser() user: UserPayload) {
    return this.service.findMyActiveEvents(user.sub);
  }

  @Get("event/:eventId")
  @Roles("ONG")
  @ApiOperation({ 
    summary: 'Listar candidaturas de um evento',
    description: 'Retorna apenas candidaturas PENDING ou ACCEPTED. Apenas a ONG criadora do evento pode acessar.',
  })
  @ApiParam({ name: 'eventId', description: 'ID do evento', example: 'clxy123456789' })
  @ApiResponse({ status: 200, description: 'Lista de candidaturas do evento' })
  @ApiResponse({ status: 403, description: 'Sem permissão para ver candidaturas deste evento' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  findAllByEventForOng(
    @Param("eventId") eventId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.service.findAllByEventForOng(eventId, user.sub);
  }

  @Patch(":id/status")
  @Roles("ONG")
  @ApiOperation({ 
    summary: 'Atualizar status de candidatura',
    description: 'ONG pode alterar status para ACCEPTED ou REJECTED. Se rejeitar uma candidatura PENDING ou ACCEPTED, a vaga é liberada (currentCandidates decrementa).',
  })
  @ApiParam({ name: 'id', description: 'ID da candidatura', example: 'clxy123456789' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão para atualizar esta candidatura' })
  @ApiResponse({ status: 404, description: 'Candidatura não encontrada' })
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateEventApplicationDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.service.updateStatus(id, dto, user.sub);
  }

  @Patch(":id/cancel")
  @Roles("VOLUNTEER")
  @ApiOperation({ 
    summary: 'Cancelar candidatura',
    description: 'Voluntário cancela sua própria candidatura. Status muda para CANCELLED e a vaga é liberada (currentCandidates decrementa).',
  })
  @ApiParam({ name: 'id', description: 'ID da candidatura', example: 'clxy123456789' })
  @ApiResponse({ status: 200, description: 'Candidatura cancelada com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão para cancelar esta candidatura' })
  @ApiResponse({ status: 404, description: 'Candidatura não encontrada' })
  cancel(@Param("id") id: string, @CurrentUser() user: UserPayload) {
    return this.service.cancel(id, user.sub);
  }

  @Post("check-in/:eventId")
  @Roles("VOLUNTEER")
  @ApiOperation({ 
    summary: 'Fazer check-in no evento (apenas voluntários)',
    description: 'Voluntário confirma presença usando o código de 6 dígitos fornecido pela ONG. O código é validado e a presença é registrada na candidatura.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Check-in realizado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Código inválido ou evento não está IN_PROGRESS' })
  @ApiResponse({ status: 403, description: 'Apenas voluntários podem fazer check-in' })
  @ApiResponse({ status: 404, description: 'Evento ou candidatura não encontrada' })
  checkIn(
    @Param("eventId") eventId: string,
    @Body() dto: CheckInDto,
    @CurrentUser() user: UserPayload
  ) {
    return this.service.checkIn(eventId, dto.code, user.sub);
  }
}
