import { listAiProvidersClient } from "#/ai/providers/registry";
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
import { Switch } from "#ui/switch";
import { cn } from "@/lib/utils";
import { usePWA } from "@/store/pwa-provider";
import SettingsSection from "./-section";

const SettingsTab = () => {
  const { needRefresh, updateServiceWorker } = usePWA();

  const aiProviders = listAiProvidersClient();

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

      <SettingsSection title="General" fieldsCount={2}>
        {(settings, onSettingChanged) => {
          return (
            <>
              <Field className="col-span-5 flex flex-row">
                <div className="flex flex-col gap-1 w-full">
                  <FieldLabel htmlFor="theme">Theme</FieldLabel>
                  <FieldDescription>
                    Select the theme for the app.
                  </FieldDescription>
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
            </>
          );
        }}
      </SettingsSection>

      <SettingsSection title="AI Providers" fieldsCount={2}>
        <div className="flex flex-col gap-4 p-4 bg-card rounded-2xl">
          {aiProviders.map((provider) => (
            <provider.SettingsEntry key={provider.id} />
          ))}
        </div>
        <p className="text-muted-foreground/50 mt-2 text-center text-sm">
          More coming soon
        </p>
      </SettingsSection>
    </div>
  );
};

export default SettingsTab;
