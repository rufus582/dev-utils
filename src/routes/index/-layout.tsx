import Header from "#components/layout/header/page-header";
import AppLogo from "#icons/app-logo";
import { Icon } from "#icons/huge-icon";
import { DiscoverCircleIcon, GithubIcon } from "#icons/pages";
import { Button } from "#ui/button";
import { ButtonGroup } from "#ui/button-group";
import TiltContainer from "#ui/custom-components/tilt-container";
import { Kbd } from "#ui/kbd";
import { cn, openLinkInNewTab } from "@/lib/utils";

interface ProfileLinkProps {
  link: string;
  isWidelyAvailable: boolean;
  icon: React.ReactNode;
  text: string;
}

interface HomePageLayoutProps {
  links: ProfileLinkProps[];
}

const DesktopLayout = ({ links }: HomePageLayoutProps) => {
  return (
    <TiltContainer
      rotate={25}
      className="w-full flex flex-col perspective-midrange @container"
      springOptions={{
        damping: 20,
        stiffness: 100,
        mass: 1,
      }}
    >
      <div className="translate-z-14 transform-3d">
        <div className="max-h-[45vh] min-h-30 max-w-[40vw] aspect-square p-[max(12px,3.5cqh)] bg-linear-45 from-[#FF7D00] to-[#EFB100] mx-auto mb-4 rounded-[25%] shadow-2xl transform-3d">
          <AppLogo className="w-full h-full translate-z-5 drop-shadow-2xl drop-shadow-black/40 active:translate-z-3 transition" />
        </div>
      </div>
      <h2 className="font-bold text-[max(30px,10cqh)] leading-none text-muted-foreground translate-z-14 select-none pointer-events-none">
        Dev-Utils.
      </h2>
      <p className="mt-2 text-[max(11px,1.6cqh)] leading-none text-muted-foreground mx-auto translate-z-14 select-none pointer-events-none">
        Select one of the items in the sidebar or press <Kbd>⌘ + K</Kbd> to
        begin!
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
              className={cn(
                "fill-foreground rounded-3xl hover:translate-z-5 transform-3d transition-all duration-300 ease-in-out select-none",
                "h-[4.5cqh] min-h-8 min-w-30 text-[max(11px,1.5cqh)] [&>svg]:w-[max(11px,1.5cqh)]! [&>svg]:h-[max(11px,1.5cqh)]!",
              )}
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
  );
};

const MobileLayout = ({ links }: HomePageLayoutProps) => {
  return (
    <div className="m-auto">
      <div className="w-xs p-8 bg-linear-45 from-[#FF7D00] to-[#EFB100] mx-auto mb-4 rounded-[25%] shadow-2xl transform-3d">
        <AppLogo className="w-full h-full translate-z-5 drop-shadow-2xl drop-shadow-black/40" />
      </div>
      <h2 className="font-bold text-6xl text-muted-foreground">Dev-Utils.</h2>
      <p className="mt-2 text-muted-foreground w-[75%] mx-auto">
        This app is designed for desktop use only. Please access it from a
        laptop or desktop device.
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
  );
};

const HomePage = ({ layout }: { layout?: "mobile" | "desktop" }) => {
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

  const HomeLayout = layout === "mobile" ? MobileLayout : DesktopLayout;

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{ scrollbarWidth: "none" }}
    >
      {layout !== "mobile" && <Header />}
      <div
        className="m-auto text-center w-full flex overflow-x-clip"
        style={{ scrollbarWidth: "none" }}
      >
        <HomeLayout links={links} />
      </div>
    </div>
  );
};

export type { HomePageLayoutProps, ProfileLinkProps };
export { HomePage };
