import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import { Icon } from "#icons/huge-icon";
import {
  ComputerSettingsIcon,
  DownloadIcon,
  MoonIcon,
  SunIcon,
} from "#icons/pages";
import { Alert, AlertDescription, AlertTitle } from "#ui/alert";
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
import { Skeleton } from "#ui/skeleton";
import { Switch } from "#ui/switch";
import LoginWithChatGPTSettings from "@/components/chatgpt/login-with-chatgpt-settings";
import { cn } from "@/lib/utils";
import { settingsOps } from "@/store/indexed-db/settings";
import { usePWA } from "@/store/pwa-provider";

const SettingsSkeleton = ({ fieldsCount = 2 }: { fieldsCount?: number }) => {
  return (
    <div className="flex flex-col gap-8 w-full">
      {Array.from({ length: fieldsCount }).map((_, index) => (
        <div className="flex gap-4 justify-between" key={index}>
          <div className="flex flex-col gap-2 w-1/2">
            <Skeleton className="h-5 my-auto w-1/4 rounded-full" />
            <Skeleton className="h-5 my-auto w-1/2 rounded-full" />
          </div>
          <Skeleton className="my-auto h-8 w-[15%] rounded-full self-end" />
        </div>
      ))}
    </div>
  );
};

const SettingsTab = () => {
  const { needRefresh, updateServiceWorker } = usePWA();

  const settings = useLiveQuery(settingsOps.get);

  const onSettingChanged = async (newSettings: Partial<typeof settings>) => {
    try {
      await settingsOps.update({
        ...settings,
        ...newSettings,
      });
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[75%] mx-auto">
      {needRefresh && (
        <Alert className="col-span-5 rounded-xl">
          <Icon icon={DownloadIcon} />
          <div className="flex">
            <div>
              <AlertTitle>New content available!</AlertTitle>
              <AlertDescription>
                Please save your work and click the update button when ready.
              </AlertDescription>
            </div>
            <Button
              variant="secondary"
              className="rounded-full my-auto"
              onClick={updateServiceWorker}
            >
              Update
            </Button>
          </div>
        </Alert>
      )}

      {settings ? (
        <>
          <Field className="col-span-5 flex flex-row">
            <div className="flex flex-col gap-1 w-full">
              <FieldLabel htmlFor="theme">Theme</FieldLabel>
              <FieldDescription>Select the theme for the app.</FieldDescription>
            </div>
            <Select
              name="theme"
              defaultValue={settings.theme}
              onValueChange={(value) => {
                onSettingChanged({
                  theme: value as "dark" | "light" | "system",
                });
              }}
            >
              <SelectTrigger
                id="theme"
                name="theme"
                className={cn(
                  "max-w-30 rounded-3xl! transition-all border-0 dark:bg-transparent my-auto",
                  "dark:[:hover,[data-state=open]]:bg-input dark:[&>svg]:bg-neutral-800 dark:[&:is([data-state=open],_:hover)>svg]:bg-neutral-600",
                  "[:hover,[data-state=open]]:bg-input/80 [&>svg]:bg-neutral-200 [&:is([data-state=open],_:hover)>svg]:bg-neutral-400/50",
                  "[&:is([data-state=open],_:hover)>svg]:text-foreground [&>svg]:rounded-full [&>svg]:transition-all [&>svg]:-m-1 [&>span]:gap-2!",
                )}
                size="default"
              >
                <SelectValue placeholder="Select Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Theme</SelectLabel>
                  <SelectItem key="light" value="light">
                    <Icon icon={SunIcon} />
                    Light
                  </SelectItem>
                  <SelectItem key="dark" value="dark">
                    <Icon icon={MoonIcon} />
                    Dark
                  </SelectItem>
                  <SelectItem key="system" value="system">
                    <Icon icon={ComputerSettingsIcon} />
                    System
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field className="col-span-5 flex flex-row">
            <div className="flex flex-col gap-1 w-full">
              <FieldLabel htmlFor="pageTransition">
                Page Transition Animation
              </FieldLabel>
              <FieldDescription>
                Enable or disable the page transition animation.
              </FieldDescription>
            </div>
            <Switch
              id="pageTransition"
              name="pageTransition"
              className="max-w-8 my-auto mr-2"
              defaultChecked={settings.pageTransition}
              onCheckedChange={(pageTransition) => {
                onSettingChanged({
                  pageTransition: pageTransition,
                });
              }}
            />
          </Field>
          <LoginWithChatGPTSettings />
        </>
      ) : (
        <SettingsSkeleton fieldsCount={3} />
      )}
    </div>
  );
};

export default SettingsTab;
