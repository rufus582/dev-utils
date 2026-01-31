import Header from "@/components/layout/header/page-header";
import GitHubLogo from "@/components/icons/github-logo";
import LinkedInLogo from "@/components/icons/linkedin-logo";
import type React from "react";
import { DesktopLayout, MobileLayout } from "./HomePageLayout";

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

  const HomeLayout = isMobile ? MobileLayout : DesktopLayout;

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{ scrollbarWidth: "none" }}
    >
      {!isMobile && <Header />}
      <div
        className="m-auto text-center h-3/4 w-full flex overflow-x-clip"
        style={{ scrollbarWidth: "none" }}
      >
        <HomeLayout links={links} />
      </div>
    </div>
  );
};

export default HomePage;
