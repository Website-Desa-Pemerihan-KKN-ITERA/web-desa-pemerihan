# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Official website for Desa Pemerihan (Pemerihan Village), built with Next.js 16, React 19, TypeScript, Prisma ORM, PostgreSQL, and MinIO (S3-compatible object storage). The project uses Tailwind CSS v4 for styling.

## Development Setup

### Prerequisites

- Node.js 24
- Docker or Podman with Compose

### Initial Setup

```sh
docker compose up -d         # Start PostgreSQL + MinIO containers
npm install
npx prisma db push           # Apply schema to database
npx prisma generate          # Generate Prisma client artifacts
npm run dev                  # Start dev server
```

> Ensure `.env` is present at the project root before running. Prisma uses `DATABASE_URL` (from `prisma.config.ts`) and the app uses `DATABASE_URL_CLIENT` (from `libs/prisma.ts`).

### Key Commands

```sh
npm run dev        # Development server
npm run build      # prisma generate + next build
npm run lint       # ESLint
npm run format     # Prettier (REQUIRED before PRs)
npm run test       # Jest
npm run studio     # Prisma Studio (interactive DB viewer)
```

### Running a Single Test File

```sh
npx jest services/articleServices.test.ts --verbose
```

## Architecture

### Request Flow

API routes → `services/` (business logic) → `repository/` (database queries via Prisma) → `generated/prisma/`

- **`app/api/`** — Next.js Route Handlers. Handles request parsing, Zod validation, JWT auth, and calls service functions.
- **`services/`** — Business logic layer. Returns typed discriminated unions (`{ success: true, ... } | { success: false, error, message }`).
- **`repository/`** — Raw Prisma database calls. No business logic here.
- **`helpers/`** — Pure utility functions: JWT signing/verification (`jwtHelper.ts`, `authHelper.ts`), request body validation (`requestHelper.ts`), slug generation, formatting, etc.
- **`libs/`** — Infrastructure singletons: `prisma.ts` (Prisma client with pg adapter), `awsS3Action.ts` (server actions for MinIO/S3), `config/` (JWT and S3 configuration from env vars).

### Frontend Structure

- **`app/`** — Next.js App Router pages
  - `app/page.tsx` — Public homepage
  - `app/article/[slug]/` — Article detail pages
  - `app/shop/`, `app/location/`, `app/tentang/` — Public pages
  - `app/auth/login/`, `app/auth/register/` — Auth pages
  - `app/admin/dashboard/` — Protected admin area (article, shop, tourspot, accounts management)
- **`components/shared/`** — Layout components (Header, Footer, ClientLayout, dashboardSidebar) and reusable UI (newsSection, topTourspot, topProducts, etc.)
- **`components/nonShared/`** — Page-specific components (edit forms, galleries, redirect buttons)

### Database Models (Prisma)

`User`, `Article`, `ShopItems`, `Location` — defined in `prisma/schema.prisma`. Generated client output goes to `generated/prisma/`.

### Image Storage

MinIO is used as an S3-compatible object store. `libs/awsS3Action.ts` (marked `"use server"`) handles presigned upload/download URLs and object deletion. Images are stored by UUID-named keys. The S3 client supports both local MinIO and Supabase Storage via `SUPABASE_BUCKET_LINK` env override.

### Authentication

JWT-based auth. Tokens are signed with `jsonwebtoken` using `JWT_SECRET` from env (defaults to a hardcoded fallback in development). Passwords hashed with bcryptjs. JWT expiry is 1 hour. The `validateJwtAuthHelper` function in `helpers/authHelper.ts` is used in all protected API routes.

### Zod Validation

All API route inputs are validated with Zod. `helpers/requestHelper.ts` provides `validateBody()` for request bodies. `z.treeifyError()` is used for detailed error responses.

## Environment Variables

Key variables required in `.env`:

- `DATABASE_URL` — Used by Prisma CLI (migrations, studio)
- `DATABASE_URL_CLIENT` — Used at runtime by the Prisma client (`libs/prisma.ts`)
- `JWT_SECRET` — JWT signing secret
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT` — PostgreSQL docker config
- `MINIO_ENDPOINT`, `MINIO_PORT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET_NAME`, `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`, `MINIO_USE_SSL`
- `SUPABASE_BUCKET_LINK` — Optional override to use Supabase Storage instead of local MinIO

## PR Requirements

Run `npm run format` before every pull request (enforced by project convention).

## Testing

Tests live in `services/` alongside the files they test (e.g., `articleServices.test.ts`). Tests use Jest with module mocking (`jest.mock`) to isolate service logic from repository dependencies. Test environment is `node`.
