import { InfoIcon, SaveIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRef, useState, type ReactNode } from "react";
import { useStore } from "react-redux";
import type { AppStateType } from "@/store/redux";
import { Separator } from "@/components/ui/separator";
import { snapshotOps } from "@/store/indexed-db/snapshots";
import { toast } from "sonner";
import * as z from "zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { AnimatePresence, motion } from "motion/react";

const CreateSnapshotFormFields = z.strictObject({
  name: z.string().min(5, "Name must have atleast 5 characters."),
});

type CreateSnapshotFormType = z.infer<typeof CreateSnapshotFormFields>;
type CreateSnapshotFormErrors =
  z.core.$ZodFlattenedError<CreateSnapshotFormType>;

interface ICreateSnapshotDialogProps {
  trigger: ReactNode;
}

const CreateSnapshotDialog = ({ trigger }: ICreateSnapshotDialogProps) => {
  const store = useStore<AppStateType>();
  const currentAppState = store.getState();

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [createSnapshotFormErrors, setCreateSnapshotFormErrors] =
    useState<CreateSnapshotFormErrors>();
  const createSnapshotFormRef = useRef<HTMLFormElement>(null);
  const handleSaveSnapshot = async (): Promise<boolean> => {
    try {
      const formData = new FormData(createSnapshotFormRef.current ?? undefined);
      const formResponse = CreateSnapshotFormFields.parse(
        Object.fromEntries(formData.entries())
      );

      await snapshotOps.create(currentAppState, formResponse.name);

      toast.success(`Successfully saved current app state.`);
      setIsFormOpen(false);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError)
        setCreateSnapshotFormErrors(z.flattenError(error));
      else toast.error(`${error}`);

      return false;
    }
  };

  const onFormOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    setCreateSnapshotFormErrors(undefined);
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={onFormOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent bgBlur>
        <DialogHeader>
          <DialogTitle>Create Snapshot</DialogTitle>
          <DialogDescription>
            Save a snapshot of the data from all pages.
          </DialogDescription>
        </DialogHeader>
        <form
          ref={createSnapshotFormRef}
          onSubmit={(ev) => {
            ev.preventDefault();
          }}
        >
          <div className="grid grid-cols-5 gap-4">
            <Alert className="col-span-5 rounded-xl">
              <InfoIcon />
              <AlertDescription>
                Data from SQL Playground cannot be saved!
              </AlertDescription>
            </Alert>
            <Separator className="col-span-5" />

            <Field
              data-invalid={Boolean(createSnapshotFormErrors?.fieldErrors.name)}
              className="col-span-5"
            >
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                className="rounded-full hover:border-muted-foreground transition-colors aria-[invalid=true]:border-destructive"
                placeholder="Any name of your choice to use when saving app state"
                aria-invalid={Boolean(
                  createSnapshotFormErrors?.fieldErrors.name
                )}
                onChange={() => setCreateSnapshotFormErrors(undefined)}
              />
              <AnimatePresence>
                {createSnapshotFormErrors?.fieldErrors.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <FieldError
                      errors={createSnapshotFormErrors.fieldErrors.name.map(
                        (val) => ({
                          message: val,
                        })
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Field>
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
              onClick={handleSaveSnapshot}
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

export default CreateSnapshotDialog;
