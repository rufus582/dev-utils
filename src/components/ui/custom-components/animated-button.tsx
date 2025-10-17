"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useAnimate, type MotionStyle } from "motion/react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        // icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Loader = () => {
  return (
    <motion.svg
      initial={{
        scale: 1,
        width: "20px",
        display: "block",
      }}
      style={{
        scale: 1,
        display: "block",
      }}
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 0.3,
        repeat: Infinity,
        ease: "linear",
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a9 9 0 1 0 9 9" />
    </motion.svg>
  );
};

const CheckIcon = () => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M9 12l2 2l4 -4" />
    </motion.svg>
  );
};

const XIcon = () => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M10 10l4 4m0 -4l-4 4" />
    </motion.svg>
  );
};

function Button({
  className,
  variant,
  size,
  buttonIcon,
  onClick,
  disabled = undefined,
  loaderIcon = <Loader />,
  successIcon = <CheckIcon />,
  errorIcon = <XIcon />,
  successBgColor,
  successBgColorClass,
  errorBgColor,
  errorBgColorClass,
  ref,
  ...props
}: React.ComponentProps<typeof motion.button> &
  VariantProps<typeof buttonVariants> & {
    loaderIcon?: React.ReactNode;
    successIcon?: React.ReactNode;
    errorIcon?: React.ReactNode;
    buttonIcon: React.ReactNode;
    successBgColor?: string;
    successBgColorClass?: string;
    errorBgColor?: string;
    errorBgColorClass?: string;
    onClick?: (
      event: React.MouseEvent<HTMLButtonElement>
    ) => boolean | Promise<boolean>;
  }) {
  const [scope, animate] = useAnimate();
  const [loading, setLoading] = React.useState(false)

  const animateLoading = async () => {
    if (!loaderIcon && !successIcon) {
      return;
    }

    await animate(
      ".icon",
      {
        scale: 0,
      },
      {
        duration: 0.2,
      }
    );
    if (loaderIcon) {
      await animate(
        ".loader",
        {
          scale: 1,
        },
        {
          duration: 0.2,
        }
      );
    }
  };

  const animateSuccess = async () => {
    if (!loaderIcon && !successIcon) {
      return;
    }

    if (loaderIcon) {
      await animate(
        ".loader",
        {
          scale: 0,
        },
        {
          duration: 0.2,
        }
      );
    }
    if (successIcon) {
      if (successBgColor || successBgColorClass) {
        animate(
          ".success-bg",
          {
            opacity: 1,
          },
          {
            duration: 0.2,
          }
        );
      }
      await animate(
        ".success",
        {
          scale: 1,
        },
        {
          duration: 0.2,
        }
      );
      await animate(
        ".success",
        {
          scale: 0,
        },
        {
          delay: 1,
          duration: 0.2,
        }
      );
      if (successBgColor || successBgColorClass) {
        animate(
          ".success-bg",
          {
            opacity: 0,
          },
          {
            duration: 0.2,
          }
        );
      }
    }

    await animate(
      ".icon",
      {
        scale: 1,
      },
      {
        duration: 0.2,
      }
    );
  };

  const animateError = async () => {
    if (!loaderIcon && !errorIcon) {
      return;
    }

    if (loaderIcon) {
      await animate(
        ".loader",
        {
          scale: 0,
        },
        {
          duration: 0.2,
        }
      );
    }
    if (errorIcon) {
      if (errorBgColor || errorBgColorClass) {
        animate(
          ".error-bg",
          {
            opacity: 1,
          },
          {
            duration: 0.2,
          }
        );
      }
      await animate(
        ".error",
        {
          scale: 1,
        },
        {
          duration: 0.2,
        }
      );
      await animate(
        ".error",
        {
          scale: 0,
        },
        {
          delay: 1,
          duration: 0.2,
        }
      );
      if (errorBgColor || errorBgColorClass) {
        animate(
          ".error-bg",
          {
            opacity: 0,
          },
          {
            duration: 0.2,
          }
        );
      }
    }

    await animate(
      ".icon",
      {
        scale: 1,
      },
      {
        duration: 0.2,
      }
    );
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true)
    await animateLoading();
    setLoading(false)
    if (onClick) {
      const isSuccess = (await onClick(event)) as unknown;
      if (isSuccess === true) {
        await animateSuccess();
      } else {
        await animateError();
      }
    } else {
      await animateSuccess();
    }
  };

  let successBgStyle: MotionStyle = {
    zIndex: 1,
  };
  if (successBgColor) {
    successBgStyle = {
      ...successBgStyle,
      backgroundColor: successBgColor,
    };
  }

  let errorBgStyle: MotionStyle = {
    zIndex: 1,
  };
  if (errorBgColor) {
    errorBgStyle = {
      ...errorBgStyle,
      backgroundColor: errorBgColor,
    };
  }

  return (
    <motion.button
      ref={(node) => {
        if (ref instanceof Function) ref(node);
        else if (ref) ref.current = node;

        // @ts-expect-error: Readonly ref (Framer's scope), safe to assign at runtime
        scope.current = node;
      }}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      disabled={disabled !== undefined ? disabled : loading}
      {...props}
    >
      <motion.div
        className={`success-bg absolute w-full h-full ${
          successBgColorClass ?? ""
        }`}
        initial={{ opacity: 0 }}
        style={successBgStyle}
      />
      <motion.div
        className={`error-bg absolute w-full h-full ${errorBgColorClass ?? ""}`}
        initial={{ opacity: 0 }}
        style={errorBgStyle}
      />
      <motion.div layout className="flex gap-0.5">
        <div className="relative w-[20px] items-center">
          <motion.div
            className="loader absolute top-[8%]"
            initial={{
              scale: 0,
              width: "20px",
            }}
            style={{
              scale: 1,
              zIndex: 1,
            }}
          >
            {loaderIcon}
          </motion.div>
          <motion.div
            layout
            className="success absolute top-[8%]"
            initial={{
              scale: 0,
              width: "20px",
            }}
            style={{
              scale: 0,
              zIndex: 1,
            }}
          >
            {successIcon}
          </motion.div>
          <motion.div
            layout
            className="error absolute top-[8%]"
            initial={{
              scale: 0,
              width: "20px",
            }}
            style={{
              scale: 0,
              zIndex: 1,
            }}
          >
            {errorIcon}
          </motion.div>
          <motion.div
            layout
            className="icon absolute top-[8%]"
            initial={{
              scale: 1,
              width: "20px",
            }}
            style={{
              scale: 1,
              zIndex: 1,
            }}
          >
            {buttonIcon}
          </motion.div>
        </div>
        <motion.span layout style={{ zIndex: 1 }}>
          {props.children}
        </motion.span>
      </motion.div>
    </motion.button>
  );
}

export { Button };
