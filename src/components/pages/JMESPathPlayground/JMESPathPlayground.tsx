import CodeEditor from "@/components/ui/code/code-editor";
import { useImmer } from "use-immer";
import jmespath, { type JSONValue } from "@metrichor/jmespath";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Header from "@/components/pages/page-header";
import JMESPathLogo from "@/components/icons/jmespath-logo/logo";
import { TextFormats } from "@/lib/text-formats";

type JMESPathDataStateType = {
  expression: string;
  result: string;
  jsonStr: string;
};

export default function JMESPathPlayground() {
  const [jmesPathDataState, setJMESPathDataState] =
    useImmer<JMESPathDataStateType>({
      expression: "",
      result: "",
      jsonStr: "",
    });

  const handleCodeChanged = async (
    expressionVal?: string,
    jsonStrVal?: string
  ) => {
    const jmesPathExpression =
      expressionVal === undefined
        ? jmesPathDataState.expression
        : expressionVal;
    const jsonStr =
      jsonStrVal === undefined ? jmesPathDataState.jsonStr : jsonStrVal;
    setJMESPathDataState((prevState) => {
      prevState.expression = jmesPathExpression;
      prevState.jsonStr = jsonStr;
    });

    let rawResult = "";

    try {
      const parsedJsonValue = await TextFormats.JSON.parse(jsonStr);
      const result = jmespath.search(
        parsedJsonValue as JSONValue,
        jmesPathExpression
      );
      rawResult = await TextFormats.JSON.unparse(result as object);
    } catch (error: unknown) {
      if (error && typeof error === "object") {
        const err = error as { stderr?: string; message?: string };
        rawResult = `${
          err.stderr ?? err.message ?? "Error processing JMESPath Expression"
        }`;
      } else {
        rawResult = "Error processing JMESPath Expression";
      }
    }

    setJMESPathDataState((prevState) => {
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
      <JMESPathLogo className="m-auto h-5" />
      <p>Playground</p>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col">
      <Header title={titleContent} separator />
      <ResizablePanelGroup
        direction="vertical"
        className="pt-0"
        style={{ viewTransitionName: "code-view" }}
      >
        <ResizablePanel minSize={10} maxSize={30} defaultSize={15}>
          <CodeEditor
            className="rounded-t-xl rounded-b-none h-full w-full"
            value={jmesPathDataState.expression}
            onChange={(expression) => handleCodeChanged(expression)}
            title="JMESPath Expression"
            copyButton
            lineNumbers={false}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel minSize={30}>
              <CodeEditor
                className="rounded-t-none rounded-bl-xl rounded-br-none h-full"
                value={jmesPathDataState.jsonStr}
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
            <ResizablePanel minSize={20}>
              <CodeEditor
                className="rounded-br-xl rounded-bl-none rounded-t-none h-full"
                value={jmesPathDataState.result}
                title="Output"
                language="json"
                readOnly
                copyButton
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
