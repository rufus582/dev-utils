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

const HomePage = ({ isMobile }: { isMobile?: boolean }) => {
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
      {!isMobile && <Header />}
      <div className="m-auto text-center w-full">
        <CodeSquareIcon
          width="15rem"
          height="15rem"
          className="text-primary w-full"
        />
        <h2 className="font-bold text-6xl text-muted-foreground">Dev-Utils.</h2>
        <p className="mt-2 text-muted-foreground w-[75%] mx-auto">
          {isMobile
            ? "This app is designed for desktop use only. Please access it from a laptop or desktop device."
            : "Select one of the items in the sidebar to begin!"}
        </p>
        {links.map((linkItem, index) => {
          let borderRadiusClasses = "rounded-none";
          if (index === 0)
            borderRadiusClasses = "rounded-l-full rounded-r-none";
          else if (index === links.length - 1)
            borderRadiusClasses = "rounded-r-full rounded-l-none";

          return (
            <Button
              key={linkItem.text}
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
