import _ from "lodash";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Icon } from "@/components/icons/huge-icon";
import { DatabaseAddIcon } from "@/components/icons/pages";
import { TableIcon } from "@/components/icons/routes";
import { Button as NormalButton } from "@/components/ui/button";
import { Button } from "@/components/ui/custom-components/animated-button";
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { ISQLDBProps } from "@/lib/sql";
import { generateTableQueryFromJsonArray } from "@/lib/sql-utils";
import { TextFormatsList } from "@/lib/text-formats";
import { Tooltip } from "@/components/ui/custom-components/tooltip-wrapper";

const ImportTableFormFields = z.strictObject({
  tableName: z
    .string()
    .regex(
      /^[^0-9][a-zA-z_0-9]*$/,
      "Table name cannot be empty, must start with an alphabet and can contain only alphanumeric or underscore(_) characters.",
    ),
  file: z
    .file()
    .min(1, "Supported formats: JSON, CSV, PARQUET. File cannot be empty."),
});

type ImportTableFormType = z.infer<typeof ImportTableFormFields>;
type ImportTableFormErrorType = z.core.$ZodFlattenedError<ImportTableFormType>;

interface ImportTableFormProps {
  db?: ISQLDBProps;
  disabled?: boolean;
}

const ImportTableForm = ({ db, disabled }: ImportTableFormProps) => {
  const [isImportFormOpen, setIsImportFormOpen] = useState<boolean>(false);
  const [importTableFormErrors, setImportTableFormErrors] =
    useState<ImportTableFormErrorType>();
  const importTableFormRef = useRef<HTMLFormElement>(null);
  const onImportTableFormSubmit = async (): Promise<boolean> => {
    try {
      const formData = new FormData(importTableFormRef.current ?? undefined);
      const formResponse = ImportTableFormFields.parse(
        Object.fromEntries(formData.entries()),
        {},
      );

      const fileExtension = _.toPath(formResponse.file.name).pop();

      const fileFormat = TextFormatsList.find(
        (format) =>
          format.mimeType === formResponse.file.type ||
          (fileExtension && format.extensions.includes(fileExtension)),
      );
      if (!fileFormat || fileFormat === undefined) {
        throw new Error(
          "Unsupported file format. Supported formats are: JSON, CSV, PARQUET",
        );
      }

      const fileContent = await (fileFormat.isBinary
        ? formResponse.file.arrayBuffer()
        : formResponse.file.text());
      const parsedData = await fileFormat.parse(fileContent);

      if (!Array.isArray(parsedData)) {
        throw new Error("Cannot load object to database");
      }

      const tableQueryData = generateTableQueryFromJsonArray(
        parsedData,
        formResponse.tableName,
      );

      await Promise.resolve(db?.run(tableQueryData.createTableQuery));
      tableQueryData.insertQueries.forEach(
        async (query) => await Promise.resolve(db?.run(query)),
      );

      toast.success(`Successfully imported table: ${formResponse.tableName}`);
      setIsImportFormOpen(false);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError)
        setImportTableFormErrors(z.flattenError(error));
      else toast.error(`${error}`);

      return false;
    }
  };

  const onImportTableFormOpenChange = (open: boolean) => {
    setIsImportFormOpen(open);
    setImportTableFormErrors(undefined);
  };

  return (
    <Dialog open={isImportFormOpen} onOpenChange={onImportTableFormOpenChange}>
      <Tooltip content="Import table from a file" asChild>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            loaderIcon={null}
            buttonIcon={<Icon icon={DatabaseAddIcon} />}
            successIcon={null}
            errorIcon={null}
            className="w-fit rounded-full"
            disabled={disabled}
            useDefaultInteractionAnimation
          >
            Import Table
          </Button>
        </DialogTrigger>
      </Tooltip>
      <DialogContent className="rounded-3xl" bgBlur>
        <DialogHeader>
          <DialogTitle>Import Table</DialogTitle>
          <DialogDescription>
            Create table with rows imported from a file.
          </DialogDescription>
        </DialogHeader>
        <form
          ref={importTableFormRef}
          onSubmit={(ev) => {
            ev.preventDefault();
          }}
        >
          <FieldSet>
            <Field
              data-invalid={Boolean(
                importTableFormErrors?.fieldErrors.tableName,
              )}
            >
              <FieldLabel htmlFor="tableName">Table Name</FieldLabel>
              <Input
                id="tableName"
                name="tableName"
                type="text"
                className="rounded-full hover:border-muted-foreground transition-colors aria-invalid:border-destructive"
                placeholder="Example: users"
                aria-invalid={Boolean(
                  importTableFormErrors?.fieldErrors.tableName,
                )}
                onChange={() => setImportTableFormErrors(undefined)}
              />
              <AnimatePresence>
                {importTableFormErrors?.fieldErrors.tableName && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="text-destructive text-sm font-normal"
                  >
                    <FieldError
                      errors={importTableFormErrors.fieldErrors.tableName.map(
                        (err) => ({
                          message: err,
                        }),
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Field>
            <Field
              data-invalid={Boolean(importTableFormErrors?.fieldErrors.file)}
            >
              <FieldLabel htmlFor="fileInput">Open File</FieldLabel>
              <Input
                id="fileInput"
                name="file"
                type="file"
                accept=".json,.csv,.parquet"
                className="file:text-secondary-foreground file:bg-secondary file:border-border file:border file:px-2 file:h-full file:rounded-full hover:file:bg-secondary/60 hover:border-muted-foreground rounded-full px-1 cursor-pointer file:cursor-pointer col-span-4 transition-colors"
                onChange={() => setImportTableFormErrors(undefined)}
                aria-invalid={Boolean(importTableFormErrors?.fieldErrors.file)}
              />
              <AnimatePresence>
                {importTableFormErrors?.fieldErrors.file && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <FieldError
                      errors={importTableFormErrors.fieldErrors.file.map(
                        (err) => ({
                          message: err,
                        }),
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {!importTableFormErrors?.fieldErrors.file && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <FieldDescription>
                      Supported formats: JSON, CSV, PARQUET
                    </FieldDescription>
                  </motion.div>
                )}
              </AnimatePresence>
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
              buttonIcon={<Icon icon={TableIcon} strokeWidth={1.5} />}
              className="rounded-full"
              onClick={onImportTableFormSubmit}
              useDefaultInteractionAnimation
            >
              Load Table
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { ImportTableForm, type ImportTableFormProps };
