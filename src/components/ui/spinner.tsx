import { Icon } from "@/components/icons/huge-icon";
import { LoadingIcon } from "@/components/icons/ui";
import { cn } from "@/lib/utils";

function Spinner({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Icon>, "icon">) {
  return (
    <Icon
      icon={LoadingIcon}
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
