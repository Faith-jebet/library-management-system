# Library Management System

A library book catalog API built with NestJS, Prisma and PostgreSQL (hosted on Supabase).

## Setup

1. Go into the `api` folder and install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in your real `DATABASE_URL`
3. Apply the migrations: `npx prisma migrate dev`
4. Generate the Prisma client: `npx prisma generate`
5. Seed the database: `npx prisma db seed`

## Schema Decisions

### Why Book references Genre instead of embedding it

Each Book stores a `genreId` foreign key that points to a row in the Genre table, instead of embedding the genre's data inside the book record. I chose this because:

- **Single source of truth:** a genre's name lives in one place. Renaming "Sci-Fi" to "Science Fiction" is one update, not a change across every book.
- **No duplication or drift:** embedding would copy the genre into every book, and inconsistent spellings like "History" and "history" could create duplicate categories.
- **Referential integrity:** the database guarantees every book points to a genre that actually exists.
- **Easy querying:** listing all books in a genre, or counting books per genre, is a simple indexed lookup.

### Other decisions

- `Role` is an enum (`PATRON`, `LIBRARIAN`), so an invalid role can't be stored in the database.
- `isbn` on Book and `email` on User are unique, which prevents duplicate books and duplicate accounts.