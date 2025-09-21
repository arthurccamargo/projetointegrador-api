import { Controller, Get, Post, Body, Param, Patch, Delete } from "@nestjs/common";
import { EventService } from "./event.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";

@Controller("events")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.eventService.create(dto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateEventDto) {
    return this.eventService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.eventService.remove(id);
  }
}
