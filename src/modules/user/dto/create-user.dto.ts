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
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email do usuário',
  })
  @IsEmail({}, { message: "Email deve ser válido" })
  @IsNotEmpty({ message: "Email é obrigatório" })
  email!: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsString({ message: "Password deve ser uma string" })
  @MinLength(6, { message: "Password deve ter pelo menos 6 caracteres" })
  @IsNotEmpty({ message: "Password é obrigatório" })
  password!: string;

  @ApiProperty({
    enum: UserRole,
    example: 'VOLUNTEER',
    description: 'Papel do usuário no sistema',
  })
  @IsEnum(UserRole, { message: "Role deve ser VOLUNTEER ou ONG ou ADMIN" })
  @IsNotEmpty({ message: "Role é obrigatório" })
  role!: UserRole;
}

export class CreateVolunteerDto {
  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do voluntário',
  })
  @IsString({ message: "Nome deve ser uma string" })
  @IsNotEmpty({ message: "Nome é obrigatório" })
  fullName!: string;

  @ApiProperty({
    example: '123.456.789-00',
    description: 'CPF do voluntário no formato XXX.XXX.XXX-XX',
  })
  @IsString({ message: "CPF deve ser uma string" })
  @IsNotEmpty({ message: "CPF é obrigatório" })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: "CPF deve estar no formato XXX.XXX.XXX-XX",
  })
  cpf!: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Data de nascimento no formato ISO 8601',
  })
  @IsOptional()
  birthDate?: string;

  @ApiPropertyOptional({
    example: '(11) 98765-4321',
    description: 'Telefone no formato (XX) XXXXX-XXXX',
  })
  @IsOptional()
  @IsString({ message: "Telefone deve ser uma string" })
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: "Telefone deve estar no formato (XX) XXXXX-XXXX",
  })
  phone?: string;

  @ApiPropertyOptional({
    example: '01310-100',
    description: 'CEP no formato XXXXX-XXX',
  })
  @IsOptional()
  @IsString({ message: "CEP deve ser uma string" })
  @Matches(/^\d{5}-?\d{3}$/, { message: "CEP deve estar no formato XXXXX-XXX" })
  cep?: string;

  @ApiPropertyOptional({
    example: 'Avenida Paulista',
    description: 'Nome da rua',
  })
  @IsOptional()
  @IsString({ message: "Rua deve ser uma string" })
  street?: string;

  @ApiPropertyOptional({
    example: '1578',
    description: 'Número do endereço',
  })
  @IsOptional()
  @IsString({ message: "Número deve ser uma string" })
  number?: string;

  @ApiPropertyOptional({
    example: 'Apto 101',
    description: 'Complemento do endereço',
  })
  @IsOptional()
  @IsString({ message: "Complemento deve ser uma string" })
  complement?: string;

  @ApiPropertyOptional({
    example: 'Bela Vista',
    description: 'Bairro',
  })
  @IsOptional()
  @IsString({ message: "Bairro deve ser uma string" })
  neighborhood?: string;

  @ApiPropertyOptional({
    example: 'São Paulo',
    description: 'Cidade',
  })
  @IsOptional()
  @IsString({ message: "Cidade deve ser uma string" })
  city?: string;

  @ApiPropertyOptional({
    example: 'SP',
    description: 'Estado (sigla)',
  })
  @IsOptional()
  @IsString({ message: "Estado deve ser uma string" })
  state?: string;

  @ApiPropertyOptional({
    example: 'Trabalho voluntário em eventos educacionais',
    description: 'Experiências prévias do voluntário',
  })
  @IsOptional()
  @IsString({ message: "Experiências deve ser uma string" })
  experiences?: string;
}

export class CreateOngDto {
  @ApiProperty({
    example: 'ONG Esperança',
    description: 'Nome da ONG',
  })
  @IsString({ message: "Nome da ONG deve ser uma string" })
  @IsNotEmpty({ message: "Nome da ONG é obrigatório" })
  name!: string;

