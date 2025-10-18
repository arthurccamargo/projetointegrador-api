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
import { EventService } from "./event.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { RolesGuard } from "../../common/guard/roles.guard";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserPayload } from "../auth/types/users-payload";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("events")
@UseGuards(JwtAuthGuard, RolesGuard) // protege todas as rotas do controller
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @Roles("ONG") // só ONGs podem criar evento
  create(@Body() dto: CreateEventDto, @CurrentUser() user: UserPayload) {
    return this.eventService.create({
      ...dto,
      userId: user.sub,
    });
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get("my")
  @Roles("ONG", "ADMIN")
  findMyEvents(@CurrentUser() user: UserPayload) {
    return this.eventService.findEventsByOngUserId(user.sub);
  }

  @Get("my/active")
  @Roles("ONG")
  findMyActiveEvents(@CurrentUser() user: UserPayload) {
    return this.eventService.findActiveEventsByOngUserId(user.sub);
  }

  @Get("my/past")
  @Roles("ONG")
  findMyPastEvents(@CurrentUser() user: UserPayload) {
    return this.eventService.findPastEventsByOngUserId(user.sub);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(":id")
  @Roles("ONG")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateEventDto,
    @CurrentUser() user: UserPayload
  ) {
    return this.eventService.update(id, dto, user.sub);
  }

  @Delete(":id")
  @Roles("ONG", "ADMIN")
  remove(@Param("id") id: string, @CurrentUser() user: UserPayload) {
    return this.eventService.remove(id, user.sub);
  }
}
