import { AnimatePresence, motion } from "motion/react";
import type { ComponentProps } from "react";
import { Icon } from "@/components/icons/huge-icon";
import { CancelCircleIcon, CheckmarkCircleIcon } from "@/components/icons/ui";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const MotionBadge = motion.create(Badge);

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
    icon: <Icon icon={CancelCircleIcon} />,
  },
};

export type DBConnectionState = keyof typeof variants;

interface IDBConnectionStatusBadgeProps extends ComponentProps<
  typeof MotionBadge
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
    <MotionBadge
      className={cn(
        variant.className,
        "[&>svg]:size-3! p-1 duration-150 transition-colors w-fit",
        state === "error" && "pr-1.5",
        className,
      )}
      transition={{
        duration: 0.15,
      }}
      {...rest}
      layout
    >
      {Object.entries(variants).map(([key, val]) => (
        <AnimatePresence key={key} mode="popLayout">
          {state === key && (
            <motion.div
              key={key}
              className="flex gap-1"
              initial={{
                opacity: 0,
                filter: "blur(1px)",
              }}
              animate={{
                opacity: 1,
                filter: "blur(0)",
              }}
              exit={{
                opacity: 0,
                filter: "blur(1px)",
              }}
              transition={{
                duration: 0.15,
              }}
            >
              {val.icon}
              {state === "error" && "ERROR"}
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </MotionBadge>
  );
};
