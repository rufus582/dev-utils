import CodeEditor, {
  type CodeEditorRefType,
} from "@/components/ui/code/code-editor";
import { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { TextFormatsList } from "@/lib/text-formats";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Header from "@/components/pages/page-header";
import { Button } from "@/components/ui/custom-components/animated-button";
import { Button as NormalButton } from "@/components/ui/button";
import {
  Check,
  ClipboardCheck,
  ClipboardPaste,
  ClipboardX,
  Grid2x2Plus,
  Play,
  TextCursorInput,
  X,
} from "lucide-react";
import { Tooltip } from "@/components/ui/custom-components/tooltip-wrapper";
import { getClipboardText } from "@/lib/utils";
import { toast } from "sonner";
import _ from "lodash";
import {
  convertSqlResultToRecords,
  generateTableQueryFromJsonArray,
} from "@/lib/sql-utils";
import initSqlJs, { type Database } from "sql.js";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type {
  JSONGridTabDataProps,
  JSONGridTabsRefType,
} from "@/components/ui/code/json-grid-tabs";
import JSONGridTabs from "@/components/ui/code/json-grid-tabs";

interface SQLDataStateType {
  db?: Database;
  sqlCode: string;
  resultData: JSONGridTabDataProps[];
}

interface ImportTableFormType {
  tableName?: string;
  file?: File;
}

const SQLPlayground = () => {
  const [isSQLPanelCollapsed, setIsSQLPanelCollapsed] = useState(false);
  const [sqlDataState, setSQLDataState] = useImmer<SQLDataStateType>({
    sqlCode: "",
    resultData: [],
  });

  const editorRef: CodeEditorRefType = useRef(null);
  const resultViewerRef: JSONGridTabsRefType = useRef(null);

  useEffect(() => {
    if (!sqlDataState.db) {
      initSqlJs({
        locateFile: (file) => `/${file}`,
      }).then((SQL) => {
        setSQLDataState((state) => {
          const db = new SQL.Database();
          state.db = db;
        });
        console.log("SQLite DB was successfully created");
      });
    }

    return () => {
      sqlDataState.db?.close();
      console.log("SQLite DB connection closed");
    };
  }, [setSQLDataState, sqlDataState.db]);

  useEffect(() => {
    if (sqlDataState.resultData.length > 0)
      resultViewerRef.current?.setSelectedTabValue(
        sqlDataState.resultData[0]?.value
      );
  }, [sqlDataState.resultData]);

  const [isImportFormOpen, setIsImportFormOpen] = useState<boolean>(false);
  const importTableFormRef = useRef<HTMLFormElement>(null);
  const onImportTableFormSubmit = async (): Promise<boolean> => {
    const formData = new FormData(importTableFormRef.current ?? undefined);
    const formResponse = Object.fromEntries(
      formData.entries()
    ) as unknown as ImportTableFormType;
    const fileExtension = _.toPath(formResponse.file?.name).pop();

    if (
      !formResponse.file ||
      formResponse.file.size === 0 ||
      !formResponse.tableName ||
      formResponse.tableName === ""
    ) {
      return false;
    }

    try {
      const fileFormat = TextFormatsList.find(
        (format) =>
          format.mimeType === formResponse.file?.type ||
          (fileExtension && format.extensions.includes(fileExtension))
      );
      if (!fileFormat || fileFormat === undefined) {
        throw new Error(
          "Unsupported file format. Supported formats are: JSON, CSV, PARQUET"
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
        formResponse.tableName
      );

      await Promise.resolve(
        sqlDataState.db?.run(tableQueryData.createTableQuery)
      );
      tableQueryData.insertQueries.forEach(
        async (query) => await Promise.resolve(sqlDataState.db?.run(query))
      );
    } catch (error) {
      toast.error(`${error}`);
      return false;
    }

    toast.success(`Successfully imported table: ${formResponse.tableName}`);
    setIsImportFormOpen(false);
    return true;
  };

  const onClickRunSQL = (selection: boolean = false): boolean => {
    try {
      let queryToRun: string = sqlDataState.sqlCode;
      if (selection && editorRef.current) {
        const selection = editorRef.current.getSelection();
        if (selection)
          queryToRun =
            editorRef.current.getModel()?.getValueInRange(selection) ??
            queryToRun;
      }
      if (!queryToRun || queryToRun === "")
        throw new Error("SQL Query is empty!");

      const result = sqlDataState.db?.exec(queryToRun);
      if (!result || result.length === 0) {
        return true;
      }

      const resultData: JSONGridTabDataProps[] = result.map(
        (resultItem, index) => {
          const resultRecords = convertSqlResultToRecords(resultItem);
          return {
            displayable: `Result ${index + 1}`,
            value: `${index + 1}`,
            content: resultRecords,
          };
        }
      );

      setSQLDataState((state) => {
        state.resultData = resultData;
      });
    } catch (error) {
      toast.error(`${error}`);
      return false;
    }
    return true;
  };

  const handleClipboardPaste = async () => {
    let isSuccess = false;
    await getClipboardText()
      .then(async (value) => {
        setSQLDataState((state) => {
          state.sqlCode = value;
        });
        isSuccess = true;
      })
      .catch((error) => {
        isSuccess = false;
        console.error(error);
      });

    return isSuccess;
  };

  return (
    <div className="flex flex-col h-full rounded-xl">
      <Header separator />
      <div className="flex justify-between">
        <div>
          <Dialog
            open={isImportFormOpen}
            onOpenChange={(open) => setIsImportFormOpen(open)}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                loaderIcon={null}
                buttonIcon={<Grid2x2Plus />}
                successIcon={null}
                errorIcon={null}
                className="w-fit rounded-full mb-4 ml-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 1 }}
              >
                Import Table
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                <div className="grid grid-cols-5 gap-4">
                  <Label htmlFor="tableName">Table Name</Label>
                  <Input
                    required
                    id="tableName"
                    name="tableName"
                    type="text"
                    className="rounded-full col-span-4"
                    placeholder="Example: users"
                  />
                  <Label htmlFor="fileInput">Open File</Label>
                  <Input
                    required
                    id="fileInput"
                    name="file"
                    type="file"
                    accept=".json,.csv,.parquet"
                    className="file:text-secondary-foreground file:bg-secondary file:border-border file:border file:px-2 file:h-full file:rounded-full rounded-full px-1 cursor-pointer file:cursor-pointer col-span-4"
                  />
                  <Separator className="col-span-5" />
                </div>
                <DialogFooter>
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
                    onClick={onImportTableFormSubmit}
                    whileHover={{ scale: 1.1 }}
                  >
                    Load Table
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Tooltip content="Paste copied data from clipboard" asChild>
            <Button
              variant="outline"
              buttonIcon={<ClipboardPaste />}
              loaderIcon={null}
              successIcon={<ClipboardCheck />}
              successBgColorClass="bg-success-alt"
              errorIcon={<ClipboardX />}
              errorBgColorClass="bg-destructive-alt"
              className="w-fit rounded-full mb-4 ml-2"
              onClick={handleClipboardPaste}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1 }}
            >
              Paste
            </Button>
          </Tooltip>
        </div>
        <div className="mr-2">
          <Tooltip
            content="Run SQL Query"
            asChild
            className=" justify-items-end"
          >
            <Button
              buttonIcon={<Play />}
              successIcon={<Check />}
              successBgColorClass="bg-primary"
              errorIcon={<X />}
              errorBgColorClass="bg-primary"
              className="w-fit rounded-full mb-4 ml-2"
              onClick={() => onClickRunSQL()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1 }}
            >
              Run SQL
            </Button>
          </Tooltip>
          <Tooltip
            content="Run Selected SQL Query"
            asChild
            className="justify-items-end"
          >
            <Button
              buttonIcon={<TextCursorInput />}
              successIcon={<Check />}
              successBgColorClass="bg-primary"
              errorIcon={<X />}
              errorBgColorClass="bg-primary"
              className="w-fit rounded-full mb-4 ml-2"
              onClick={() => onClickRunSQL(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1 }}
            >
              Run Selected
            </Button>
          </Tooltip>
        </div>
      </div>
      <ResizablePanelGroup
        direction="vertical"
        style={{ viewTransitionName: "code-view" }}
      >
        <ResizablePanel
          collapsible
          minSize={25}
          onCollapse={() => setIsSQLPanelCollapsed(true)}
          onExpand={() => setIsSQLPanelCollapsed(false)}
        >
          <CodeEditor
            ref={editorRef}
            className="rounded-t-xl h-full"
            onChange={(value) =>
              setSQLDataState((state) => {
                state.sqlCode = value ?? "";
              })
            }
            title="SQL"
            value={sqlDataState.sqlCode}
            language="sql"
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={15} className="overflow-hidden">
          <JSONGridTabs
            ref={resultViewerRef}
            tabsData={
              sqlDataState.resultData.length
                ? sqlDataState.resultData
                : [
                    {
                      displayable: "Result",
                      value: "1",
                      content: {},
                    },
                  ]
            }
            className={`h-full rounded-b-xl ${
              isSQLPanelCollapsed ? "rounded-t-xl" : ""
            }`}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SQLPlayground;
