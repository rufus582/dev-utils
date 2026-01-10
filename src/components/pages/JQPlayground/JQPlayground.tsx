import CodeEditor from "@/components/ui/code/code-editor";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Header from "@/components/layout/header/page-header";
import JQLogo from "@/components/icons/jq-logo";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { JQActions } from "@/store/redux/jq-slice";
import { useJQ } from "@/hooks/use-jq";

export default function JQPlayground() {
  const jqDataState = useAppSelector((state) => state.jq);
  const dispatch = useAppDispatch();

  const { setFilter, setJSONStr } = useJQ({
    logJqVersion: true,
    invokeOnChange: true,
    onChange: (state) => {
      dispatch(JQActions.setFilter(state.filter));
      dispatch(JQActions.setJsonStr(state.jsonStr));
      dispatch(JQActions.setResult(state.result));
    },
    initial: jqDataState,
  });

  const onOpenJSONFile = (files: FileList | null) => {
    if (files && files.length > 0) {
      files[0].text().then(setJSONStr);
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
          onChange={setFilter}
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
              onChange={setJSONStr}
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
