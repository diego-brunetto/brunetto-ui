import * as TabsPrimitive from "@radix-ui/react-tabs";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cx } from "../lib/cx";
import { useIndicator } from "../lib/useIndicator";

export const Tabs = TabsPrimitive.Root;

export interface TabsListProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  /** El valor activo, para mover la línea. Pasá el mismo `value` que a <Tabs>. */
  value: string;
  children: ReactNode;
}

/** Pestañas con una línea de 2 px que se desliza. Flechas, Inicio y Fin mueven el foco (Radix). */
export function TabsList({ value, className, children, ...rest }: TabsListProps) {
  const { groupRef, indRef } = useIndicator<HTMLDivElement>([value]);
  return (
    <TabsPrimitive.List ref={groupRef} className={cx("tabs", className)} {...rest}>
      <span ref={indRef} className="ind" aria-hidden="true" />
      {children}
    </TabsPrimitive.List>
  );
}

export const TabsTrigger = TabsPrimitive.Trigger;

export const TabsContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(
  function TabsContent({ className, ...rest }, ref) {
    return <TabsPrimitive.Content ref={ref} className={cx("tab-panel swap", className)} {...rest} />;
  },
);
