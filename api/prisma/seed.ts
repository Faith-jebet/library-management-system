import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('librarian123', 10);
  await prisma.user.upsert({ // upsert = update if exists, otherwise create, so it's safe to re-run
    where: { email: 'librarian@library.com' },
    update: {},
    create: { email: 'librarian@library.com', password, role: 'LIBRARIAN' },
  });
  console.log('Librarian seeded');
}

main().finally(() => prisma.$disconnect());
