import {
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  Min,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateEventDto {
  @ApiPropertyOptional({
    example: "Distribuição de Alimentos - ATUALIZADO",
    description: "Novo título do evento",
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: "Descrição atualizada do evento",
    description: "Nova descrição do evento",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: "2024-12-26T10:00:00Z",
    description: "Nova data e hora de início",
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: 180,
    description: "Nova duração em minutos (mínimo 30)",
    minimum: 30,
  })
  @IsInt()
  @Min(30)
  @IsOptional()
  durationMinutes?: number;

  @ApiPropertyOptional({
    example: "Novo local do evento",
    description: "Novo endereço do evento",
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    example: 25,
    description: "Novo número máximo de candidatos",
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxCandidates?: number;

  @ApiPropertyOptional({
    example: "clxy987654321",
    description: "Novo ID da categoria",
  })
  @IsString()
  @IsOptional()
  categoryId?: string;
}