  @ApiProperty({
    example: '12.345.678/0001-99',
    description: 'CNPJ da ONG no formato XX.XXX.XXX/XXXX-XX',
  })
  @IsString({ message: "CNPJ deve ser uma string" })
  @IsNotEmpty({ message: "CNPJ é obrigatório" })
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: "CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX",
  })
  cnpj!: string;

  @ApiPropertyOptional({
    example: 'ONG dedicada a ajudar comunidades carentes',
    description: 'Descrição da ONG e suas atividades',
  })
  @IsOptional()
  @IsString({ message: "Descrição deve ser uma string" })
  description?: string;

  @ApiProperty({
    example: '01310-100',
    description: 'CEP no formato XXXXX-XXX',
  })
  @IsString({ message: "CEP deve ser uma string" })
  @IsNotEmpty({ message: "CEP é obrigatório" })
  @Matches(/^\d{5}-?\d{3}$/, { message: "CEP deve estar no formato XXXXX-XXX" })
  cep!: string;

  @ApiProperty({
    example: 'Avenida Paulista',
    description: 'Nome da rua',
  })
  @IsString({ message: "Rua deve ser uma string" })
  @IsNotEmpty({ message: "Rua é obrigatória" })
  street!: string;

  @ApiPropertyOptional({
    example: '1578',
    description: 'Número do endereço',
  })
  @IsOptional()
  @IsString({ message: "Número deve ser uma string" })
  number?: string;

  @ApiPropertyOptional({
    example: 'Sala 10',
    description: 'Complemento do endereço',
  })
  @IsOptional()
  @IsString({ message: "Complemento deve ser uma string" })
  complement?: string;

  @ApiProperty({
    example: 'Bela Vista',
    description: 'Bairro',
  })
  @IsString({ message: "Bairro deve ser uma string" })
  @IsNotEmpty({ message: "Bairro é obrigatório" })
  neighborhood!: string;

  @ApiProperty({
    example: 'São Paulo',
    description: 'Cidade',
  })
  @IsString({ message: "Cidade deve ser uma string" })
  @IsNotEmpty({ message: "Cidade é obrigatória" })
  city!: string;

  @ApiProperty({
    example: 'SP',
    description: 'Estado (sigla)',
  })
  @IsString({ message: "Estado deve ser uma string" })
  @IsNotEmpty({ message: "Estado é obrigatório" })
  state!: string;

  @ApiProperty({
    example: 'Maria Santos',
    description: 'Nome completo do responsável legal',
  })
  @IsString({ message: "Nome do responsável deve ser uma string" })
  @IsNotEmpty({ message: "Nome do responsável é obrigatório" })
  responsibleName!: string;

  @ApiProperty({
    example: '987.654.321-00',
    description: 'CPF do responsável no formato XXX.XXX.XXX-XX',
  })
  @IsString({ message: "CPF do responsável deve ser uma string" })
  @IsNotEmpty({ message: "CPF do responsável é obrigatório" })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: "CPF deve estar no formato XXX.XXX.XXX-XX",
  })
  responsibleCpf!: string;

  @ApiProperty({
    example: 'responsavel@ong.com.br',
    description: 'Email do responsável legal',
  })
  @IsEmail({}, { message: "Email do responsável deve ser um email válido" })
  @IsNotEmpty({ message: "Email do responsável é obrigatório" })
  responsibleEmail!: string;

  @ApiPropertyOptional({
    example: 'https://storage.example.com/docs/estatuto.pdf',
    description: 'URL do documento de registro da ONG',
  })
  @IsOptional()
  @IsString({ message: "URL do documento deve ser uma string" })
  documentUrl?: string;
}

