import Header from "@/components/layout/header/page-header";
import GitHubLogo from "@/components/icons/github-logo";
import { Button } from "@/components/ui/button";
import LinkedInLogo from "@/components/icons/linkedin-logo";
import { cn, openLinkInNewTab } from "@/lib/utils";
import type React from "react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Kbd } from "@/components/ui/kbd";
import TiltContainer from "@/components/ui/custom-components/tilt-container";
import AppLogo from "@/components/icons/app-logo";

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
        <TiltContainer rotate={25} className=" perspective-midrange">
          <div className="w-lg h-128 p-8 bg-linear-45 from-[#FF7D00] to-[#EFB100] mx-auto mb-4 rounded-[130px] shadow-2xl translate-z-14 transform-3d">
            <AppLogo className="w-full h-full translate-z-5 drop-shadow-2xl drop-shadow-black/40" />
          </div>
          <h2 className="font-bold text-8xl text-muted-foreground translate-z-14">
            Dev-Utils.
          </h2>
          <p className="mt-2 text-muted-foreground w-[75%] mx-auto translate-z-14">
            {isMobile ? (
              "This app is designed for desktop use only. Please access it from a laptop or desktop device."
            ) : (
              <>
                Select one of the items in the sidebar or press <Kbd>⌘ + K</Kbd>{" "}
                to begin!
              </>
            )}
          </p>
          <div
            className={cn(
              "translate-z-14 w-fit mx-auto -mt-8 p-12 px-24 transform-3d hover:*:scale-110 hover:*:gap-2",
              "[&>*>*:not(:first-child)]:border-l hover:[&>*>*:not(:first-child)]:rounded-l-3xl hover:[&>*>*:not(:last-child)]:rounded-r-3xl",
            )}
          >
            <ButtonGroup className="mx-auto transform-3d gap-0 transition-all duration-300 ease-in-out">
              {links.map((linkItem) => (
                <Button
                  key={linkItem.text}
                  variant="outline"
                  className="fill-foreground rounded-3xl hover:translate-z-5 transform-3d transition-all duration-300 ease-in-out"
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
        </TiltContainer>
      </div>
    </div>
  );
};

export default HomePage;
