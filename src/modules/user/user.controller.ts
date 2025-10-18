import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
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

  /* rota protegida -> precisa de Authorization: Bearer <token>
  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  getProfile(@Req() req) {
    return req.user; // vem do JwtStrategy.validate()
  }
  */
}

