import DevUtilsCommandPrompt from "#components/layout/command-prompt/command";
import Header from "#components/layout/header/page-header";
import { Icon } from "#icons/huge-icon";
import { BugIcon } from "#icons/pages";
import { CancelCircleIcon } from "#icons/ui";
import { openLinkInNewTab } from "#lib/utils";
import { Button } from "#ui/button";
import ErrorComponent from "#ui/custom-components/error";
import { EmptyDescription } from "#ui/empty";

const AppError = ({
  error,
  isNotFound,
}: {
  error?: Error;
  isNotFound?: boolean;
}) => {
  let errorIcon = <Icon icon={BugIcon} />;
  if (isNotFound) errorIcon = <Icon icon={CancelCircleIcon} />;

  return (
    <div className="h-full w-full flex flex-col">
      <Header />
      <ErrorComponent
        className="h-full w-full"
        httpStatus={
          isNotFound ? { status: 404, statusText: "Not Found" } : undefined
        }
        title={error ? error.name : "Unknown Error"}
        message={
          !isNotFound
            ? error
              ? error.message
              : "An unknown error has occurred"
            : undefined
        }
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
                "https://github.com/rufus582/dev-utils/issues/new",
              )
            }
          >
            Raise an issue here
          </Button>
        </EmptyDescription>
      </ErrorComponent>
    </div>
  );
};

export default AppError;
