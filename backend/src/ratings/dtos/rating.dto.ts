import { IsNumber, Min, Max, IsString } from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  @Min(0)
  @Max(10)
  value!: number;

  @IsString()
  userName!: string; // Only userName
}