export class CreateVolunteerUserDto extends IntersectionType(
  CreateUserDto,
  CreateVolunteerDto
) {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email do usuário',
  })
  @IsEmail({}, { message: "Email deve ser válido" })
  @IsNotEmpty({ message: "Email é obrigatório" })
  email!: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsString({ message: "Password deve ser uma string" })
  @MinLength(6, { message: "Password deve ter pelo menos 6 caracteres" })
  @IsNotEmpty({ message: "Password é obrigatório" })
  password!: string;

  @ApiProperty({
    enum: UserRole,
    example: 'VOLUNTEER',
    description: 'Deve ser VOLUNTEER para este endpoint',
    default: 'VOLUNTEER',
  })
  @IsEnum(UserRole, { message: "Role deve ser VOLUNTEER ou ONG ou ADMIN" })
  @IsNotEmpty({ message: "Role é obrigatório" })
  role!: UserRole;

  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do voluntário',
  })
  @IsString({ message: "Nome deve ser uma string" })
  @IsNotEmpty({ message: "Nome é obrigatório" })
  fullName!: string;

  @ApiProperty({
    example: '123.456.789-00',
    description: 'CPF do voluntário no formato XXX.XXX.XXX-XX',
  })
  @IsString({ message: "CPF deve ser uma string" })
  @IsNotEmpty({ message: "CPF é obrigatório" })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: "CPF deve estar no formato XXX.XXX.XXX-XX",
  })
  cpf!: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Data de nascimento no formato ISO 8601',
  })
  @IsOptional()
  birthDate?: string;

  @ApiPropertyOptional({
    example: '(11) 98765-4321',
    description: 'Telefone no formato (XX) XXXXX-XXXX',
  })
  @IsOptional()
  @IsString({ message: "Telefone deve ser uma string" })
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: "Telefone deve estar no formato (XX) XXXXX-XXXX",
  })
  phone?: string;

  @ApiPropertyOptional({
    example: '01310-100',
    description: 'CEP no formato XXXXX-XXX',
  })
  @IsOptional()
  @IsString({ message: "CEP deve ser uma string" })
  @Matches(/^\d{5}-?\d{3}$/, { message: "CEP deve estar no formato XXXXX-XXX" })
  cep?: string;

  @ApiPropertyOptional({
    example: 'Avenida Paulista',
    description: 'Nome da rua',
  })
  @IsOptional()
  @IsString({ message: "Rua deve ser uma string" })
  street?: string;

  @ApiPropertyOptional({
    example: '1578',
    description: 'Número do endereço',
  })
  @IsOptional()
  @IsString({ message: "Número deve ser uma string" })
  number?: string;

  @ApiPropertyOptional({
    example: 'Apto 101',
    description: 'Complemento do endereço',
  })
  @IsOptional()
  @IsString({ message: "Complemento deve ser uma string" })
  complement?: string;

  @ApiPropertyOptional({
    example: 'Bela Vista',
    description: 'Bairro',
  })
  @IsOptional()
  @IsString({ message: "Bairro deve ser uma string" })
  neighborhood?: string;

  @ApiPropertyOptional({
    example: 'São Paulo',
    description: 'Cidade',
  })
  @IsOptional()
  @IsString({ message: "Cidade deve ser uma string" })
  city?: string;

  @ApiPropertyOptional({
    example: 'SP',
    description: 'Estado (sigla)',
  })
  @IsOptional()
  @IsString({ message: "Estado deve ser uma string" })
  state?: string;

  @ApiPropertyOptional({
    example: 'Trabalho voluntário em eventos educacionais',
    description: 'Experiências prévias do voluntário',
  })
  @IsOptional()
  @IsString({ message: "Experiências deve ser uma string" })
  experiences?: string;
}

