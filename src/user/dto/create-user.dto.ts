import {
  IsEmail,
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  MinLength,
  IsNotEmpty,
  Matches,
} from "class-validator";
import { UserRole } from "@prisma/client";
import { IntersectionType } from "@nestjs/mapped-types";

export class CreateUserDto {
  @IsEmail({}, { message: "Email deve ser válido" })
  @IsNotEmpty({ message: "Email é obrigatório" })
  email!: string;

  @IsString({ message: "Password deve ser uma string" })
  @MinLength(6, { message: "Password deve ter pelo menos 6 caracteres" })
  @IsNotEmpty({ message: "Password é obrigatório" })
  password!: string;

  @IsEnum(UserRole, { message: "Role deve ser VOLUNTEER ou ONG ou ADMIN" })
  @IsNotEmpty({ message: "Role é obrigatório" })
  role!: UserRole;
}

export class CreateVolunteerDto {
  @IsString({ message: "Nome deve ser uma string" })
  @IsNotEmpty({ message: "Nome é obrigatório" })
  fullName!: string;

  @IsString({ message: "CPF deve ser uma string" })
  @IsNotEmpty({ message: "CPF é obrigatório" })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: "CPF deve estar no formato XXX.XXX.XXX-XX",
  })
  cpf!: string;

  @IsOptional()
  birthDate?: string;

  @IsOptional()
  @IsString({ message: "Telefone deve ser uma string" })
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: "Telefone deve estar no formato (XX) XXXXX-XXXX",
  })
  phone?: string;

  // Campos de endereço opcionais para voluntário
  @IsOptional()
  @IsString({ message: 'CEP deve ser uma string' })
  @Matches(/^\d{5}-?\d{3}$/, { message: "CEP deve estar no formato XXXXX-XXX" })
  cep?: string;

  @IsOptional()
  @IsString({ message: 'Rua deve ser uma string' })
  street?: string;

  @IsOptional()
  @IsString({ message: 'Número deve ser uma string' })
  number?: string;

  @IsOptional()
  @IsString({ message: 'Complemento deve ser uma string' })
  complement?: string;

  @IsOptional()
  @IsString({ message: 'Bairro deve ser uma string' })
  neighborhood?: string;

  @IsOptional()
  @IsString({ message: 'Cidade deve ser uma string' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Estado deve ser uma string' })
  state?: string;

  @IsOptional()
  @IsString({ message: 'Experiências deve ser uma string' })
  experiences?: string;
}

export class CreateOngDto {
  @IsString({ message: 'Nome da ONG deve ser uma string' })
  @IsNotEmpty({ message: 'Nome da ONG é obrigatório' })
  name!: string;

  @IsString({ message: 'CNPJ deve ser uma string' })
  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: "CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX",
  })
  cnpj!: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  // Campos de endereço obrigatórios para ONG
  @IsString({ message: 'CEP deve ser uma string' })
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @Matches(/^\d{5}-?\d{3}$/, { message: "CEP deve estar no formato XXXXX-XXX" })
  cep!: string;

  @IsString({ message: 'Rua deve ser uma string' })
  @IsNotEmpty({ message: 'Rua é obrigatória' })
  street!: string;

  @IsString({ message: 'Número deve ser uma string' })
  @IsNotEmpty({ message: 'Número é obrigatório' })
  number!: string;

  @IsOptional()
  @IsString({ message: 'Complemento deve ser uma string' })
  complement?: string;

  @IsString({ message: 'Bairro deve ser uma string' })
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  neighborhood!: string;

  @IsString({ message: 'Cidade deve ser uma string' })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  city!: string;

  @IsString({ message: 'Estado deve ser uma string' })
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  state!: string;

  @IsString({ message: 'Nome do responsável deve ser uma string' })
  @IsNotEmpty({ message: 'Nome do responsável é obrigatório' })
  responsibleName!: string;

  @IsString({ message: 'CPF do responsável deve ser uma string' })
  @IsNotEmpty({ message: 'CPF do responsável é obrigatório' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: "CPF deve estar no formato XXX.XXX.XXX-XX",
  })
  responsibleCpf!: string;

  @IsEmail({}, { message: 'Email do responsável deve ser um email válido' })
  @IsNotEmpty({ message: 'Email do responsável é obrigatório' })
  responsibleEmail!: string;

  @IsOptional()
  @IsString({ message: 'URL do documento deve ser uma string' })
  documentUrl?: string;
}

export class CreateVolunteerUserDto extends IntersectionType(CreateUserDto, CreateVolunteerDto) {}
export class CreateOngUserDto extends IntersectionType(CreateUserDto, CreateOngDto) {}
