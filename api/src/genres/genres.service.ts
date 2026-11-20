import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto, UpdateGenreDto } from './dto/genre.dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateGenreDto) {
    return this.prisma.genre.create({ data: dto });
  }

  findAll() {
    return this.prisma.genre.findMany();
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) throw new NotFoundException(`Genre ${id} not found`); // 404
    return genre;
  }

  async update(id: number, dto: UpdateGenreDto) {
    await this.findOne(id); // reuses the 404 check
    return this.prisma.genre.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.genre.delete({ where: { id } });
  }
}