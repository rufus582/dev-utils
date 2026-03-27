import { cn } from "@/lib/utils";
import type { LucideProps } from "lucide-react";
import type { RefAttributes } from "react";

const DatabaseSearch = ({
  color = "currentColor",
  size = 24,
  strokeWidth = 2,
  absoluteStrokeWidth,
  className = "",
  ...rest
}: Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      color={color}
      width={size}
      height={size}
      strokeWidth={
        absoluteStrokeWidth
          ? (Number(strokeWidth) * 24) / Number(size)
          : strokeWidth
      }
      className={cn("lucide", className)}
      {...rest}
    >
      <path d="M21 11.693V5" />
      <path d="m22 22-1.875-1.875" />
      <path d="M3 12a9 3 0 0 0 8.697 2.998" />
      <path d="M3 5v14a9 3 0 0 0 9.28 2.999" />
      <circle cx="18" cy="18" r="3" />
      <ellipse cx="12" cy="5" rx="9" ry="3" />
    </svg>
  );
};

export default DatabaseSearch;
