# yogaDiary

Diario personal de prácticas de yoga y meditación. Proyecto personal, mayo 2026.

## Stack

- **Next.js 16** (App Router) + **TypeScript** estricto
- **Tailwind CSS** para estilos
- **Prisma** + **SQLite** (local) — migrable a Postgres
- **Zod** para validación con discriminated unions
- **Vitest** (unit) + **Playwright** (E2E)
- **ESLint** + **Prettier**
- **GitHub Actions** para CI

## Setup

Requiere Node 24+.

```bash
git clone <repo>
cd yogaDiary
npm install
cp .env.example .env
npx prisma migrate dev      # crea la base SQLite y aplica migraciones
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando                | Qué hace                                   |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Levanta el dev server                      |
| `npm run build`        | Build de producción                        |
| `npm run lint`         | ESLint                                     |
| `npm run typecheck`    | `tsc --noEmit`                             |
| `npm run format`       | Formatea con Prettier                      |
| `npm test`             | Tests unitarios (Vitest, modo watch)       |
| `npm test -- --run`    | Tests unitarios en CI mode                 |
| `npm run test:e2e`     | Tests E2E (Playwright, levanta dev server) |
| `npm run db:migrate`   | Crea/aplica migraciones Prisma             |
| `npm run db:studio`    | Abre Prisma Studio                         |

## Modelo de dominio

Una sola entidad `Practice` con un campo `type` ('yoga' \| 'meditation') y columnas opcionales según el tipo. Validación con `z.discriminatedUnion` en `src/lib/schemas.ts`.

**Campos comunes**: `date`, `durationMin`, `guidance` (en vivo / grabada / autoguiada), `moodBefore`, `moodAfter`, `notes`.

**Específicos de yoga**: `yogaStyle` (vinyasa, hatha, ashtanga, yin, restorative, other).

**Específicos de meditación**: `focusObject` (breath, mantra, body_scan, sound, visualization, other), `position` (bed, chair, zafu, floor, cushion, other).

## Decisiones técnicas

- **Modelo unificado** en vez de entidades separadas: simplifica el listado del diario (una sola query, una sola tabla, una sola UI base) y las queries de estadísticas futuras.
- **SQLite local** para empezar sin setup; el `provider` en `prisma/schema.prisma` se cambia a `postgresql` cuando se quiera desplegar.
- **TypeScript estricto** con `noUncheckedIndexedAccess` para bandera de calidad visible.
- **PR workflow** aunque sea de una sola persona: cada feature en una rama, PR contra `main`, CI corre todo, squash-merge.

## Roadmap

Ver issues abiertas en GitHub para próximas iteraciones (estadísticas, catálogo de asanas, integración con Claude API, PWA, auth, etc.).
