import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();

  const fiction = await prisma.genre.create({ data: { name: 'Fiction' } });
  const scifi = await prisma.genre.create({ data: { name: 'Science Fiction' } });
  const history = await prisma.genre.create({ data: { name: 'History' } });
  const tech = await prisma.genre.create({ data: { name: 'Technology' } });

  await prisma.book.createMany({
    data: [
      { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '9780385474542', publishedYear: 1958, genreId: fiction.id },
      { title: "Weep Not, Child", author: "Ngũgĩ wa Thiong'o", isbn: '9780435908300', publishedYear: 1964, genreId: fiction.id },
      { title: 'Half of a Yellow Sun', author: 'Chimamanda Ngozi Adichie', isbn: '9781400095209', publishedYear: 2006, genreId: fiction.id },
      { title: 'The Alchemist', author: 'Paulo Coelho', isbn: '9780062315007', publishedYear: 1988, genreId: fiction.id },

      { title: 'Dune', author: 'Frank Herbert', isbn: '9780441172719', publishedYear: 1965, genreId: scifi.id },
      { title: 'Neuromancer', author: 'William Gibson', isbn: '9780441569595', publishedYear: 1984, genreId: scifi.id },
      { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', isbn: '9780441478125', publishedYear: 1969, genreId: scifi.id },
      { title: 'Foundation', author: 'Isaac Asimov', isbn: '9780553293357', publishedYear: 1951, genreId: scifi.id },

      { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '9780062316110', publishedYear: 2011, genreId: history.id },
      { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: '9780393317558', publishedYear: 1997, genreId: history.id },
      { title: 'The Fate of Africa', author: 'Martin Meredith', isbn: '9781610396356', publishedYear: 2005, genreId: history.id },
      { title: "A People's History of the United States", author: 'Howard Zinn', isbn: '9780062397348', publishedYear: 1980, genreId: history.id },

      { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', publishedYear: 2008, genreId: tech.id },
      { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '9780135957059', publishedYear: 1999, genreId: tech.id },
      { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '9781449373320', publishedYear: 2017, genreId: tech.id },
      { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '9780262033848', publishedYear: 1990, genreId: tech.id },
    ],
  });

  console.log('Seeded 4 genres and 16 books');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());