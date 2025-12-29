"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // Gaming-style configuration
      duration={3500}
      // visibleToasts={3}
      expand={true}
      gap={12}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          // Gaming enhancements
          success: "gaming-toast-success",
          error: "gaming-toast-error",
          warning: "gaming-toast-warning",
          info: "gaming-toast-info",
          loading: "gaming-toast-loading",
        },
        style: {
          // Override inline styles for gaming effect
          border: "2px solid rgba(255, 199, 56, 0.3)",
          backdropFilter: "blur(10px)",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
