# @diego-brunetto/ui

Tema base **Puerto** y componentes React para Gym, Finanzas y Orpheus. Tokens en OKLCH derivados de unas pocas semillas, títulos en Archivo ancho, números en Chivo Mono y esquinas biseladas en los rellenos.

Design system (guía de uso, tokens y previews): https://claude.ai/artifact/CHRCwsQcyv4bZZ5XiHtNKG

## Instalar

El paquete se publica en GitHub Packages. GitHub pide un token para instalar, aunque el paquete sea público.

1. Creá un token clásico con el permiso `read:packages` en https://github.com/settings/tokens.
2. En la app que lo usa, agregá un `.npmrc` (no lo subas con el token adentro; usá una variable de entorno):

```ini
@diego-brunetto:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

3. Instalá:

```bash
pnpm add @diego-brunetto/ui   # o npm install @diego-brunetto/ui
```

En Vercel o en CI, cargá `GITHUB_PACKAGES_TOKEN` como variable de entorno.

Pide `react` y `react-dom` 18.3 o 19.

## Usar

```css
/* app/globals.css (Next) o src/index.css (Vite) */
@import "tailwindcss";                      /* opcional */
@import "@diego-brunetto/ui/fonts.css";     /* Archivo y Chivo Mono desde Fontsource */
@import "@diego-brunetto/ui/styles.css";    /* tokens + componentes */
@import "@diego-brunetto/ui/tailwind.css";  /* opcional, Tailwind v4: bg-primary, text-muted-foreground… */
```

```tsx
import { Button, Field, Input, Toaster, toast, formatARS } from "@diego-brunetto/ui";

export function CargarGasto() {
  return (
    <>
      <Field label="Monto" hint="En pesos.">
        <Input numeric prefix="$" placeholder="0" />
      </Field>
      <Button variant="primary" onClick={() => toast(`Gasto guardado · ${formatARS(12500)}`)}>
        Guardar gasto
      </Button>
      <Toaster />
    </>
  );
}
```

Modo oscuro: `class="dark"` (o `data-theme="dark"`) en `<html>`. Con `prefers-reduced-motion`, `--motion` vale 0 y ninguna app lo puede pisar.

Los componentes llevan `"use client"`, así que funcionan en el App Router de Next.

## Temas por app

El kit vive en `@layer base` (tokens) y `@layer components`. Cualquier regla de la app sin capa gana, y con Tailwind v4 las utilidades también.

- **Nivel 0.** Importá el kit y listo.
- **Nivel 1.** Cambiá semillas: `--brand`, `--n-h`, `--n-c`, `--radius`, `--cut`, `--font-display` (con `--display-weight`, `--display-tracking`, `--display-stretch`, `--display-scale`) y `--motion`. Hover, foco, fondos suaves, texto sobre la marca y neutros se recalculan solos.
- **Nivel 2.** Además, redefiní o agregá tokens.

```css
/* Gym */
:root {
  --brand: #2563eb;
  --n-h: 262;
  --radius: 0.125rem;
  --cut: 0px;
  --motion: 0.65;
  --cardio: #0d9488;
  --record: #b45309;
}
.dark { --cardio: #2dd4bf; --record: #f59e0b; }
```

## Componentes

| Componente | Para qué |
| --- | --- |
| `Button` | Acción. `variant`: primary, secondary, outline, ghost, danger. `size`, `iconOnly`, `block`, `loading`. Con `href` + `renderLink` navega como link (mismo contrato que SideNav). |
| `Field`, `Input`, `Select`, `Textarea`, `Label` | Formulario con hint y error conectados por `aria-describedby`. `shakeKey` sacude al fallar. `Textarea` usa `.input` (16px en táctil). |
| `Checkbox` | Casilla; `strikeWhenDone` para pendientes. |
| `Switch`, `SwitchRow` | Ajustes que actúan al instante. |
| `Stepper` | Más y menos con paso fijo (2,5 kg, repeticiones). |
| `SegmentedControl` | Dos a cuatro opciones con indicador que se desliza. |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Pestañas (Radix: flechas, Inicio, Fin). |
| `BottomNav` | Navegación inferior con FAB opcional. |
| `PageHeader` | Encabezado de pantalla. `sticky` fija una barra compacta con blur y safe-area (Gym). |
| `Badge` | Estado, cantidad o variación. |
| `Chip`, `ChipGroup` | Opciones rápidas tocables (`aria-pressed`), con scroll horizontal. |
| `Card`, `CardHeader`, `Divider` | Superficies. `soft` para el bloque destacado. |
| `Stat`, `CountUp`, `Money`, `Sparkline` | Datos, montos y tendencia. |
| `Progress`, `StackBar` | Avance y partes de un total. |
| `EmptyState`, `Skeleton`, `SkeletonRow` | Vacío y carga. |
| `Toaster`, `toast()` | Avisos en pasado y con el dato. |
| `Sheet` | Hoja inferior con arrastre para cerrar (Radix Dialog). |
| `ConfirmDialog` | Confirmación de algo que no se deshace. `variant="sheet"`: hoja inferior con botones apilados. |
| `Achievement` | Logro con chispas. Solo para hitos. |
| `Icon` | Los íconos del kit (incluye cardio, superserie, grip y clipboard para Gym). |

Utilidades: `formatARS`, `formatUSD`, `formatNumber`, `formatPercent`, `useCountUp`, `getMotion`, `cx`.

## Desarrollo

```bash
pnpm install
pnpm dev         # playground en Vite con todos los componentes
pnpm test        # Vitest + Testing Library
pnpm typecheck
pnpm build       # dist/: index.js, index.d.ts y los tres CSS
```

`pnpm-workspace.yaml` solo deja instalar versiones publicadas hace 14 días o más.

## Publicar una versión

```bash
pnpm version patch        # o minor / major: actualiza package.json y crea el tag vX.Y.Z
git push --follow-tags    # el workflow Publish verifica, compila y publica en GitHub Packages
```

## Estructura

```
src/
  components/   un archivo por componente
  lib/          cx, formato es-AR, motion, useIndicator, useCountUp
  styles/       styles.css (tokens + componentes), fonts.css, tailwind.css
playground/     página de prueba (pnpm dev)
```
