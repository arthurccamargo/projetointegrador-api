import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

/*
 verifica se o usuário tem a role necessária para acessar o endpoint, exemplo:
    - Usuário tem role: "VOLUNTEER"

    - Endpoint exige @Roles("ONG")

    - Resultado → 403 Forbidden
*/
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>("roles", context.getHandler());

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // rota não tem roles específicas
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException("Usuário não autenticado");
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException("Acesso negado para este perfil");
    }

    return true;
  }
}