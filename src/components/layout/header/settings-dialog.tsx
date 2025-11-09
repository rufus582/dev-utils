import { MoonIcon, SaveIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Button as AnimatedButton } from "@/components/ui/custom-components/animated-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRef, useState, type ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import * as z from "zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { AnimatePresence, motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLiveQuery } from "dexie-react-hooks";
import { settingsOps } from "@/store/indexed-db/settings";
import { cn, sleep } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

const SettingsFormFields = z.strictObject({
  theme: z.literal(["system", "light", "dark"]),
  pageTransition: z.literal(["on", "off", undefined]),
});

type SettingsFormType = z.infer<typeof SettingsFormFields>;
type SettingsFormErrors = z.core.$ZodFlattenedError<SettingsFormType>;

interface ISettingsDialogProps {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SettingsSkeleton = ({ fieldsCount = 2 }: { fieldsCount?: number }) => {
  return (
    <div className="flex flex-col col-span-5 **:data-field-separator:w-full **:data-field-separator:my-4">
      {Array.from({ length: fieldsCount }).map((_, index) => (
        <div key={index}>
          <div className="flex gap-4">
            <Skeleton className="h-5 my-auto w-1/2 rounded-full" />
            <Skeleton className="h-8 w-1/2 rounded-full" />
          </div>
          <Separator data-field-separator />
        </div>
      ))}
    </div>
  );
};

const SettingsDialog = ({
  trigger,
  open,
  onOpenChange,
}: ISettingsDialogProps) => {
  const settings = useLiveQuery(settingsOps.get);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(open || false);
  const [formErrors, setFormErrors] = useState<SettingsFormErrors>();
  const formRef = useRef<HTMLFormElement>(null);
  const handleSaveSettings = async (): Promise<boolean> => {
    try {
      const formData = new FormData(formRef.current ?? undefined);
      console.log(Object.fromEntries(formData.entries()));
      const formResponse = SettingsFormFields.parse(
        Object.fromEntries(formData.entries())
      );

      await settingsOps.update({
        ...formResponse,
        pageTransition: formResponse.pageTransition === "on",
      });

      // Delay to make theme transition less intrusive
      await sleep(1000);

      toast.success(`Successfully updated settings.`);
      setIsFormOpen(false);
      onOpenChange?.(false);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) setFormErrors(z.flattenError(error));
      else toast.error(`${error}`);

      return false;
    }
  };

  const onFormOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    onOpenChange?.(open);
    setFormErrors(undefined);
  };

  return (
    <Dialog open={open || isFormOpen} onOpenChange={onFormOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="rounded-3xl" bgBlur>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Set your preferences here.</DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          onSubmit={(ev) => {
            ev.preventDefault();
          }}
        >
          <div className="grid grid-cols-5 gap-0 **:data-field-separator:col-span-5 **:data-field-separator:my-4">
            {/* <Alert className="col-span-5 rounded-xl">
              <InfoIcon />
              <AlertDescription>
                Data from SQL Playground cannot be saved!
              </AlertDescription>
            </Alert>
            <Separator className="col-span-5" /> */}

            {settings ? (
              <>
                <Field
                  data-invalid={Boolean(formErrors?.fieldErrors.theme)}
                  className="col-span-5 flex flex-row"
                >
                  <FieldLabel htmlFor="theme">Theme</FieldLabel>
                  <Select name="theme" defaultValue={settings.theme}>
                    <SelectTrigger
                      id="theme"
                      name="theme"
                      className={cn(
                        "my-auto max-w-[120px] rounded-full transition-all border-0 dark:bg-transparent",
                        "dark:data-[state=open]:bg-input/50 [:hover,[data-state=open]]:bg-input",
                        "[&>svg]:bg-input [&:is([data-state=open],_:hover)>svg]:bg-accent-foreground [&>svg]:rounded-full [&>svg]:transition-all [&>svg]:-m-1"
                      )}
                      size="sm"
                    >
                      <SelectValue placeholder="Select Theme" />
                    </SelectTrigger>
                    <SelectContent className="rounded-b-xl">
                      <SelectGroup>
                        <SelectLabel>Select Theme</SelectLabel>
                        <SelectItem key="light" value="light">
                          <SunIcon />
                          Light
                        </SelectItem>
                        <SelectItem key="dark" value="dark">
                          <MoonIcon />
                          Dark
                        </SelectItem>
                        <SelectItem key="system" value="system">
                          <SunMoonIcon />
                          System
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <AnimatePresence>
                    {formErrors?.fieldErrors.theme && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="col-span-5"
                      >
                        <FieldError
                          errors={formErrors.fieldErrors.theme.map((val) => ({
                            message: val,
                          }))}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Field>
                <Separator data-field-separator />
                <Field
                  data-invalid={Boolean(formErrors?.fieldErrors.pageTransition)}
                  className="col-span-5 flex flex-row"
                >
                  <FieldLabel htmlFor="pageTransition">
                    Page Transition Animation
                  </FieldLabel>
                  <Switch
                    id="pageTransition"
                    name="pageTransition"
                    className="max-w-8"
                    defaultChecked={settings.pageTransition}
                  />
                </Field>
                <Separator data-field-separator />
              </>
            ) : (
              <SettingsSkeleton fieldsCount={2} />
            )}
          </div>
          <DialogFooter className="*:w-[48%] sm:justify-between">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-full" type="button">
                Cancel
              </Button>
            </DialogClose>
            <AnimatedButton
              type="submit"
              buttonIcon={<SaveIcon />}
              className="rounded-full"
              onClick={handleSaveSettings}
              useDefaultInteractionAnimation
            >
              Save
            </AnimatedButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
