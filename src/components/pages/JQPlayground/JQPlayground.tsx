import CodeEditor from "@/components/ui/code/code-editor";
import { useImmer } from "use-immer";
import JQ from "jq-web";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Header from "@/components/pages/page-header";
import JQLogo from "@/components/icons/jq-logo";

type JQDataStateType = {
  filter: string;
  result: string;
  jsonStr: string;
};

export default function JQPlayground() {
  const [jqDataState, setJqDataState] = useImmer<JQDataStateType>({
    filter: "",
    result: "",
    jsonStr: "",
  });

  const handleCodeChanged = async (
    jqFilterVal?: string,
    jsonStrVal?: string
  ) => {
    const jqFilter =
      jqFilterVal === undefined ? jqDataState.filter : jqFilterVal;
    const jsonStr = jsonStrVal === undefined ? jqDataState.jsonStr : jsonStrVal;
    setJqDataState((prevState) => {
      prevState.filter = jqFilter;
      prevState.jsonStr = jsonStr;
    });

    let rawResult = "";

    try {
      const jq = await JQ;
      rawResult = jq.raw(jsonStr, jqFilter) as string;
    } catch (error: unknown) {
      if (error && typeof error === "object") {
        const err = error as { stderr?: string; message?: string };
        rawResult = `${
          err.stderr ?? err.message ?? "Error processing JQ query"
        }`;
      } else {
        rawResult = "Error processing JQ query";
      }
    }

    setJqDataState((prevState) => {
      prevState.result = rawResult ?? prevState.result;
    });
  };

  const onOpenJSONFile = (files: FileList | null) => {
    if (files && files.length > 0) {
      files[0]
        .text()
        .then((fileContent) => handleCodeChanged(undefined, fileContent));
    }
  };

  const titleContent = (
    <div className="flex gap-2">
      <JQLogo className="m-auto" />
      <p>Playground</p>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col">
      <Header title={titleContent} />
      <div
        className="h-full w-full grid grid-cols-2 gap-2 pt-0"
        style={{ viewTransitionName: "code-view" }}
      >
        <CodeEditor
          className="rounded-l-xl rounded-r-md"
          value={jqDataState.filter}
          onChange={(jqFilter) => handleCodeChanged(jqFilter)}
          title="JQ"
          copyButton
        />
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel minSize={5}>
            <CodeEditor
              className="rounded-tr-xl rounded-tl-md h-full"
              value={jqDataState.jsonStr}
              title="Input JSON"
              language="json"
              onChange={(jsonStr) => handleCodeChanged(undefined, jsonStr)}
              copyButton
              fileButton={{
                enabled: true,
                acceptedExtensions: ".json",
                onOpenFiles: onOpenJSONFile,
                tooltipContent: "Supported files: JSON",
              }}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={5}>
            <CodeEditor
              className="rounded-br-xl rounded-bl-md h-full"
              value={jqDataState.result}
              title="Output"
              language="json"
              readOnly
              copyButton
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
