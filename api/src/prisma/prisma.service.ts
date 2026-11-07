import { Injectable, onModuleInit } from '@nestjs/common';
import { PrismaP } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';


@Injectable()
export class PrismaService extends PrismaClient implements onModuleInit {
    constructor() {
        super({
            adapter: new PrismaP({
                connectionString: process.env.DATABASE_URL 
            }),
        });
    }

    async onModuleInit() {
        await this.$connect();
    }
}