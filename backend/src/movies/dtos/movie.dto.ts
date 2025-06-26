import { IsString, IsNotEmpty, IsNumber, Min, Max, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  ratings!: number;

  @IsArray()
  @ArrayNotEmpty()
  actors!: string[]; // actor names or ids
}