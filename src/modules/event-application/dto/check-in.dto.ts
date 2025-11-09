import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CheckInDto {
  @ApiProperty({
    description: 'Código de check-in de 6 dígitos',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6, { message: 'O código deve ter exatamente 6 dígitos' })
  code!: string;
}
