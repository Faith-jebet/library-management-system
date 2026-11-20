import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // connect to the database when the app starts
  }

  async onModuleDestroy() {
    await this.$disconnect(); // close the connection when the app stops
  }
}