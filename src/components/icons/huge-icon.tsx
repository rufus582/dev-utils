import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps } from "react";

type IconProps = ComponentProps<typeof HugeiconsIcon>;

export function Icon({
  size = 16,
  color = "currentColor",
  strokeWidth = 2,
  className,
  ...rest
}: IconProps) {
  return (
    <HugeiconsIcon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={cn("scale-100", className)}
      {...rest}
    />
  );
}
