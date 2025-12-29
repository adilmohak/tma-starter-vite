import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  style?: any;
  color?:
    | "primary"
    | "success"
    | "danger"
    | "info"
    | "warning"
    | "gray"
    | "dark";
  size?: "large" | "medium" | "small";
}

export default function Tag({
  children,
  className,
  style,
  color = "primary",
  size = "medium",
}: Props) {
  const getTagColors = () => {
    if (color === "primary") {
      return "bg-button text-button-text";
    }
    if (color === "success") {
      return "bg-green-200 text-green-700";
    }
    if (color === "danger") {
      return "bg-red-200 text-red-700";
    }
    if (color === "warning") {
      return "bg-yellow-200 text-yellow-700";
    }
    if (color === "gray") {
      return "bg-gray-200 text-gray-700";
    }
    if (color === "dark") {
      return "bg-gray-900 text-gray-100";
    }
    return "bg-blue-200 text-blue-700";
  };

  const getTagSize = () => {
    if (size === "large") {
      return "text-lg px-3 py-1";
    }
    if (size === "medium") {
      return "text-xs px-2 py-[0.15rem]";
    }
    if (size === "small") {
      return "text-[0.65rem] px-1 py-0";
    }
    return "text-xs px-2 py-1";
  };

  const tagColors = getTagColors();
  const tagSize = getTagSize();

  return (
    <span
      className={cn(
        `${tagColors} ${tagSize} inline-block font-bold uppercase rounded-sm`,
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
