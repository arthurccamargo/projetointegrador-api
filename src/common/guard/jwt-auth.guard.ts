import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/*
 para proteger as rotas e garantir que o usuário está autenticado com um JWT válido 
    - Extrai o token do Authorization: Bearer <token>

    - Valida assinatura, expiração e secret (JwtStrategy)

    - Se válido → coloca os dados do usuário (req.user)

    - Se inválido/ausente → 401 Unauthorized
 */

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
