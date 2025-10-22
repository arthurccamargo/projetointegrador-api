import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "usuario@example.com",
    description: "Email do usuário cadastrado",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: "senha123",
    description: "Senha do usuário (mínimo 6 caracteres)",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
