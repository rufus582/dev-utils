import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { DesktopLayout, MobileLayout } from "#/routes/index/-layout";
import Header from "#components/layout/header/page-header";
import { Icon } from "#icons/huge-icon";
import { DiscoverCircleIcon, GithubIcon } from "#icons/pages";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  pendingComponent: () => "loading",
});

interface ProfileLinkProps {
  link: string;
  isWidelyAvailable: boolean;
  icon: React.ReactNode;
  text: string;
}

function RouteComponent({ isMobile }: { isMobile?: boolean }) {
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
}
