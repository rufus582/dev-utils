import { cn } from "@/lib/utils";

const AppLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      // stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={cn(
        "stroke-[#733e0a] stroke-[2.5]",
        className,
        "lucide lucide-square-code-icon lucide-square-code",
      )}
    >
      <path d="m10 9-3 3 3 3" />
      <path d="m14 15 3-3-3-3" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
};

export default AppLogo;
