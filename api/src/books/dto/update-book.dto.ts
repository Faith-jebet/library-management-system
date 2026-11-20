import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';

// Same rules as CreateBookDto, but every field is optional (for PATCH)
export class UpdateBookDto extends PartialType(CreateBookDto) {}