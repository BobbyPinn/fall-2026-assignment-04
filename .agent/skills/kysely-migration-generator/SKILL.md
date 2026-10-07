---
name: kysely-migration-generator
description: Turns a Mermaid ERD (docs/architecture/schema.mmd) into a Kysely database migration. Use when the user asks to make a Kysely migration or database tables from an ERD or schema.mmd.
---

# Kysely Migration Generator

1. Read `docs/architecture/schema.mmd`.
2. Look at `src/db/migrations/001_initial_schema.ts` for the style to follow. The `users` table already exists there, so do not create it again.

## Rules

- **Table names:** lowercase snake_case (`BOOK_AUTHORS` → `book_authors`).
- **PK:** `.addColumn('id', 'serial', (col) => col.primaryKey())`
- **FK:** an `integer` column with `.references('<table>.id').onDelete('cascade')`
- **Types:** `int` → `integer`, `string` → `varchar(255)`, `date` → `date`, `timestamp` → `timestamp`, `boolean` → `boolean`
- **`||--o{` (one-to-many):** put the FK on the "many" table.
- **`||--o|` (one-to-one):** put the FK on the dependent table and add `.unique()`.

## Output

- Save the file as `src/db/migrations/002_<name>.ts` (e.g. `002_library_schema.ts`).
- Export `up(db: Kysely<any>)` and `down(db: Kysely<any>)`.
- `up`: create parent tables before tables that point to them.
- `down`: drop tables in reverse order. Never drop `users`.

After writing it, run `npm run build` and `npm run migrate:up`. If either fails, fix the file and try again.