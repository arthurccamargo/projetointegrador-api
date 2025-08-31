import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

// DTO base
export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}

// DTO para Volunteer
export class CreateVolunteerDto {
  @IsString()
  fullName!: string;

  @IsString()
  cpf!: string;

  @IsOptional()
  birthDate?: Date;

  @IsOptional()
  phone?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  state?: string;

  @IsOptional()
  experiences?: string;
}

// DTO para ONG
export class CreateOngDto {
  @IsString()
  cnpj!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  responsibleName!: string;

  @IsString()
  responsibleCpf!: string;

  @IsString()
  responsibleEmail!: string;

  @IsOptional()
  @IsString()
  documentUrl?: string;
}
