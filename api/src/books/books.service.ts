import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BookQueryDto } from './dto/book-query.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookDto) {
    await this.ensureGenreExists(dto.genreId);
    await this.ensureIsbnFree(dto.isbn);
    return this.prisma.book.create({ data: dto, include: { genre: true } });
  }

  async findAll(query: BookQueryDto) {
    const { search, genreId, page = 1, limit = 10 } = query;

    // Build the "where" clause from whichever filters were provided
    const where: Prisma.BookWhereInput = {};
    if (genreId) where.genreId = genreId;
    if (search) {
      // matches if the search text appears in the title OR the author, ignoring case
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Pagination: skip the books on earlier pages, take only one page's worth
    const [data, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        include: { genre: true },
        orderBy: { id: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.book.count({ where }), // total matching books, for the client
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id }, include: { genre: true } });
    if (!book) throw new NotFoundException(`Book ${id} not found`); // 404
    return book;
  }

  async update(id: number, dto: UpdateBookDto) {
    const book = await this.findOne(id);
    if (dto.genreId) await this.ensureGenreExists(dto.genreId);
    if (dto.isbn && dto.isbn !== book.isbn) await this.ensureIsbnFree(dto.isbn);
    return this.prisma.book.update({ where: { id }, data: dto, include: { genre: true } });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }

  private async ensureGenreExists(genreId: number) {
    const genre = await this.prisma.genre.findUnique({ where: { id: genreId } });
    if (!genre) throw new NotFoundException(`Genre ${genreId} not found`);
  }

  private async ensureIsbnFree(isbn: string) {
    const existing = await this.prisma.book.findUnique({ where: { isbn } });
    if (existing) throw new ConflictException('A book with this ISBN already exists'); // 409
  }
}