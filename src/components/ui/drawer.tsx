"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";
import ButtonBase from "./button-base";
import { X } from "lucide-react";
import { useDrawerState } from "@/store/ui-store";

/**
 * Enhanced Drawer component with automatic back button handling
 *
 * This component automatically registers/unregisters itself when opened/closed
 *
 * Just use: <Drawer open={isOpen} onOpenChange={setIsOpen}>
 */
const Drawer = ({
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => {
  const { registerDrawer, unregisterDrawer } = useDrawerState();
  const drawerIdRef = React.useRef<string>(
    `drawer-${Math.random().toString(36).substr(2, 9)}`
  );
  const onOpenChangeRef = React.useRef(onOpenChange);

  // Keep the ref up to date
  React.useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  React.useEffect(() => {
    const drawerId = drawerIdRef.current;

    if (open && onOpenChangeRef.current) {
      // Register this drawer when it opens
      registerDrawer(drawerId, () => {
        onOpenChangeRef.current?.(false);
      });
    }

    // Cleanup: unregister when component unmounts or when open changes
    return () => {
      unregisterDrawer(drawerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]); // Only depend on 'open', not on the Zustand functions or onOpenChange

  return (
    <DrawerPrimitive.Root open={open} onOpenChange={onOpenChange} {...props} />
  );
};
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 bg-black/40 z-40 backdrop-blur-sm", className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 bg-background flex flex-col fixed bottom-0 left-0 right-0 max-h-[100vh] max-w-[var(--layout-max-width)] mx-auto rounded-t-[10px]",
        className
      )}
      style={{
        paddingBottom: `calc(0.5rem + var(--tg-safe-area-inset-bottom, 8px))`,
        ...props.style,
      }}
      {...props}
    >
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-center", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-2 px-4 py-2 mt-auto", className)}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-secondary", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

interface DrawerCloseButtonProps {
  className?: string;
  onClick: () => void;
}

const DrawerCloseButton = ({ className, onClick }: DrawerCloseButtonProps) => (
  <ButtonBase
    type="button"
    onClick={onClick}
    className={cn(
      "absolute z-50 inline-flex items-center justify-center top-2 right-3 bg-muted w-[34px] h-[34px] rounded-full text-secondary hover:text-primary",
      className
    )}
  >
    <X width={24} />
  </ButtonBase>
);

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerCloseButton,
};
