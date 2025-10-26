import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Req,
  UseGuards,
  ForbiddenException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import {
  CreateVolunteerUserDto,
  CreateOngUserDto,
} from "./dto/create-user.dto";
import {
  UpdateVolunteerDto,
  UpdateOngDto,
} from "./dto/update-user.dto";

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

  @Patch('volunteer/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateVolunteerProfile(
    @Param('id') id: string,
    @Body() updateData: UpdateVolunteerDto,
    @Req() req
  ) {
    // req.user.sub é o ID do usuário (vem do JWT)
    if (req.user.sub !== id) {
      throw new ForbiddenException('Você só pode editar seu próprio perfil.')
    }

    return this.userService.updateVolunteerProfile(id, updateData);
  }

  @Patch('ong/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateOngProfile(
    @Param('id') id: string,
    @Body() updateData: UpdateOngDto,
    @Req() req
  ) {
    // req.user.sub é o ID do usuário (vem do JWT)
    if (req.user.sub !== id) {
      throw new ForbiddenException('Você só pode editar seu próprio perfil.')
    }

    return this.userService.updateOngProfile(id, updateData);
  }

  @Get(':id')
  async getUserProfile(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }
  
  /* rota protegida -> precisa de Authorization: Bearer <token>
  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  getProfile(@Req() req) {
    return req.user; // vem do JwtStrategy.validate()
  }
  */
}

