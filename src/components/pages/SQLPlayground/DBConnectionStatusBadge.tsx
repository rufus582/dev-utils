import type React from "react";
import { Icon } from "@/components/icons/huge-icon";
import { CheckmarkCircleIcon } from "@/components/icons/ui";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const variants = {
  connecting: {
    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300! [&>svg]:text-current!",
    icon: <Spinner />,
  },
  connected: {
    className:
      "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300! [&>svg]:text-current!",
    icon: <Icon icon={CheckmarkCircleIcon} />,
  },
  error: {
    className:
      "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300! [&>svg]:text-current!",
    icon: <Icon icon={CheckmarkCircleIcon} />,
  },
};

export type DBConnectionState = keyof typeof variants;

interface IDBConnectionStatusBadgeProps extends React.ComponentProps<
  typeof Badge
> {
  state: DBConnectionState;
}

export const DBConnectionStatusBadge = ({
  state,
  className,
  ...rest
}: IDBConnectionStatusBadgeProps) => {
  const variant = variants[state];

  return (
    <Badge
      className={cn(
        variant.className,
        "[&>svg]:size-3! transition-all duration-150",
        className,
      )}
      {...rest}
    >
      {variant.icon}
      {state}
    </Badge>
  );
};
