import type { SVGProps } from "react";
import { cx } from "../lib/cx";

/** Íconos de trazo 24 × 24, trazo de 2 px, puntas redondeadas. */
export const icons = {
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="M20 6 9 17l-5-5" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  bell: (<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>),
  home: <path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" />,
  search: (<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>),
  calendar: (<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
  chart: (<><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 5-6" /></>),
  history: (<><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 2" /></>),
  dumbbell: <path d="M6 5v14M18 5v14M3 8v8M21 8v8M6 12h12" />,
  wallet: (<><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M3 10h18M16 15h2" /></>),
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  play: <path d="M7 4v16l13-8z" fill="currentColor" />,
  pause: <path d="M7 4h3v16H7zM14 4h3v16h-3z" fill="currentColor" />,
  prev: (<><path d="M19 20 9 12l10-8z" /><path d="M5 19V5" /></>),
  next: (<><path d="m5 4 10 8-10 8z" /><path d="M19 5v14" /></>),
  copy: (<><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>),
  trophy: (<><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></>),
  chevron: <path d="m6 9 6 6 6-6" />,
  up: (<><path d="m3 17 6-6 4 4 8-8" /><path d="M14 7h7v7" /></>),
  down: (<><path d="m3 7 6 6 4-4 8 8" /><path d="M14 17h7v-7" /></>),
  trash: <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />,
  inbox: (<><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>),
  music: (<><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>),
  mega: (<><path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z" /><path d="M16 9a3 3 0 0 1 0 6" /></>),
  alert: (<><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  // Acciones
  edit: (<><path d="M4 20h4L19 9a2.83 2.83 0 0 0-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></>),
  archive: (<><rect x="2" y="3" width="20" height="5" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4" /></>),
  upload: (<><path d="M12 15V3" /><path d="m7 8 5-5 5 5" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /></>),
  logout: (<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></>),
  settings: (<><path d="M18.5 10.1 20.9 10.5v3l-2.4.4-.6 1.4 1.4 1.9-2.1 2.1-1.9-1.4-1.4.6-.4 2.4h-3l-.4-2.4-1.4-.6-1.9 1.4-2.1-2.1 1.4-1.9-.6-1.4-2.4-.4v-3l2.4-.4.6-1.4-1.4-1.9 2.1-2.1 1.9 1.4 1.4-.6.4-2.4h3l.4 2.4 1.4.6 1.9-1.4 2.1 2.1-1.4 1.9z" /><circle cx="12" cy="12" r="3" /></>),
  filter: <path d="M3 4h18l-7 8.5V19l-4 2v-8.5z" />,
  more: (<><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>),
  "arrow-left": <path d="M19 12H5m7 7-7-7 7-7" />,
  "arrow-right": <path d="M5 12h14m-7-7 7 7-7 7" />,
  "chevron-left": <path d="m15 18-6-6 6-6" />,
  "chevron-right": <path d="m9 18 6-6-6-6" />,
  // Secciones
  card: (<><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></>),
  piggy: (<><path d="M19 9.5C18 6.9 15.3 5 12 5 7.6 5 4 8 4 11.8c0 1.9.9 3.6 2.5 4.8V20h3v-2.5h4V20h3v-3.4c.9-.7 1.6-1.5 2-2.6H21V9.5z" /><path d="M10 8h3M4 11.5c-1.2 0-2-.8-2-2M16 11.5h.01" /></>),
  receipt: (<><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z" /><path d="M9 8h6M9 12h6M9 16h3" /></>),
  bank: (<><path d="M3 9h18L12 3.5z" /><path d="M6 12v6M10 12v6M14 12v6M18 12v6M3 21h18" /></>),
  heart: <path d="M12 20.5 4.2 12.7a4.6 4.6 0 0 1 6.5-6.5L12 7.5l1.3-1.3a4.6 4.6 0 0 1 6.5 6.5z" />,
  pulse: <path d="M3 12h4l2.5-6 5 12 2.5-6h4" />,
  tag: (<><path d="M3 3h8l10 10-8 8L3 11z" /><path d="M7.5 7.5h.01" /></>),
  lock: (<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2" /></>),
  "check-circle": (<><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>),
  info: (<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>),
} as const;

export type IconName = keyof typeof icons;

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  /** Texto para lectores de pantalla. Sin label, el ícono es decorativo. */
  label?: string;
}

export function Icon({ name, label, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cx("ic", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      {icons[name]}
    </svg>
  );
}
