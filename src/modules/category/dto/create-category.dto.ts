import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
    @ApiProperty({
      example: 'Educação',
      description: 'Nome da categoria',
    })
    @IsString()
    @IsNotEmpty()
    name!: string;
}