import CodeEditor from "@/components/ui/code/code-editor";
import * as jq from "jq-wasm";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Header from "@/components/layout/header/page-header";
import JQLogo from "@/components/icons/jq-logo";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { JQActions } from "@/store/redux/jq-slice";
import { useEffect } from "react";

export default function JQPlayground() {
  const jqDataState = useAppSelector((state) => state.jq);
  const dispatch = useAppDispatch();

  useEffect(() => {
    jq.version().then((version) =>
      console.log(`Using JQ Version: '${version}'`)
    );
  }, []);

  const handleCodeChanged = async (
    jqFilterVal?: string,
    jsonStrVal?: string
  ) => {
    const jqFilter =
      jqFilterVal === undefined ? jqDataState.filter : jqFilterVal;
    const jsonStr = jsonStrVal === undefined ? jqDataState.jsonStr : jsonStrVal;

    dispatch(JQActions.setFilter(jqFilter));
    dispatch(JQActions.setJsonStr(jsonStr));

    let rawResult = "";

    try {
      const result = await jq.raw(jsonStr, jqFilter);
      rawResult = result.stderr ? result.stderr : result.stdout;
    } catch (error) {
      console.error(error);
      rawResult = "Error processing JQ query";
    }

    dispatch(JQActions.setResult(rawResult ?? ""));
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
      <Header title={titleContent} separator />
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
