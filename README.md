# Caleidoscopio

Personal diary for yoga and meditation practices. Personal project, May 2026.

## Stack

- **Next.js 16** (App Router) + strict **TypeScript**
- **Tailwind CSS** for styling
- **Prisma** + **SQLite** (local) — migratable to Postgres
- **Zod** for validation with discriminated unions
- **Vitest** (unit) + **Playwright** (E2E)
- **ESLint** + **Prettier**
- **GitHub Actions** for CI

## Setup

Requires Node 24+.

```bash
git clone <repo>
cd caleidoscopio
npm install
cp .env.example .env
npx prisma migrate dev      # creates the SQLite database and applies migrations
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                | What it does                                |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Start the dev server                        |
| `npm run build`        | Production build                            |
| `npm run lint`         | ESLint                                      |
| `npm run typecheck`    | `tsc --noEmit`                              |
| `npm run format`       | Format with Prettier                        |
| `npm test`             | Unit tests (Vitest, watch mode)             |
| `npm test -- --run`    | Unit tests in CI mode                       |
| `npm run test:e2e`     | E2E tests (Playwright, starts the dev server) |
| `npm run db:migrate`   | Create/apply Prisma migrations              |
| `npm run db:studio`    | Open Prisma Studio                          |

## Domain model

A single `Practice` entity with a `type` field ('yoga' \| 'meditation') and optional columns depending on the type. Validation via `z.discriminatedUnion` in `src/lib/schemas.ts`.

**Shared fields**: `date`, `durationMin`, `guidance` (live / recorded / self-guided), `moodBefore`, `moodAfter`, `notes`.

**Yoga-specific**: `yogaStyle` (vinyasa, hatha, ashtanga, yin, restorative, other).

**Meditation-specific**: `focusObject` (breath, mantra, body_scan, sound, visualization, other), `position` (bed, chair, zafu, floor, cushion, other).

## Technical decisions

- **Unified model** instead of separate entities: simplifies the diary listing (one query, one table, one base UI) and future stats queries.
- **Local SQLite** to start with no setup; the `provider` in `prisma/schema.prisma` switches to `postgresql` when it's time to deploy.
- **Strict TypeScript** with `noUncheckedIndexedAccess` as a visible quality signal.
- **PR workflow** even as a solo project: each feature on its own branch, PR against `main`, CI runs everything, squash-merge.

## Roadmap

See open issues on GitHub for upcoming iterations (stats, asana catalog, Claude API integration, PWA, auth, etc.).
