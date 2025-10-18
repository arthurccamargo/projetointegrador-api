import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { volunteerProfile: true, ongProfile: true },
    });

    if (!user) throw new UnauthorizedException("E-mail ou senha inválidos");

    const passwordMatch = await bcrypt.compare(pass, user.password);
    if (!passwordMatch) throw new UnauthorizedException("E-mail ou senha inválidos");

    // remove senha antes de retornar
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
