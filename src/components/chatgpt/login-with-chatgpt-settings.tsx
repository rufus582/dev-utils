import { useState } from "react";
import { Icon } from "#components/icons/huge-icon.tsx";
import { Button } from "#ui/button";
import { Field, FieldDescription, FieldLabel } from "#ui/field";
import { Spinner } from "#ui/spinner";
import LoginWithChatGPTDialog from "@/components/chatgpt/login-with-chatgpt-dialog";
import { useChatGPTSession } from "@/hooks/use-chatgpt-session";
import { CheckmarkCircleIcon } from "../icons/ui";
import { Skeleton } from "#ui/skeleton.tsx";

const LoginWithChatGPTSettings = () => {
  const { status, user, isSignedIn, logout } = useChatGPTSession();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const handleConnect = () => {
    setLoginDialogOpen(true);
  };

  const handleDisconnect = async () => {
    await logout();
  };

  return (
    <>
      <Field className="col-span-5 flex flex-row">
        <div className="flex flex-col gap-1 w-full">
          <FieldLabel htmlFor="chatgpt">ChatGPT</FieldLabel>
          <FieldDescription>
            {status === "loading" ? (
              <Skeleton className="w-1/3 h-full rounded-3xl" />
            ) : isSignedIn ? (
              <div className="flex flex-row items-center gap-1">
                <Icon icon={CheckmarkCircleIcon} className="text-green-500" />
                <p>
                  {user?.plan
                    ? `Connected - ${user.plan.normalize().toUpperCase()} Subscription`
                    : "Connected"}
                </p>
              </div>
            ) : (
              "Connect your ChatGPT account to use AI features."
            )}
          </FieldDescription>
        </div>
        <div className="ml-auto flex flex-2 items-center gap-2 *:ml-auto w-fit my-auto">
          {status === "loading" ? (
            <Button
              id="chatgpt"
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-full"
              disabled
            >
              <Spinner />
              Checking
            </Button>
          ) : isSignedIn ? (
            <Button
              id="chatgpt"
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full text-destructive hover:bg-destructive/10! hover:text-destructive"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              id="chatgpt"
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-full"
              onClick={handleConnect}
            >
              Connect
            </Button>
          )}
        </div>
      </Field>
      <LoginWithChatGPTDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
      />
    </>
  );
};

export default LoginWithChatGPTSettings;
