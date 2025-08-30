import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsString()
  fullName!: string;

  @IsString()
  cpf!: string;

  @IsOptional()
  birthDate?: Date;

  @IsOptional() @IsString()
  phone?: string;

  @IsOptional() @IsString()
  city?: string;

  @IsOptional() @IsString()
  state?: string;

  @IsOptional() @IsString()
  experiences?: string;
}
