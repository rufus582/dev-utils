import {
  Tooltip as TooltipShadcn,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type React from "react";

interface ITooltipWrapperProps
  extends React.ComponentProps<typeof TooltipContent> {
  content: string;
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  delayDuration?: number,
  asChild?: boolean,
  onOpenChange?: (open: boolean) => void;
}

export function Tooltip({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration = 700,
  asChild,
  ...props
}: ITooltipWrapperProps) {
  return (
    <TooltipShadcn {...{ open, defaultOpen, onOpenChange, delayDuration }}>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent {...props} hideWhenDetached>{content}</TooltipContent>
    </TooltipShadcn>
  );
}
