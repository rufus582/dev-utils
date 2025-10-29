import { CodeSquareIcon } from "lucide-react";
import Header from "@/components/layout/header/page-header";
import GitHubLogo from "@/components/icons/github-logo";
import { Button } from "@/components/ui/button";
import LinkedInLogo from "@/components/icons/linkedin-logo";
import { openLinkInNewTab } from "@/lib/utils";
import type React from "react";
import { ButtonGroup } from "@/components/ui/button-group";

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
      isWidelyAvailable: true,
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
        <ButtonGroup className="mt-4 mx-auto">
          {links.map((linkItem) => (
            <Button
              key={linkItem.text}
              variant="outline"
              className="fill-foreground rounded-full"
              size="lg"
              onClick={() =>
                openLinkInNewTab(linkItem.link, linkItem.isWidelyAvailable)
              }
            >
              {linkItem.icon}
              {linkItem.text}
            </Button>
          ))}
        </ButtonGroup>
      </div>
    </div>
  );
};

export default HomePage;
