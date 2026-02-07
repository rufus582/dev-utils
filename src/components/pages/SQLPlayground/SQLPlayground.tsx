import CodeEditor, {
  type CodeEditorRefType,
} from "@/components/ui/code/code-editor";
import { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Header from "@/components/layout/header/page-header";
import { Button } from "@/components/ui/custom-components/animated-button";
import {
  Check,
  ClipboardCheck,
  ClipboardPaste,
  ClipboardX,
  Play,
  TextCursorInput,
  X,
} from "lucide-react";
import { Tooltip } from "@/components/ui/custom-components/tooltip-wrapper";
import { getClipboardText } from "@/lib/utils";
import { toast } from "sonner";
import { convertSqlResultToRecords } from "@/lib/sql-utils";
import initSqlJs, { type Database } from "sql.js";
import type {
  JSONGridTabDataProps,
  JSONGridTabsRefType,
} from "@/components/ui/code/json-grid-tabs";
import JSONGridTabs from "@/components/ui/code/json-grid-tabs";
import { ShowTablesPopUp } from "./ShowTablesPopUp";
import { ImportTableForm } from "./ImportTableForm";

interface SQLDataStateType {
  db?: Database;
  sqlCode: string;
  resultData: JSONGridTabDataProps[];
  tables: JSONObject[];
}

const SQLPlayground = () => {
  const [isSQLPanelCollapsed, setIsSQLPanelCollapsed] = useState(false);
  const [sqlDataState, setSQLDataState] = useImmer<SQLDataStateType>({
    sqlCode: "",
    resultData: [],
    tables: [],
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
        sqlDataState.resultData[0]?.value,
      );
  }, [sqlDataState.resultData]);

  const runSQLQueryAndUpdateState = (query: string) => {
    try {
      const result = sqlDataState.db?.exec(query);
      if (result && result.length > 0) {
        const resultData: JSONGridTabDataProps[] = result.map(
          (resultItem, index) => {
            const resultRecords = convertSqlResultToRecords(resultItem);
            return {
              displayable: `Result ${index + 1}`,
              value: `${index + 1}`,
              content: resultRecords,
            };
          },
        );

        setSQLDataState((state) => {
          state.resultData = resultData;
        });
      }

      toast.success("SQL Query ran successfully!");
      return true;
    } catch (error) {
      toast.error(`${error}`);
      return false;
    }
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

      return runSQLQueryAndUpdateState(queryToRun);
    } catch (error) {
      toast.error(`${error}`);
      return false;
    }
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
          <ImportTableForm db={sqlDataState.db} />
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
              useDefaultInteractionAnimation
            >
              Paste
            </Button>
          </Tooltip>
          <ShowTablesPopUp
            tables={sqlDataState.tables}
            setTables={(tables) =>
              setSQLDataState((state) => {
                state.tables = tables;
              })
            }
            db={sqlDataState.db}
            onClickCellItemAction={runSQLQueryAndUpdateState}
          />
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
              useDefaultInteractionAnimation
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
              useDefaultInteractionAnimation
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
