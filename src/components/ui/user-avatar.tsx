"use client";

import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { generateUserAvatarColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user?: {
    username?: string;
    avatar?: string;
    first_name?: string;
    last_name?: string;
  };
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallbackText?: string;
}

const sizeClasses = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
  xl: "size-12",
};

const textSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

export function UserAvatar({
  user,
  className,
  size = "md",
  fallbackText,
}: UserAvatarProps) {
  // Determine the identifier for color generation
  const identifier =
    user?.username || user?.first_name || user?.last_name || "Unknown";

  // Generate vibrant background color
  const backgroundColor = generateUserAvatarColor(identifier);

  // Generate fallback text
  const getFallbackText = () => {
    if (fallbackText) return fallbackText;
    if (user?.username) return user.username.slice(0, 1).toUpperCase();
    if (user?.first_name) return user.first_name.slice(0, 1).toUpperCase();
    if (user?.last_name) return user.last_name.slice(0, 1).toUpperCase();
    return "H";
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={user?.avatar} alt={user?.username || "User avatar"} />
      <AvatarFallback
        className={cn("font-semibold text-white", textSizeClasses[size])}
        style={{ backgroundColor }}
      >
        {getFallbackText()}
      </AvatarFallback>
    </Avatar>
  );
}
