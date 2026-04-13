import { useTheme } from "@/store/theme-provider";
import darkLogo from "./logo-dark.png";
import lightLogo from "./logo.png";
import type React from "react";

const JMESPathLogo = (props: React.ComponentProps<"img">) => {
  const { theme } = useTheme();

  return (
    <img
      {...props}
      src={theme === "light" ? darkLogo : lightLogo}
      about="JMESPath Logo"
    />
  );
};

export default JMESPathLogo;
