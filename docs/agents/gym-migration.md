# Agente: migrar Gym a `@diego-brunetto/ui`

Este documento es la guía operativa para un agente que trabaja **dentro del repo de la app** (`gym-workout-tracker`), no en este kit. El kit ya cubre los casos de uso de Gym (Stepper con hold/edit, List, Chip, ConfirmDialog sheet, Button link, Textarea, íconos, PageHeader sticky, BottomNav fixed). La migración de pantallas vive en Linear bajo el milestone **Migración Gym**.

## Principios

1. **La librería manda en lo visual.** No preserve el tema actual de Gym (Geist, tokens propios de shadcn). Usá las semillas del README de este kit (bloque “Gym”).
2. **No reimplementes componentes del kit.** Si falta algo, anotalo en el ticket de Linear y seguí con un workaround mínimo.
3. **Sin `components/ui/*` ni `lucide-react` al cerrar.** Íconos del kit (`Icon name="…"`). Toasts del kit (`Toaster` / `toast`), no sonner.
4. **Orden de tickets:** BRU-31 → BRU-32 → BRU-33 → BRU-34 → BRU-35. No saltees el install.

## Prerrequisitos del kit (ya hechos en brunetto-ui)

| Ticket | Qué aporta a Gym |
| --- | --- |
| BRU-23 | `Stepper`: hold, tap-to-edit, `quickSteps`, `value={null}`, `size="lg"` |
| BRU-25 | `List` / `ListHeader` / `ListItem` (+ `renderLink`) |
| BRU-9 | `Chip` / `ChipGroup` |
| BRU-26 | `Button` con `href` + `renderLink` (mismo contrato que SideNav) |
| BRU-24 | `ConfirmDialog variant="sheet"` |
| BRU-27 | `Textarea` dentro de `Field` |
| BRU-28 | Íconos `footprints`, `bike`, `repeat`, `link`, `grip`, `clipboard` |
| BRU-29 | `PageHeader sticky` |
| BRU-30 | `BottomNav` `position="fixed"` + safe-area |

Pendiente opcional del kit (no bloquea el shell): **BRU-12** tema Recharts (hace falta para el cierre limpio de BRU-35 en gráficos). Si no está publicado, dejá el chart de la app con tokens `--chart-*` del kit y anotá el hueco.

Versión mínima del paquete: la que incluya esos PRs mergeados (post 0.2.1). Preferí la última publicada en GitHub Packages.

## Contrato `renderLink` (Next App Router)

```tsx
import Link from "next/link";
import type { RenderLink } from "@diego-brunetto/ui";

export const renderLink: RenderLink = ({ href, className, children, onClick, ...rest }) => (
  <Link href={href} className={className} onClick={onClick} {...rest}>
    {children}
  </Link>
);
```

Usalo en `BottomNav`, `List` y `Button href="…"`.

## BRU-31 — Instalar kit y tokens

Repo: `gym-workout-tracker`.

1. `.npmrc`:
   ```ini
   @diego-brunetto:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
   ```
2. Variable `GITHUB_PACKAGES_TOKEN` en Vercel (Preview + Production) y en local.
3. `pnpm add @diego-brunetto/ui@latest`.
4. `app/globals.css`:
   ```css
   @import "tailwindcss";
   @import "@diego-brunetto/ui/fonts.css";
   @import "@diego-brunetto/ui/styles.css";
   @import "@diego-brunetto/ui/tailwind.css";

   :root {
     --brand: #2563eb;
     --n-h: 262;
     --radius: 0.125rem;
     --cut: 0px;
     --motion: 0.65;
     --cardio: #0d9488;
     --record: #b45309;
   }
   .dark {
     --cardio: #2dd4bf;
     --record: #f59e0b;
   }
   ```
5. Mapeo rápido de tokens viejos → kit: `--record`/`--warning`, `--cardio` → `--info` o token `--cardio` propio, `--destructive` → `--danger`, `card` → `surface`.
6. Sacá Geist; tema oscuro con clase `.dark` en `<html>`.
7. Criterio: `pnpm build`, `pnpm test`, `tsc --noEmit` pasan; la app levanta en claro y oscuro.

## BRU-32 — Shell + Hoy

- `layout.tsx`: `BottomNav` (default fixed) + `Toaster`; `renderLink` a `Link` de Next. Reservá espacio:
  ```css
  main { padding-bottom: calc(6.5rem + env(safe-area-inset-bottom, 0px)); }
  ```
- `PageHeader sticky` en lugar de `components/page-header.tsx`.
- Hoy: `Chip`/`ChipGroup` para el día; `Stat`/`Progress` para racha y meta; `Button` para empezar; `Skeleton`/`EmptyState`.
- Heatmap: se queda en la app, solo tokens del kit.
- Criterio: Hoy sin `components/ui/*` ni lucide; probado en viewport móvil, claro/oscuro.

## BRU-33 — Tracker

Reemplazos 1:1:

| App hoy | Kit |
| --- | --- |
| `StepperInput` | `Stepper` (`size="lg"`, `quickSteps`, hold/edit) |
| `BottomSheet` | `Sheet` |
| `ConfirmSheet` | `ConfirmDialog variant="sheet"` |
| Exercise picker | `List`/`ListItem` + `Input` search (`affix` con `Icon name="search"`) |
| Resumen | `Stat`, `Achievement`, `Button href` |

`SetTable` y `RestDock` quedan en la app con primitivas del kit. Criterio: sesión completa en teléfono; sin shadcn/lucide en tracker.

## BRU-34 — Rutina + catálogo

- Tabs Días/Ejercicios: `Tabs` o `SegmentedControl`.
- Filas: `List`/`ListItem`; descanso: `Chip`.
- Crear/renombrar/editar: `Dialog` + `Field`/`Input`/`Textarea`/`Switch`.
- Borrar: `ConfirmDialog variant="sheet"`.
- Ordenar: dnd-kit + `Icon name="grip"`.
- Criterio: CRUD de días/ejercicios en teléfono; sin shadcn/lucide.

## BRU-35 — Progreso, Cardio y limpieza

- Progreso: `SegmentedControl`, `Sparkline`; charts con tokens `--chart-*` (idealmente helpers BRU-12).
- Cardio: `Sheet`, `Stepper`, `Chip` (tipo), `List` (entradas).
- Borrar: `components/ui/*`, `bottom-sheet`, `confirm-sheet`, `stepper-input`, `page-header`, `bottom-nav`, `sparkline`, `components.json`.
- Sacar deps huérfanas (lucide, sonner, vaul, cva, cmdk, etc. — ver ticket).
- Criterio: build/test/typecheck verdes.

## Checklist del agente

- [ ] Trabajá en el repo `gym-workout-tracker`, no en brunetto-ui.
- [ ] Un PR (o stack) por ticket BRU-31…35, en ese orden.
- [ ] Comentá en Linear cualquier hueco del kit descubierto.
- [ ] No mergees a main de Gym sin probar en emulación móvil (PWA) claro y oscuro.
- [ ] No inventes un segundo design system ni copies CSS de shadcn “por compatibilidad”.

## Referencias

- Paquete: `@diego-brunetto/ui` (GitHub Packages)
- Repo kit: https://github.com/diego-brunetto/brunetto-ui
- Proyecto Linear: https://linear.app/orpheus-app/project/brunetto-ui-990e995cc6a8
- Tickets app: BRU-31 … BRU-35 (milestone Migración Gym)
