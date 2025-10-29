import {
  CheckCircle2Icon,
  MoonIcon,
  SaveIcon,
  SunIcon,
  SunMoonIcon,
  XCircleIcon,
} from "lucide-react";
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
import { sleep } from "@/lib/utils";

const SettingsFormFields = z.strictObject({
  theme: z.literal(["system", "light", "dark"]),
  pageTransition: z.literal(["true", "false"]),
});

type SettingsFormType = z.infer<typeof SettingsFormFields>;
type SettingsFormErrors =
  z.core.$ZodFlattenedError<SettingsFormType>;

interface ISettingsDialogProps {
  trigger: ReactNode;
}

const SettingsDialog = ({ trigger }: ISettingsDialogProps) => {
  const settings = useLiveQuery(settingsOps.get);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<SettingsFormErrors>();
  const formRef = useRef<HTMLFormElement>(null);
  const handleSaveSettings = async (): Promise<boolean> => {
    try {
      const formData = new FormData(formRef.current ?? undefined);
      const formResponse = SettingsFormFields.parse(
        Object.fromEntries(formData.entries())
      );

      await settingsOps.update({
        ...formResponse,
        pageTransition: formResponse.pageTransition === "true",
      });

      // Delay to make theme transition less intrusive
      await sleep(1000);

      toast.success(`Successfully updated settings.`);
      setIsFormOpen(false);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) setFormErrors(z.flattenError(error));
      else toast.error(`${error}`);

      return false;
    }
  };

  const onFormOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    setFormErrors(undefined);
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={onFormOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent bgBlur>
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
          <div className="grid grid-cols-5 gap-4">
            {/* <Alert className="col-span-5 rounded-xl">
              <InfoIcon />
              <AlertDescription>
                Data from SQL Playground cannot be saved!
              </AlertDescription>
            </Alert>
            <Separator className="col-span-5" /> */}

            {settings && (
              <>
                <Field
                  data-invalid={Boolean(formErrors?.fieldErrors.theme)}
                  className="col-span-5 grid grid-cols-5"
                >
                  <FieldLabel className="col-span-2" htmlFor="theme">
                    Theme
                  </FieldLabel>
                  <Select name="theme" defaultValue={settings.theme}>
                    <SelectTrigger
                      id="theme"
                      name="theme"
                      className="my-auto col-span-3 rounded-full"
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
                <Field
                  data-invalid={Boolean(formErrors?.fieldErrors.pageTransition)}
                  className="col-span-5 grid grid-cols-5"
                >
                  <FieldLabel className="col-span-2" htmlFor="pageTransition">
                    Page Transition
                  </FieldLabel>
                  <Select
                    defaultValue={`${settings.pageTransition}`}
                    name="pageTransition"
                  >
                    <SelectTrigger
                      id="pageTransition"
                      name="pageTransition"
                      className="my-auto col-span-3 rounded-full"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-b-xl">
                      <SelectGroup>
                        <SelectLabel>Select Theme</SelectLabel>
                        <SelectItem key="true" value="true">
                          <CheckCircle2Icon />
                          Animate
                        </SelectItem>
                        <SelectItem key="false" value="false">
                          <XCircleIcon />
                          Don't Animate
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
                <Separator className="col-span-5" />
              </>
            )}
          </div>
          <DialogFooter className="mt-4">
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
