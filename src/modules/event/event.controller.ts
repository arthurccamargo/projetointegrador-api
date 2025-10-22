import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import { EventService } from "./event.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { RolesGuard } from "../../common/guard/roles.guard";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserPayload } from "../auth/types/users-payload";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags('Events')
@ApiBearerAuth('JWT-auth')
@Controller("events")
@UseGuards(JwtAuthGuard, RolesGuard) // protege todas as rotas do controller
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @Roles("ONG")
  @ApiOperation({ summary: 'Criar novo evento (apenas ONGs)' })
  @ApiResponse({
    status: 201,
    description: 'Evento criado com sucesso',
    schema: {
      example: {
        id: 'clxy123456789',
        title: 'Distribuição de Alimentos',
        description: 'Evento para distribuição de alimentos',
        startDate: '2024-12-25T09:00:00Z',
        durationMinutes: 120,
        location: 'Rua das Flores, 123',
        maxCandidates: 20,
        status: 'SCHEDULED',
        categoryId: 'clxy987654321',
        userId: 'clxy111222333',
        createdAt: '2024-01-15T10:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Apenas ONGs podem criar eventos' })
  create(@Body() dto: CreateEventDto, @CurrentUser() user: UserPayload) {
    return this.eventService.create({
      ...dto,
      userId: user.sub,
    });
  }

  @Get() // GET eventos SCHEDULED nao aplicados pelo user ou todos eventos caso visitante
  @ApiOperation({ 
    summary: 'Listar eventos disponíveis',
    description: 'Retorna eventos SCHEDULED. Para voluntários, filtra eventos não aplicados. Para visitantes/ONGs, retorna todos eventos SCHEDULED.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos SCHEDULED não aplicados pelo usuário',
  })
  findAll(@CurrentUser() user: UserPayload) {
    return this.eventService.findAll(user.sub);
  }

  @Get("my")
  @Roles("ONG", "ADMIN")
  @ApiOperation({ summary: 'Listar meus eventos (apenas ONGs)' })
  @ApiResponse({ status: 200, description: 'Lista de todos os eventos da ONG' })
  @ApiResponse({ status: 403, description: 'Apenas ONGs podem acessar' })
  findMyEvents(@CurrentUser() user: UserPayload) {
    return this.eventService.findEventsByOngUserId(user.sub);
  }

  @Get("my/active")
  @Roles("ONG")
  @ApiOperation({ summary: 'Listar meus eventos ativos (apenas ONGs)' })
  @ApiResponse({ status: 200, description: 'Lista de eventos SCHEDULED e IN_PROGRESS' })
  @ApiResponse({ status: 403, description: 'Apenas ONGs podem acessar' })
  findMyActiveEvents(@CurrentUser() user: UserPayload) {
    return this.eventService.findActiveEventsByOngUserId(user.sub);
  }

  @Get("my/past")
  @Roles("ONG")
  @ApiOperation({ summary: 'Listar meus eventos passados (apenas ONGs)' })
  @ApiResponse({ status: 200, description: 'Lista de eventos COMPLETED e CANCELLED' })
  @ApiResponse({ status: 403, description: 'Apenas ONGs podem acessar' })
  findMyPastEvents(@CurrentUser() user: UserPayload) {
    return this.eventService.findPastEventsByOngUserId(user.sub);
  }

  @Get(":id")
  @ApiOperation({ summary: 'Buscar evento por ID' })
  @ApiParam({ name: 'id', description: 'ID do evento', example: 'clxy123456789' })
  @ApiResponse({ status: 200, description: 'Detalhes do evento' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  findOne(@Param("id") id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(":id")
  @Roles("ONG")
  @ApiOperation({ summary: 'Atualizar evento (apenas ONG criadora)' })
  @ApiParam({ name: 'id', description: 'ID do evento', example: 'clxy123456789' })
  @ApiResponse({ status: 200, description: 'Evento atualizado com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão para editar este evento' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateEventDto,
    @CurrentUser() user: UserPayload
  ) {
    return this.eventService.update(id, dto, user.sub);
  }

  @Delete(":id")
  @Roles("ONG", "ADMIN")
  @ApiOperation({ summary: 'Excluir evento' })
  @ApiParam({ name: 'id', description: 'ID do evento', example: 'clxy123456789' })
  @ApiResponse({ status: 200, description: 'Evento excluído com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão para excluir este evento' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  remove(@Param("id") id: string, @CurrentUser() user: UserPayload) {
    return this.eventService.remove(id, user.sub);
  }
}
