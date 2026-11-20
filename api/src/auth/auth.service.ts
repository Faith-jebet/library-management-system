import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered'); // 409

    const hash = await bcrypt.hash(dto.password, 10); // scramble the password before saving
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hash },
    });
    return { id: user.id, email: user.email, role: user.role }; // never return the password
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    const valid = user && (await bcrypt.compare(dto.password, user.password));
    if (!user || !valid) throw new UnauthorizedException('Invalid credentials'); // 401

    const token = await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role });
    return { access_token: token };
  }
}