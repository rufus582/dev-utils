import { ChatGPTMark } from "@opencoredev/loginwithchatgpt-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AppLogo from "#icons/app-logo";
import { Icon } from "#icons/huge-icon";
import { ArrowRightIcon, CopyCheckIcon, CopyIcon } from "#icons/ui";
import { Alert, AlertDescription, AlertTitle } from "#ui/alert";
import { Button } from "#ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#ui/dialog";
import { Kbd } from "#ui/kbd";
import { Spinner } from "#ui/spinner";
import { useChatGPTSession } from "@/hooks/use-chatgpt-session";
import {
  CHATGPT_APP_NAME,
  getChatGPTConsentBullets,
} from "@/lib/chatgpt/consent";

type LoginWithChatGPTDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type DialogStep = "consent" | "pending";

const LoginWithChatGPTDialog = ({
  open,
  onOpenChange,
}: LoginWithChatGPTDialogProps) => {
  const {
    status,
    userCode,
    verificationUrl,
    copied,
    error,
    isAuthenticated,
    isConnecting,
    login,
    logout,
    copyCode,
    reopen,
  } = useChatGPTSession();

  const [step, setStep] = useState<DialogStep>("consent");
  const shouldOpenVerificationRef = useRef(false);
  const wasOpenRef = useRef(false);
  const [isAborting, setIsAborting] = useState(false);

  useEffect(() => {
    if (!open) {
      wasOpenRef.current = false;
      return;
    }

    if (isAuthenticated) {
      onOpenChange(false);
      return;
    }

    if (!wasOpenRef.current) {
      setStep("consent");
      wasOpenRef.current = true;
    }
  }, [open, isAuthenticated, onOpenChange]);

  useEffect(() => {
    if (!open || step !== "pending" || !verificationUrl) {
      return;
    }

    if (!shouldOpenVerificationRef.current) {
      return;
    }

    shouldOpenVerificationRef.current = false;
    reopen();
  }, [open, step, verificationUrl, reopen]);

  const handleContinue = async () => {
    try {
      shouldOpenVerificationRef.current = true;
      await login();
      setStep("pending");
    } catch {
      shouldOpenVerificationRef.current = false;
      toast.error("Unable to start ChatGPT login. Please try again.");
    }
  };

  const handleCancel = async () => {
    if (step === "pending") {
      shouldOpenVerificationRef.current = false;
      setIsAborting(true);
      try {
        await logout();
      } catch {
        toast.error("Unable to cancel ChatGPT login. Please try again.");
        setIsAborting(false);
        return;
      }
      setIsAborting(false);
      handleOpenChange(false);
      return;
    }

    handleOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-5 rounded-3xl sm:max-w-md" bgBlur>
        <DialogHeader className="gap-3">
          <DialogTitle>
            {step === "consent"
              ? "Connect your ChatGPT account"
              : "Complete verification"}
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            {step === "consent"
              ? `Authorize ${CHATGPT_APP_NAME} to use your ChatGPT account for AI features.`
              : "Enter the code below on the OpenAI verification page."}
          </DialogDescription>
          {step === "consent" ? (
            <div
              className="flex items-center justify-center gap-2.5 pt-0.5 sm:justify-start"
              aria-hidden
            >
              <span className="inline-flex items-center gap-1.5 rounded-lg border bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground">
                <AppLogo className="size-3.5 stroke-foreground" />
                {CHATGPT_APP_NAME}
              </span>
              <Icon
                icon={ArrowRightIcon}
                className="size-3.5 text-muted-foreground/70"
              />
              <span className="inline-flex items-center gap-1.5 rounded-lg border bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground">
                <ChatGPTMark className="size-3.5" />
                ChatGPT
              </span>
            </div>
          ) : null}
        </DialogHeader>

        {step === "consent" ? (
          <div className="flex flex-col gap-4">
            <Alert className="rounded-xl">
              <AlertTitle>Before you continue</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 list-disc space-y-2 pl-4 text-sm">
                  {getChatGPTConsentBullets().map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">
                Click Continue
              </span>{" "}
              to copy your verification code and open OpenAI in a new tab.
              You&apos;ll use this code to securely connect your ChatGPT account
              to {CHATGPT_APP_NAME}.
            </p>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {userCode ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">
                  Your verification code
                </p>
                <Kbd className="pointer-events-auto h-auto px-3 py-2 font-mono text-lg tracking-widest">
                  {userCode}
                </Kbd>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => void copyCode()}
                  >
                    <Icon icon={copied ? CopyCheckIcon : CopyIcon} />
                    {copied ? "Copied" : "Copy code"}
                  </Button>
                  {verificationUrl ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="rounded-full"
                      onClick={reopen}
                    >
                      Open verification page
                    </Button>
                  ) : null}
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  This updates automatically after you enter the code on
                  OpenAI&apos;s page.
                </p>
              </div>
            ) : null}

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
        )}

        <DialogFooter className="gap-3 pt-1 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="min-h-10 rounded-full"
            disabled={isAborting}
            onClick={() => void handleCancel()}
          >
            Cancel
          </Button>
          {step === "consent" ? (
            <Button
              type="button"
              className="min-h-10 rounded-full"
              disabled={isConnecting || status === "loading"}
              onClick={() => void handleContinue()}
            >
              {isConnecting ? (
                <>
                  <Spinner />
                  Connecting…
                </>
              ) : (
                "Continue"
              )}
            </Button>
          ) : (
            <Button type="button" className="min-h-10 rounded-full" disabled>
              <Spinner />
              Waiting for verification…
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginWithChatGPTDialog;
