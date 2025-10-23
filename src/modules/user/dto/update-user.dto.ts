import {
  IsString,
  IsOptional,
  Matches,
} from "class-validator";

/**
 * DTO para atualização de perfil de Voluntário
 * Todos os campos são opcionais (PATCH)
 */
export class UpdateVolunteerDto {
  @IsOptional()
  @IsString({ message: "Nome deve ser uma string" })
  fullName?: string;

  @IsOptional()
  @IsString({ message: "Telefone deve ser uma string" })
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: "Telefone deve estar no formato (XX) XXXXX-XXXX",
  })
  phone?: string;

  @IsOptional()
  @IsString({ message: "Experiências deve ser uma string" })
  experiences?: string;

  // Campos de endereço opcionais
  @IsOptional()
  @IsString({ message: "CEP deve ser uma string" })
  @Matches(/^\d{5}-?\d{3}$/, { message: "CEP deve estar no formato XXXXX-XXX" })
  cep?: string;

  @IsOptional()
  @IsString({ message: "Rua deve ser uma string" })
  street?: string;

  @IsOptional()
  @IsString({ message: "Número deve ser uma string" })
  number?: string;

  @IsOptional()
  @IsString({ message: "Complemento deve ser uma string" })
  complement?: string;

  @IsOptional()
  @IsString({ message: "Bairro deve ser uma string" })
  neighborhood?: string;

  @IsOptional()
  @IsString({ message: "Cidade deve ser uma string" })
  city?: string;

  @IsOptional()
  @IsString({ message: "Estado deve ser uma string" })
  state?: string;
}

/**
 * DTO para atualização de perfil de ONG
 * Todos os campos são opcionais (PATCH)
 */
export class UpdateOngDto {
  @IsOptional()
  @IsString({ message: "Nome da ONG deve ser uma string" })
  name?: string;

  @IsOptional()
  @IsString({ message: "Descrição deve ser uma string" })
  description?: string;

  // Campos de endereço opcionais
  @IsOptional()
  @IsString({ message: "CEP deve ser uma string" })
  @Matches(/^\d{5}-?\d{3}$/, { message: "CEP deve estar no formato XXXXX-XXX" })
  cep?: string;

  @IsOptional()
  @IsString({ message: "Rua deve ser uma string" })
  street?: string;

  @IsOptional()
  @IsString({ message: "Número deve ser uma string" })
  number?: string;

  @IsOptional()
  @IsString({ message: "Complemento deve ser uma string" })
  complement?: string;

  @IsOptional()
  @IsString({ message: "Bairro deve ser uma string" })
  neighborhood?: string;

  @IsOptional()
  @IsString({ message: "Cidade deve ser uma string" })
  city?: string;

  @IsOptional()
  @IsString({ message: "Estado deve ser uma string" })
  state?: string;

  @IsOptional()
  @IsString({ message: "Nome do responsável deve ser uma string" })
  responsibleName?: string;

  @IsOptional()
  @IsString({ message: "CPF do responsável deve ser uma string" })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: "CPF deve estar no formato XXX.XXX.XXX-XX",
  })
  responsibleCpf?: string;

  @IsOptional()
  @IsString({ message: "URL do documento deve ser uma string" })
  documentUrl?: string;
}
