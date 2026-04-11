import Header from "@/components/layout/header/page-header";
import type React from "react";
import { DesktopLayout, MobileLayout } from "./HomePageLayout";
import { Icon } from "@/components/icons/huge-icon";
import { GithubIcon, DiscoverCircleIcon } from "@/components/icons/pages";

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
      icon: <Icon icon={GithubIcon} />,
      text: "Source Code",
    },
    {
      link: "https://rufus582.dev",
      isWidelyAvailable: true,
      icon: <Icon icon={DiscoverCircleIcon} />,
      text: "About Developer",
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
        className="m-auto text-center w-full flex overflow-x-clip"
        style={{ scrollbarWidth: "none" }}
      >
        <HomeLayout links={links} />
      </div>
    </div>
  );
};

export default HomePage;
