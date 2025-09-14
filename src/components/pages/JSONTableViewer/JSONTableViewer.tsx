import CodeEditor from "@/components/ui/code/code-editor";
import { useCallback, useRef, useState } from "react";
import { TextFormats, TextFormatsList } from "@/lib/text-formats";
import JSONGrid from "@/components/ui/code/json-grid";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Header from "@/components/pages/page-header";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { Button } from "@/components/ui/custom-components/animated-button";
import {
  ClipboardCheck,
  ClipboardPaste,
  ClipboardX,
  FolderOpen,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import useOpenFile from "@/hooks/use-open-file";
import { Tooltip } from "@/components/ui/custom-components/tooltip-wrapper";
import { getClipboardText } from "@/lib/utils";
import { toast } from "sonner";
import { useImmer } from "use-immer";

interface JSONTableViewerStateType {
  jsonData: JSONObject;
  jsonStr: string;
}

const JSONTableViewer = () => {
  const [jsonTableViewerState, setJsonTableViewerState] =
    useImmer<JSONTableViewerStateType>({ jsonData: {}, jsonStr: "" });
  const [isInputCollapsed, setisInputCollapsed] = useState(false);

  const leftPanelRef = useRef<ImperativePanelHandle>(null);

  const handleJsonDataChanged = useCallback(
    async (value: string, showToast: boolean = false) => {
      let parsedJsonData: object | string = {};
      try {
        parsedJsonData = await TextFormats.JSON.parse(value ?? "{}");
        if (typeof parsedJsonData === "string") {
          throw new Error("Cannot convert string to table");
        }
      } catch (error) {
        if (showToast)
          if (error) toast.error(`${error}`);
          else toast.error("Unable to parse JSON input");
        return false;
      }

      setJsonTableViewerState({
        jsonData: parsedJsonData,
        jsonStr: value,
      });
      return true;
    },
    [setJsonTableViewerState]
  );

  const onOpenFiles = async (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];

      const fileFormat = TextFormatsList.find(
        (format) => format.mimeType === file.type
      );
      if (!fileFormat || fileFormat === undefined) {
        return toast.error(
          "Unsupported file format. Supported formats are: JSON, YAML, CSV"
        );
      }

      try {
        const fileContent = await file.text();
        const parsedData = await fileFormat.parse(fileContent);
        const jsonStr = await TextFormats.JSON.unparse(parsedData);

        if (typeof parsedData === "string") {
          throw new Error("Cannot convert string to table");
        }

        setJsonTableViewerState({
          jsonData: parsedData,
          jsonStr,
        });
      } catch (error) {
        toast.error(`${error}`);
      }
    }
  };

  const { FileInputComponent, openFileDialog } = useOpenFile({
    onOpenFiles,
    acceptedExtensions: ".json,.csv,.parquet,.yaml",
  });

  const toggleLeftPanel = () => {
    if (isInputCollapsed) {
      leftPanelRef.current?.expand();
    } else {
      leftPanelRef.current?.collapse();
    }
    return true;
  };

  const handleClipboardPaste = async () => {
    let isSuccess = false;
    await getClipboardText()
      .then(async (value) => {
        isSuccess = await handleJsonDataChanged(value, true);
      })
      .catch((error) => {
        isSuccess = false;
        console.error(error);
      });

    return isSuccess;
  };

  return (
    <div className="flex flex-col h-full rounded-xl">
      <Header />
      <FileInputComponent />
      <div>
        <Tooltip content="Supported files: JSON, YAML, CSV, PARQUET">
          <Button
            loaderIcon={null}
            buttonIcon={<FolderOpen />}
            successIcon={null}
            className="w-fit rounded-full mb-4 ml-2"
            onClick={() => openFileDialog() || true}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1 }}
          >
            Open File
          </Button>
        </Tooltip>
        <Tooltip content="Paste copied data from clipboard">
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
        <Button
          variant="outline"
          loaderIcon={null}
          buttonIcon={isInputCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          successIcon={null}
          className="w-fit rounded-full mb-4 ml-2"
          onClick={toggleLeftPanel}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 1 }}
        >
          {isInputCollapsed ? "Show" : "Hide"} Input
        </Button>
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        style={{ viewTransitionName: "code-view" }}
      >
        <ResizablePanel
          ref={leftPanelRef}
          collapsible
          minSize={25}
          onCollapse={() => setisInputCollapsed(true)}
          onExpand={() => setisInputCollapsed(false)}
        >
          <CodeEditor
            className="rounded-l-xl h-full"
            onChange={(value) => handleJsonDataChanged(value ?? "")}
            title="JSON Input Content"
            value={jsonTableViewerState.jsonStr}
            language={TextFormats.JSON.highlightName}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={15} className="overflow-hidden">
          <JSONGrid
            data={jsonTableViewerState.jsonData ?? {}}
            className={`h-full rounded-r-xl ${
              isInputCollapsed ? "rounded-l-xl" : ""
            }`}
            title="JSON Table"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default JSONTableViewer;
