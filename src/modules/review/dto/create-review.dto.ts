import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Max, Min, IsUUID } from "class-validator";

export class CreateReviewDto {
  @ApiProperty({
    description: 'Nota de 1 a 5 estrelas',
    minimum: 1,
    maximum: 5,
  })
  @IsInt({ message: 'A nota deve ser um número inteiro' })
  @Min(1, { message: 'A nota mínima é 1' })
  @Max(5, { message: 'A nota máxima é 5' })
  rating!: number;

  @ApiProperty({
    description: 'Comentário opcional sobre a experiência',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'ID da candidatura (application)',
  })
  @IsUUID('4', { message: 'ID da candidatura inválido' })
  applicationId!: string;
}
