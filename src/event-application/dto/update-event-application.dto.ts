import { ApplicationStatus } from "@prisma/client";
import { IsEnum } from "class-validator";
''
export class UpdateEventApplicationDto {
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;
}