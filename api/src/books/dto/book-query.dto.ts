import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

// Validates the query string: GET /books?search=achebe&genreId=1&page=2&limit=5
export class BookQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number) // query values arrive as text, so convert to a number first
  @IsInt()
  genreId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1; // which page you want (default: the first)

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10; // how many books per page (default: 10)
}