import { CodeSquareIcon } from "lucide-react";
import Header from "../page-header";
import GitHubLogo from "@/components/icons/github-logo";
import { Button } from "@/components/ui/button";
import LinkedInLogo from "@/components/icons/linkedin-logo";
import { openLinkInNewTab } from "@/lib/utils";
import type React from "react";

interface ProfileLinkProps {
  link: string;
  isWidelyAvailable: boolean;
  icon: React.ReactNode;
  text: string;
}

const HomePage = () => {
  const links: ProfileLinkProps[] = [
    {
      link: "https://github.com/rufus582/dev-utils",
      isWidelyAvailable: false,
      icon: <GitHubLogo />,
      text: "Source Code",
    },
    {
      link: "https://www.linkedin.com/in/rufus58/",
      isWidelyAvailable: true,
      icon: <LinkedInLogo />,
      text: "Developer's LinkedIn",
    },
  ];

  return (
    <div className="h-full w-full flex flex-col">
      <Header title="" />
      <div className="m-auto text-center">
        <CodeSquareIcon
          width="15rem"
          height="15rem"
          className="text-primary w-full"
        />
        <h2 className="font-bold text-6xl text-muted-foreground">Dev-Utils.</h2>
        <p className="mt-2 text-muted-foreground">
          Select one of the items in the sidebar to begin!
        </p>
        {links.map((linkItem, index) => {
          let borderRadiusClasses = "rounded-none";
          if (index === 0)
            borderRadiusClasses = "rounded-l-full rounded-r-none";
          else if (index === links.length - 1)
            borderRadiusClasses = "rounded-r-full rounded-l-none";

          return (
            <Button
              variant="outline"
              className={`${borderRadiusClasses} fill-foreground mt-4`}
              size="lg"
              onClick={() =>
                openLinkInNewTab(linkItem.link, linkItem.isWidelyAvailable)
              }
            >
              {linkItem.icon}
              {linkItem.text}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
