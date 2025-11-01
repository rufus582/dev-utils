import {
  Tooltip as TooltipShadcn,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

const tooltipVariants = cva("", {
  variants: {
    variant: {
      primary: "",
      secondary:
        "bg-accent font-semibold text-foreground [&_svg]:fill-accent [&_svg]:bg-accent shadow-black/20 dark:shadow-black/40 shadow-md",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

interface ITooltipWrapperProps
  extends React.ComponentProps<typeof TooltipContent> {
  content: string;
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  delayDuration?: number;
  asChild?: boolean;
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
  variant,
  className,
  ...props
}: ITooltipWrapperProps & VariantProps<typeof tooltipVariants>) {
  return (
    <TooltipShadcn {...{ open, defaultOpen, onOpenChange, delayDuration }}>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent
        className={tooltipVariants({ variant, className })}
        {...props}
        hideWhenDetached
      >
        {content}
      </TooltipContent>
    </TooltipShadcn>
  );
}
