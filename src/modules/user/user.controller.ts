import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import {
  CreateVolunteerUserDto,
  CreateOngUserDto,
} from "./dto/create-user.dto";

@ApiTags('Users')
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('volunteer')
  @ApiOperation({ summary: 'Cadastrar novo voluntário' })
  @ApiResponse({
    status: 201,
    description: 'Voluntário cadastrado com sucesso',
    schema: {
      example: {
        id: 'clxy123456789',
        email: 'voluntario@example.com',
        role: 'VOLUNTEER',
        createdAt: '2024-01-15T10:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email ou CPF já cadastrado' })
  async createVolunteer(@Body() dto: CreateVolunteerUserDto) {
    return this.userService.createUser(dto);
  }

  @Post('ong')
  @ApiOperation({ summary: 'Cadastrar nova ONG' })
  @ApiResponse({
    status: 201,
    description: 'ONG cadastrada com sucesso',
    schema: {
      example: {
        id: 'clxy987654321',
        email: 'ong@example.com',
        role: 'ONG',
        createdAt: '2024-01-15T10:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email ou CNPJ já cadastrado' })
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

