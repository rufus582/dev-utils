import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Icon } from "#components/icons/huge-icon.tsx";
import { Button } from "#ui/button";
import { Field, FieldDescription, FieldLabel } from "#ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "#ui/select";
import { Skeleton } from "#ui/skeleton.tsx";
import { Spinner } from "#ui/spinner";
import LoginWithChatGPTDialog from "@/components/chatgpt/login-with-chatgpt-dialog";
import { useAiModels } from "@/hooks/use-ai-models";
import { useChatGPTSession } from "@/hooks/use-chatgpt-session";
import { LWC_PROVIDER_ID } from "@/lib/ai/providers/ids";
import { cn } from "@/lib/utils";
import { settingsOps } from "@/store/indexed-db/settings";
import { CheckmarkCircleIcon } from "../icons/ui";

const selectTriggerClassName = cn(
  "min-w-40 max-w-56 rounded-3xl! transition-all border-0 dark:bg-transparent my-auto",
  "dark:[:hover,[data-state=open]]:bg-input dark:[&>svg]:bg-neutral-800 dark:[&:is([data-state=open],_:hover)>svg]:bg-neutral-600",
  "[:hover,[data-state=open]]:bg-input/80 [&>svg]:bg-neutral-200 [&:is([data-state=open],_:hover)>svg]:bg-neutral-400/50",
  "[&:is([data-state=open],_:hover)>svg]:text-foreground [&>svg]:rounded-full [&>svg]:transition-all [&>svg]:-m-1 [&>span]:gap-2!",
);

const LoginWithChatGPTSettings = () => {
  const { status, user, isSignedIn, logout } = useChatGPTSession();
  const settings = useLiveQuery(settingsOps.get);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const {
    models,
    isLoading: isLoadingModels,
    error: modelsError,
  } = useAiModels({
    enabled: isSignedIn,
    providerId: LWC_PROVIDER_ID,
  });

  const selectedModelId = settings?.aiModelId;
  const selectedModelStillAvailable = models.some(
    (model) => model.id === selectedModelId,
  );

  useEffect(() => {
    if (!isSignedIn || !settings || isLoadingModels || models.length === 0) {
      return;
    }

    const needsProvider =
      settings.aiProviderId !== LWC_PROVIDER_ID || !settings.aiProviderId;
    const needsModel =
      !settings.aiModelId ||
      !models.some((model) => model.id === settings.aiModelId);

    if (!needsProvider && !needsModel) {
      return;
    }

    const nextModelId = needsModel
      ? (models[0]?.id ?? undefined)
      : settings.aiModelId;

    void settingsOps
      .update({
        aiProviderId: LWC_PROVIDER_ID,
        aiModelId: nextModelId,
      })
      .catch((error) => {
        toast.error(`${error}`);
      });
  }, [isSignedIn, settings, isLoadingModels, models]);

  const handleConnect = () => {
    setLoginDialogOpen(true);
  };

  const handleDisconnect = async () => {
    await logout();
  };

  const handleModelChange = async (modelId: string) => {
    try {
      await settingsOps.update({
        aiProviderId: LWC_PROVIDER_ID,
        aiModelId: modelId,
      });
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Field className="col-span-5 flex flex-row">
        <div className="flex flex-col gap-1 w-full">
          <FieldLabel htmlFor="chatgpt">ChatGPT</FieldLabel>
          <FieldDescription>
            {status === "loading" ? (
              <Skeleton className="w-1/3 h-5 rounded-3xl" />
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

      {isSignedIn && (
        <Field className="col-span-5 flex flex-row">
          <div className="flex flex-col gap-1 w-full">
            <FieldLabel htmlFor="ai-model">Model</FieldLabel>
            <FieldDescription>
              {modelsError
                ? modelsError
                : "Choose which ChatGPT model to use for AI generation."}
            </FieldDescription>
          </div>
          {isLoadingModels ? (
            <Skeleton className="my-auto h-8 min-w-40 max-w-56 w-56 rounded-full" />
          ) : (
            <Select
              name="ai-model"
              value={
                selectedModelStillAvailable ? selectedModelId : models[0]?.id
              }
              onValueChange={(value) => {
                void handleModelChange(value);
              }}
              disabled={models.length === 0}
            >
              <SelectTrigger
                id="ai-model"
                name="ai-model"
                className={selectTriggerClassName}
                size="default"
              >
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select model</SelectLabel>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.label ?? model.id}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </Field>
      )}

      <LoginWithChatGPTDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
      />
    </div>
  );
};

export default LoginWithChatGPTSettings;
