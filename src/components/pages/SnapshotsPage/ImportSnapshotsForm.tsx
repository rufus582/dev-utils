import { Button as NormalButton } from "@/components/ui/button";
import { Grid2x2Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TextFormats } from "@/lib/text-formats";
import { Button } from "@/components/ui/custom-components/animated-button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { AnimatePresence, motion } from "motion/react";
import * as z from "zod";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { snapshotOps, snapshotSchema } from "@/store/indexed-db/snapshots";

const ImportSnapshotsFormFields = z.strictObject({
  file: z.file().min(1, "Please open a valid backup file."),
  overrideDuplicates: z.literal(["on", "off", undefined]),
});

const snapshotsFileSchema = z.array(snapshotSchema)

type ImportSnapshotsFormType = z.infer<typeof ImportSnapshotsFormFields>;
type ImportSnapshotsFormErrorType =
  z.core.$ZodFlattenedError<ImportSnapshotsFormType>;

interface ImportSnapshotsFormProps {
  triggerElement: React.ReactNode;
}

const ImportSnapshotsForm = ({ triggerElement }: ImportSnapshotsFormProps) => {
  const [isImportFormOpen, setIsImportFormOpen] = useState<boolean>(false);
  const [importSnapshotsFormErrors, setImportSnapshotsFormErrors] =
    useState<ImportSnapshotsFormErrorType>();
  const importSnapshotsFormRef = useRef<HTMLFormElement>(null);
  const onImportSnapshotsFormSubmit = async (): Promise<boolean> => {
    try {
      const formData = new FormData(
        importSnapshotsFormRef.current ?? undefined,
      );
      const formResponse = ImportSnapshotsFormFields.parse(
        Object.fromEntries(formData.entries()),
        {},
      );

      const fileContent = await formResponse.file.text();
      const parsedData = await TextFormats.JSON.parse(fileContent);

      const importedSnapshots = snapshotsFileSchema.safeParse(parsedData)
      if (!importedSnapshots.success) {
        console.log(importedSnapshots.error)
        throw new SyntaxError()
      }
      await snapshotOps.createBulk(importedSnapshots.data, formResponse.overrideDuplicates === "on")

      toast.success(`Successfully imported snapshots`);
      setIsImportFormOpen(false);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setImportSnapshotsFormErrors(z.flattenError(error));
      }
      else if (error instanceof SyntaxError)
        setImportSnapshotsFormErrors({
          fieldErrors: {
            file: ["The opened file cannot be imported, it is either damaged or corrupted."],
          },
          formErrors: [],
        });
      else toast.error(`${error}`);

      return false;
    }
  };

  const onImportSnapshotsFormOpenChange = (open: boolean) => {
    setIsImportFormOpen(open);
    setImportSnapshotsFormErrors(undefined);
  };

  return (
    <Dialog
      open={isImportFormOpen}
      onOpenChange={onImportSnapshotsFormOpenChange}
    >
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="rounded-3xl" bgBlur>
        <DialogHeader>
          <DialogTitle>Import Snapshots</DialogTitle>
          <DialogDescription>
            Import backed up Snapshots from a different browser/device.
          </DialogDescription>
        </DialogHeader>
        <form
          ref={importSnapshotsFormRef}
          onSubmit={(ev) => {
            ev.preventDefault();
          }}
        >
          <FieldSet>
            <Field
              data-invalid={Boolean(
                importSnapshotsFormErrors?.fieldErrors.file,
              )}
            >
              <FieldLabel htmlFor="fileInput">Open File</FieldLabel>
              <Input
                id="fileInput"
                name="file"
                type="file"
                accept=".dvubak"
                className="file:text-secondary-foreground file:bg-secondary file:border-border file:border file:px-2 file:h-full file:rounded-full hover:file:bg-secondary/60 hover:border-muted-foreground rounded-full px-1 cursor-pointer file:cursor-pointer col-span-4 transition-colors"
                onChange={() => setImportSnapshotsFormErrors(undefined)}
                aria-invalid={Boolean(
                  importSnapshotsFormErrors?.fieldErrors.file,
                )}
              />
              <AnimatePresence mode="popLayout">
                {importSnapshotsFormErrors?.fieldErrors.file && (
                  <motion.div
                    // key={1}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <FieldError
                      errors={importSnapshotsFormErrors.fieldErrors.file.map(
                        (err) => ({
                          message: err,
                        }),
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence mode="popLayout" initial={false}>
                {!importSnapshotsFormErrors?.fieldErrors.file && (
                  <motion.div
                    // key={2}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <FieldDescription className="mb-0!">
                      Only files exported from this page are supported.
                    </FieldDescription>
                  </motion.div>
                )}
              </AnimatePresence>
            </Field>
            <Field
              data-invalid={Boolean(
                importSnapshotsFormErrors?.fieldErrors.overrideDuplicates,
              )}
            >
              <div className="flex *:my-auto gap-2">
                <Checkbox
                  id="overrideDuplicates"
                  name="overrideDuplicates"
                  className="aspect-square max-w-fit"
                />
                <FieldLabel htmlFor="overrideDuplicates">
                  Override duplicates
                </FieldLabel>
              </div>
              <FieldDescription>
                If enabled, snapshots with duplicate names will be renamed while
                importing.
              </FieldDescription>
            </Field>
            <Separator className="mb-4" />
          </FieldSet>
          <DialogFooter className="*:w-[48%] sm:justify-between">
            <DialogClose asChild>
              <NormalButton
                variant="outline"
                className="rounded-full"
                type="button"
              >
                Cancel
              </NormalButton>
            </DialogClose>
            <Button
              type="submit"
              buttonIcon={<Grid2x2Plus />}
              className="rounded-full"
              onClick={onImportSnapshotsFormSubmit}
              useDefaultInteractionAnimation
            >
              Start
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { ImportSnapshotsForm, type ImportSnapshotsFormProps };
