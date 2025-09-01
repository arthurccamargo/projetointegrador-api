import {
  Body,
  Controller,
  Post,
} from "@nestjs/common";
import { UserService } from "./user.service";
import {
  CreateVolunteerUserDto,
  CreateOngUserDto,
} from "./dto/create-user.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('volunteer')
  async createVolunteer(@Body() dto: CreateVolunteerUserDto) {
    return this.userService.createUser(dto);
  }

  @Post('ong')
  async createOng(@Body() dto: CreateOngUserDto) {
    return this.userService.createUser(dto);
  }
}

