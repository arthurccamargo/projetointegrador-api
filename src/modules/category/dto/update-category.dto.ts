import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCategoryDto {
    @ApiPropertyOptional({
      example: 'Educação Infantil',
      description: 'Novo nome da categoria',
    })
    @IsOptional()
    @IsString()
    name?: string;
}