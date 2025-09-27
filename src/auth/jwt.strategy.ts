import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserPayload } from "./types/users-payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrai o token do header HTTP
      ignoreExpiration: false, // tokens expirados vão ser rejeitados automaticamente
      secretOrKey: process.env.JWT_SECRET || "super_secret_key", // super_secret_key nao recomendado em prod
    });
  }

  // método roda depois que o token é validado e decodificado
  async validate(payload: UserPayload) {
    // popula req.user com as informações do token
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
