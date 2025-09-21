import {
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  Min,
} from "class-validator";

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsInt()
  @Min(30)
  @IsOptional()
  durationMinutes?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxCandidates?: number;

  @IsString()
  @IsOptional()
  categoryId?: string;
}
