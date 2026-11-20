import { IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateGenreDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

// Same rules, but every field becomes optional (for PATCH)
export class UpdateGenreDto extends PartialType(CreateGenreDto) {}