export class CreateOngUserDto extends IntersectionType(
  CreateUserDto,
  CreateOngDto
) {
  @ApiProperty({
    example: 'ong@example.com',
    description: 'Email da ONG',
  })
  @IsEmail({}, { message: "Email deve ser válido" })
  @IsNotEmpty({ message: "Email é obrigatório" })
  email!: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsString({ message: "Password deve ser uma string" })
  @MinLength(6, { message: "Password deve ter pelo menos 6 caracteres" })
  @IsNotEmpty({ message: "Password é obrigatório" })
  password!: string;

  @ApiProperty({
    enum: UserRole,
    example: 'ONG',
    description: 'Deve ser ONG para este endpoint',
    default: 'ONG',
  })
  @IsEnum(UserRole, { message: "Role deve ser VOLUNTEER ou ONG ou ADMIN" })
  @IsNotEmpty({ message: "Role é obrigatório" })
  role!: UserRole;

  @ApiProperty({
    example: 'ONG Esperança',
    description: 'Nome da ONG',
  })
  @IsString({ message: "Nome da ONG deve ser uma string" })
  @IsNotEmpty({ message: "Nome da ONG é obrigatório" })
  name!: string;

  @ApiProperty({
    example: '12.345.678/0001-99',
    description: 'CNPJ da ONG no formato XX.XXX.XXX/XXXX-XX',
  })
  @IsString({ message: "CNPJ deve ser uma string" })
  @IsNotEmpty({ message: "CNPJ é obrigatório" })
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: "CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX",
  })
  cnpj!: string;

  @ApiPropertyOptional({
    example: 'ONG dedicada a ajudar comunidades carentes',
    description: 'Descrição da ONG e suas atividades',
  })
  @IsOptional()
  @IsString({ message: "Descrição deve ser uma string" })
  description?: string;

  @ApiProperty({
    example: '01310-100',
    description: 'CEP no formato XXXXX-XXX',
  })
  @IsString({ message: "CEP deve ser uma string" })
  @IsNotEmpty({ message: "CEP é obrigatório" })
  @Matches(/^\d{5}-?\d{3}$/, { message: "CEP deve estar no formato XXXXX-XXX" })
  cep!: string;

  @ApiProperty({
    example: 'Avenida Paulista',
    description: 'Nome da rua',
  })
  @IsString({ message: "Rua deve ser uma string" })
  @IsNotEmpty({ message: "Rua é obrigatória" })
  street!: string;

  @ApiPropertyOptional({
    example: '1578',
    description: 'Número do endereço',
  })
  @IsOptional()
  @IsString({ message: "Número deve ser uma string" })
  number?: string;

  @ApiPropertyOptional({
    example: 'Sala 10',
    description: 'Complemento do endereço',
  })
  @IsOptional()
  @IsString({ message: "Complemento deve ser uma string" })
  complement?: string;

  @ApiProperty({
    example: 'Bela Vista',
    description: 'Bairro',
  })
  @IsString({ message: "Bairro deve ser uma string" })
  @IsNotEmpty({ message: "Bairro é obrigatório" })
  neighborhood!: string;

  @ApiProperty({
    example: 'São Paulo',
    description: 'Cidade',
  })
  @IsString({ message: "Cidade deve ser uma string" })
  @IsNotEmpty({ message: "Cidade é obrigatória" })
  city!: string;

  @ApiProperty({
    example: 'SP',
    description: 'Estado (sigla)',
  })
  @IsString({ message: "Estado deve ser uma string" })
  @IsNotEmpty({ message: "Estado é obrigatório" })
  state!: string;

  @ApiProperty({
    example: 'Maria Santos',
    description: 'Nome completo do responsável legal',
  })
  @IsString({ message: "Nome do responsável deve ser uma string" })
  @IsNotEmpty({ message: "Nome do responsável é obrigatório" })
  responsibleName!: string;

  @ApiProperty({
    example: '987.654.321-00',
    description: 'CPF do responsável no formato XXX.XXX.XXX-XX',
  })
  @IsString({ message: "CPF do responsável deve ser uma string" })
  @IsNotEmpty({ message: "CPF do responsável é obrigatório" })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: "CPF deve estar no formato XXX.XXX.XXX-XX",
  })
  responsibleCpf!: string;

  @ApiProperty({
    example: 'responsavel@ong.com.br',
    description: 'Email do responsável legal',
  })
  @IsEmail({}, { message: "Email do responsável deve ser um email válido" })
  @IsNotEmpty({ message: "Email do responsável é obrigatório" })
  responsibleEmail!: string;

  @ApiPropertyOptional({
    example: 'https://storage.example.com/docs/estatuto.pdf',
    description: 'URL do documento de registro da ONG',
  })
  @IsOptional()
  @IsString({ message: "URL do documento deve ser uma string" })
  documentUrl?: string;
}
