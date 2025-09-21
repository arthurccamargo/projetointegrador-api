import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  startDate!: string;

  @IsInt()
  @Min(30) // pelo menos 30 min
  durationMinutes!: number;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsInt()
  @Min(1)
  maxCandidates!: number;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsString()
  @IsNotEmpty()
  ongId!: string;
}
