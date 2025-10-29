import CodeEditor from "@/components/ui/code/code-editor";
import { useEffect, useRef, useState } from "react";
import { TextFormats, TextFormatsList } from "@/lib/text-formats";
import JSONGrid from "@/components/ui/code/json-grid";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Header from "@/components/layout/header/page-header";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { Button } from "@/components/ui/custom-components/animated-button";
import {
  Braces,
  ClipboardCheck,
  ClipboardPaste,
  ClipboardX,
  FolderOpen,
  PanelLeftClose,
  PanelLeftOpen,
  PlayCircle,
} from "lucide-react";
import useOpenFile from "@/hooks/use-open-file";
import { Tooltip } from "@/components/ui/custom-components/tooltip-wrapper";
import { getClipboardText, getCurrentEnvironment } from "@/lib/utils";
import { toast } from "sonner";
import _ from "lodash";
import { useCurl } from "@/hooks/use-curl";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Arrow } from "@radix-ui/react-popover";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { JSONTableViewerActions } from "@/store/redux/json-table-viewer-slice";

const JSONTableViewer = () => {
  const jsonTableViewerState = useAppSelector((state) => state.jsonTableViewer);
  const dispatch = useAppDispatch();

  const [isInputCollapsed, setisInputCollapsed] = useState(false);

  const leftPanelRef = useRef<ImperativePanelHandle>(null);

  const handleJsonDataChanged = async (
    value: string,
    showToast: boolean = false
  ) => {
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

    dispatch(JSONTableViewerActions.setJsonData(parsedJsonData));
    dispatch(JSONTableViewerActions.setJsonStr(value));
    return true;
  };

  const onOpenFiles = async (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const fileExtension = _.toPath(file.name).pop();

      const fileFormat = TextFormatsList.find(
        (format) =>
          format.mimeType === file.type ||
          (fileExtension && format.extensions.includes(fileExtension))
      );
      if (!fileFormat || fileFormat === undefined) {
        return toast.error(
          "Unsupported file format. Supported formats are: JSON, YAML, CSV, PARQUET"
        );
      }

      try {
        const fileContent = await (fileFormat.isBinary
          ? file.arrayBuffer()
          : file.text());
        const parsedData = await fileFormat.parse(fileContent);
        const jsonStr = !fileFormat.isBinary
          ? await TextFormats.JSON.unparse(parsedData)
          : "";

        if (typeof parsedData === "string") {
          throw new Error("Cannot convert string to table");
        }

        leftPanelRef.current?.collapse();

        dispatch(JSONTableViewerActions.setJsonData(parsedData));
        dispatch(JSONTableViewerActions.setJsonStr(jsonStr));
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

  const curlState = useCurl(jsonTableViewerState.curl);
  const curlInputRef = useRef<HTMLTextAreaElement>(null);
  const [isCURLPopOverOpen, setIsCURLPopOverOpen] = useState(false);

  useEffect(() => {
    if (curlState.error) {
      toast.error(
        <p>
          <b>Unable to fetch JSON from CURL!</b>
          <br />
          {`${curlState.error}`}
        </p>
      );
    }
  }, [curlState.error]);

  const handleCurlExecution = async () => {
    let isSuccess = false;
    if (!curlInputRef.current?.value) {
      toast.error("Provided CURL Command is empty");
      return isSuccess;
    }

    const curlStr = curlInputRef.current.value;
    dispatch(JSONTableViewerActions.setCurl(curlStr));

    await curlState
      .execute(curlStr)
      .then(async (curlResponse) => {
        try {
          if (
            !curlResponse.isSuccess &&
            curlResponse.statusCode &&
            curlResponse.statusText
          ) {
            toast.error(
              `${curlResponse.statusCode} :: ${curlResponse.statusText}`
            );
            isSuccess = false;
          } else {
            if (curlResponse.responseJson) {
              const responseStr = await TextFormats.JSON.unparse(
                curlResponse.responseJson
              );
              isSuccess = await handleJsonDataChanged(responseStr, true);
            } else isSuccess = false;
          }
        } catch (error) {
          toast.error(`Unable to parse JSON from CURL: ${error}`);
          isSuccess = false;
        }
      })
      .catch((error) => {
        isSuccess = false;
        console.error(error);
      });
    if (isSuccess) setIsCURLPopOverOpen(false);
    return isSuccess;
  };

  const currentEnv = getCurrentEnvironment();

  return (
    <div className="flex flex-col h-full rounded-xl">
      <Header separator />
      <FileInputComponent />
      <div>
        <Tooltip content="Supported files: JSON, YAML, CSV, PARQUET" asChild>
          <Button
            loaderIcon={null}
            buttonIcon={<FolderOpen />}
            successIcon={null}
            className="w-fit rounded-full mb-4 ml-2"
            onClick={() => openFileDialog() || true}
            useDefaultInteractionAnimation
          >
            Open File
          </Button>
        </Tooltip>
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
        {currentEnv === "development" && (
          <Popover
            modal
            open={isCURLPopOverOpen}
            onOpenChange={setIsCURLPopOverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                loaderIcon={null}
                buttonIcon={<Braces />}
                successIcon={null}
                errorIcon={null}
                className="w-fit rounded-full mb-4 ml-2"
                useDefaultInteractionAnimation
              >
                Fetch from CURL
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[40vw] rounded-xl" align="start">
              <Arrow className="fill-muted-foreground" />
              <div className="">
                <Textarea
                  ref={curlInputRef}
                  placeholder="CURL Command"
                  className="h-[20vh] resize-none focus-visible:ring-0 focus-visible:border-primary rounded-t-xl rounded-b-none border-primary"
                  defaultValue={curlState.curlCommand}
                />
                <Button
                  buttonIcon={<PlayCircle />}
                  successBgColorClass=""
                  errorBgColorClass=""
                  className="w-full rounded-b-xl rounded-t-none"
                  onClick={handleCurlExecution}
                  size="lg"
                  useDefaultInteractionAnimation={false}
                >
                  Execute
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
        <Button
          variant="outline"
          loaderIcon={null}
          buttonIcon={isInputCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          successIcon={null}
          className="w-fit rounded-full mb-4 ml-2"
          onClick={toggleLeftPanel}
          useDefaultInteractionAnimation
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
            data={
              jsonTableViewerState.jsonData &&
              (Array.isArray(jsonTableViewerState.jsonData) ||
                typeof jsonTableViewerState.jsonData === "object")
                ? jsonTableViewerState.jsonData
                : {}
            }
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
