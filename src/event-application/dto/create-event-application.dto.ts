import { IsNotEmpty, IsString } from "class-validator";

export class CreateEventApplicationDto {
  @IsString()
  @IsNotEmpty()
  eventId!: string;
}
