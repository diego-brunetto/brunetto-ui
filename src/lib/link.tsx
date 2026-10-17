export type LinkRenderProps = { href: string; className?: string; children: React.ReactNode; "aria-current"?: "page"; onClick?: React.MouseEventHandler };
export type RenderLink = (props: LinkRenderProps) => React.ReactNode;
export const defaultRenderLink: RenderLink = (p) => <a {...p} />;
