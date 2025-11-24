import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateReviewDto {
  @ApiProperty({
    description: 'Nota de 1 a 5 estrelas',
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'A nota deve ser um número inteiro' })
  @Min(1, { message: 'A nota mínima é 1' })
  @Max(5, { message: 'A nota máxima é 5' })
  rating?: number;

  @ApiProperty({
    description: 'Comentário opcional sobre a experiência',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
