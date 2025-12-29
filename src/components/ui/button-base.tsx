import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useTelegram } from "@/hooks/use-telegram";

interface ButtonBaseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  asChild?: boolean; // Allow child delegation
}

const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ asChild = false, onClick, children, ...props }, ref) => {
    const telegram = useTelegram();
    const vibrateOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      telegram?.HapticFeedback.impactOccurred("medium");
    };

    // Use Slot if `asChild` is true, otherwise default to `button`
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          vibrateOnClick(event); // Shared logic
          if (onClick) onClick(event); // Pass the onClick handler
        }}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

ButtonBase.displayName = "ButtonBase";

export default ButtonBase;
