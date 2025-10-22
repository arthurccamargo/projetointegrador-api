import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEventApplicationDto {
  @ApiProperty({
    example: "clxy123456789",
    description: "ID do evento para o qual deseja se candidatar",
  })
  @IsString()
  @IsNotEmpty()
  eventId!: string;
}
