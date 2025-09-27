import { SetMetadata } from "@nestjs/common";

// atalho para marcar endpoints com as roles necessárias ex: @Roles("ONG", "ADMIN")
export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
