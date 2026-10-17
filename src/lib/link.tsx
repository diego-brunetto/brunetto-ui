/** Contrato para navegar con el router de la app (Next, React Router, TanStack): BottomNav y SideNav lo comparten. */
export type LinkRenderProps = { href: string; className?: string; children: React.ReactNode; "aria-current"?: "page"; onClick?: React.MouseEventHandler };
export type RenderLink = (props: LinkRenderProps) => React.ReactNode;
export const defaultRenderLink: RenderLink = (p) => <a {...p} />;
