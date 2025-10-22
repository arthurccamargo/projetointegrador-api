import { ApplicationStatus } from "@prisma/client";
import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateEventApplicationDto {
  @ApiProperty({
    enum: ApplicationStatus,
    example: "APPROVED",
    description: "Novo status da candidatura (PENDING, APPROVED, REJECTED, CANCELLED)",
  })
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;
}