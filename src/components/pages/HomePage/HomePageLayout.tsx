import { Button } from "@/components/ui/button";
import { cn, openLinkInNewTab } from "@/lib/utils";
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

interface HomePageLayoutProps {
  links: ProfileLinkProps[];
}

const DesktopLayout = ({ links }: HomePageLayoutProps) => {
  return (
    <TiltContainer
      rotate={25}
      className="w-full flex flex-col perspective-midrange"
    >
      <div className="translate-z-14 transform-3d">
        <div className="max-h-128 min-h-75 aspect-square p-8 bg-linear-45 from-[#FF7D00] to-[#EFB100] mx-auto mb-4 rounded-[25%] shadow-2xl transform-3d flex-3 shrink grow">
          <AppLogo className="w-full h-full translate-z-5 drop-shadow-2xl drop-shadow-black/40" />
        </div>
      </div>
      <h2 className="font-bold text-8xl text-muted-foreground translate-z-14 select-none pointer-events-none">
        Dev-Utils.
      </h2>
      <p className="mt-2 text-muted-foreground mx-auto translate-z-14 select-none pointer-events-none">
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
              className="fill-foreground rounded-3xl hover:translate-z-5 transform-3d transition-all duration-300 ease-in-out select-none"
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

export { DesktopLayout, MobileLayout };
export type { ProfileLinkProps, HomePageLayoutProps };
