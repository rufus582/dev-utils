import { motion, useAnimate, useReducedMotion } from "motion/react";
import {
  type ComponentProps,
  type PointerEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { cn } from "#lib/utils.ts";

const REDACTED_TEXT_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
const SWAP_MS = 0.09;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const REST_BLUR = {
  hidden: "blur(2px)",
  shown: "blur(0px)",
  peak: "blur(3px)",
} as const;

function redactText(value: string): string {
  let state = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    state ^= value.charCodeAt(index);
    state = Math.imul(state, 0x01000193);
  }

  const nextChar = () => {
    state = Math.imul(state ^ (state >>> 13), 0x85ebca6b);
    state = Math.imul(state ^ (state >>> 16), 0xc2b2ae35);
    return (
      REDACTED_TEXT_ALPHABET[Math.abs(state) % REDACTED_TEXT_ALPHABET.length] ??
      "x"
    );
  };

  return Array.from(value, (char) => {
    if (char === "@" || char === "." || char === "-" || char === "_")
      return char;
    return nextChar();
  }).join("");
}

function restBlur(shown: boolean) {
  return shown ? REST_BLUR.shown : REST_BLUR.hidden;
}

interface ProtectedTextProps extends Omit<
  ComponentProps<typeof motion.span>,
  "children"
> {
  text: string;
}

export const ProtectedText = ({
  text,
  className,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  ...props
}: ProtectedTextProps) => {
  const [reveal, setReveal] = useState(false);
  const redactedText = useMemo(() => redactText(text), [text]);
  const shouldReduceMotion = useReducedMotion();
  const [scope, animate] = useAnimate();

  const revealRef = useRef(reveal);
  const pressedRef = useRef(false);
  revealRef.current = reveal;

  const animateTo = (filter: string, opacity: number, duration: number) => {
    if (!scope.current) return;
    return animate(
      scope.current,
      { filter, opacity },
      {
        duration,
        ease: EASE_OUT,
      },
    );
  };

  const handlePointerDown = (event: PointerEvent<HTMLSpanElement>) => {
    onPointerDown?.(event);
    if (event.defaultPrevented || event.button !== 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    pressedRef.current = true;

    if (shouldReduceMotion) return;
    void animateTo(REST_BLUR.peak, 0.7, SWAP_MS);
  };

  const handlePointerUp = (event: PointerEvent<HTMLSpanElement>) => {
    onPointerUp?.(event);
    if (!pressedRef.current) return;
    pressedRef.current = false;

    const shown = !revealRef.current;
    flushSync(() => {
      setReveal(shown);
    });

    void animateTo(restBlur(shown), 1, shouldReduceMotion ? 0 : SWAP_MS);
  };

  const handlePointerCancel = (event: PointerEvent<HTMLSpanElement>) => {
    onPointerCancel?.(event);
    if (!pressedRef.current) return;
    pressedRef.current = false;

    void animateTo(
      restBlur(revealRef.current),
      1,
      shouldReduceMotion ? 0 : SWAP_MS,
    );
  };

  return (
    <motion.span
      {...props}
      ref={scope}
      className={cn(
        "cursor-pointer touch-manipulation select-none font-mono",
        className,
      )}
      initial={{ filter: REST_BLUR.hidden, opacity: 1 }}
      whileHover={{
        color: "var(--foreground)",
        transition: { duration: 0.05 },
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {reveal ? text : redactedText}
    </motion.span>
  );
};
