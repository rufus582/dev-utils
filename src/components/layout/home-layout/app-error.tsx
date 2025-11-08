import Error from "@/components/ui/custom-components/error";
import { BanIcon, BugIcon, CircleXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyDescription } from "@/components/ui/empty";
import { openLinkInNewTab } from "@/lib/utils";
import { isRouteErrorResponse, useRouteError } from "react-router";
import Header from "@/components/layout/header/page-header";
import DevUtilsCommandPrompt from "./command-prompt/command";

const AppError = () => {
  const appError = useRouteError();
  const isRouteError = isRouteErrorResponse(appError);

  let errorIcon = <BanIcon />;
  if (isRouteError && appError.status >= 500 && appError.status < 600)
    errorIcon = <BugIcon />;
  else if (isRouteError) errorIcon = <CircleXIcon />;

  return (
    <div className="h-full w-full flex flex-col">
      <Header />
      <Error
        className="h-full w-full"
        httpStatus={isRouteError ? appError : undefined}
        title="Unknown Error"
        message={!isRouteError ? "An unknown error has occurred" : undefined}
        icon={errorIcon}
      >
        <DevUtilsCommandPrompt
          showSearchBar
          className="w-3/4"
          searchBarPlaceholder="Try searching for pages..."
        />
        <EmptyDescription>
          Found a bug?{" "}
          <Button
            className="p-0 cursor-pointer text-muted-foreground underline hover:text-primary"
            variant="link"
            onClick={() =>
              openLinkInNewTab(
                "https://github.com/rufus582/dev-utils/issues/new"
              )
            }
          >
            Raise an issue here
          </Button>
        </EmptyDescription>
      </Error>
    </div>
  );
};

export default AppError;
