import { Controller, Post, Patch, Param, Body, UseGuards, Get } from "@nestjs/common";
import { EventApplicationService } from "./event-application.service";
import { CreateEventApplicationDto } from "./dto/create-event-application.dto";
import { UpdateEventApplicationDto } from "./dto/update-event-application.dto";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard";
import { RolesGuard } from "../../common/guard/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UserPayload } from "../auth/types/users-payload";

@Controller("applications")
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventApplicationController {
  constructor(private readonly service: EventApplicationService) {}

  @Post()
  @Roles("VOLUNTEER")
  apply(@Body() dto: CreateEventApplicationDto, @CurrentUser() user: UserPayload) {
    return this.service.apply(dto, user.sub);
  }

  @Get("past") // Histórico: eventos COMPLETED ou CANCELLED onde o voluntário tinha candidatura
  @Roles("VOLUNTEER")
  findMyPastEvents(@CurrentUser() user: UserPayload) {
    return this.service.findMyPastEvents(user.sub);
  }

  @Get("active") // Eventos ativos: SCHEDULED ou IN_PROGRESS com candidatura ativa
  @Roles("VOLUNTEER")
  findMyActiveEvents(@CurrentUser() user: UserPayload) {
    return this.service.findMyActiveEvents(user.sub);
  }

  @Get("event/:eventId")
  @Roles("ONG")
  findAllByEventForOng(
    @Param("eventId") eventId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.service.findAllByEventForOng(eventId, user.sub);
  }

  @Patch(":id/status")
  @Roles("ONG")
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateEventApplicationDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.service.updateStatus(id, dto, user.sub);
  }

  @Patch(":id/cancel")
  @Roles("VOLUNTEER")
  cancel(@Param("id") id: string, @CurrentUser() user: UserPayload) {
    return this.service.cancel(id, user.sub);
  }
}
