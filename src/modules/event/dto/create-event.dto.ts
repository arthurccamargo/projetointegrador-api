import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateEventDto {
  @ApiProperty({
    example: "Distribuição de Alimentos",
    description: "Título do evento",
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({
    example: "Evento para distribuição de alimentos para famílias carentes",
    description: "Descrição detalhada do evento",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: "2024-12-25T09:00:00Z",
    description: "Data e hora de início do evento no formato ISO 8601",
  })
  @IsDateString()
  startDate!: string;

  @ApiProperty({
    example: 120,
    description: "Duração do evento em minutos (mínimo 30)",
    minimum: 30,
  })
  @IsInt()
  @Min(30)
  durationMinutes!: number;

  @ApiProperty({
    example: "Rua das Flores, 123 - Centro",
    description: "Local onde o evento acontecerá",
  })
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty({
    example: 20,
    description: "Número máximo de candidatos aceitos (mínimo 1)",
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  maxCandidates!: number;

  @ApiProperty({
    example: "clxy123456789",
    description: "ID da categoria do evento",
  })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;
}
