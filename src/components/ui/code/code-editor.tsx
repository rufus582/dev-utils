import Editor, { type OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Button } from "@/components/ui/custom-components/animated-button";
import {
  Clipboard,
  ClipboardCheck,
  ClipboardX,
  FolderOpen,
} from "lucide-react";
import { useTheme } from "@/store/theme-provider";
import { copyToClipboard } from "@/lib/utils";
import useOpenFile, { type IUseOpenFileInputType } from "@/hooks/use-open-file";
import { Tooltip } from "../custom-components/tooltip-wrapper";
import type React from "react";

export type CodeEditorRefType = React.RefObject<editor.IStandaloneCodeEditor | null>

interface ICodeEditorProps {
  title?: string;
  className?: string;
  copyButton?: boolean;
  onChange?: (value?: string) => void;
  defaultValue?: string;
  defaultLanguage?: string;
  value?: string;
  language?: string;
  readOnly?: boolean;
  lineNumbers?: boolean;
  border?: boolean;
  fileButton?: ICodeEditorFileButtonOptions;
  ref?: CodeEditorRefType;
}

interface ICodeEditorFileButtonOptions extends IUseOpenFileInputType {
  enabled: boolean;
  tooltipContent?: string;
}

const CodeEditor = ({
  title,
  readOnly,
  copyButton,
  className,
  lineNumbers = true,
  border = true,
  fileButton,
  ref,
  ...editorProps
}: ICodeEditorProps) => {
  const { theme } = useTheme();
  const { FileInputComponent, openFileDialog } = useOpenFile(
    fileButton ?? {
      onOpenFiles: () => undefined,
    }
  );

  const handleCopyToClipboard = async () => {
    const error = await copyToClipboard(editorProps.value ?? "");
    if (error) {
      console.error(error);
      return false;
    }
    return true;
  };

  const handleEditorDidMount: OnMount = (editor) => {
    if (ref) ref.current = editor;
  };

  return (
    <div
      className={`${className ?? ""} ${
        border ? "border border-border" : ""
      } flex flex-col overflow-hidden`}
    >
      <FileInputComponent />
      <div className="p-2 px-4 gap-4 flex bg-muted text-muted-foreground">
        {title && <span className="my-auto">{title}</span>}
        <div className="ml-auto flex gap-2">
          {fileButton?.enabled && (
            <Tooltip
              content={fileButton.tooltipContent ?? ""}
              className={fileButton.tooltipContent ? "" : "hidden"}
              asChild
            >
              <Button
                className="rounded-full hover:bg-secondary bg-secondary text-secondary-foreground border-border border-2"
                size="sm"
                buttonIcon={<FolderOpen />}
                errorIcon={null}
                successIcon={null}
                loaderIcon={null}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => openFileDialog() || true}
              >
                Open File
              </Button>
            </Tooltip>
          )}
          <Button
            className={
              "rounded-full hover:bg-secondary bg-secondary text-secondary-foreground border-border border-2" +
              " " +
              (fileButton?.enabled && !copyButton
                ? "hidden"
                : !copyButton
                ? "invisible"
                : "")
            }
            size="sm"
            buttonIcon={<Clipboard />}
            loaderIcon={null}
            successIcon={<ClipboardCheck />}
            successBgColorClass="bg-success-alt"
            errorIcon={<ClipboardX />}
            errorBgColorClass="bg-destructive-alt"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopyToClipboard}
          >
            Copy
          </Button>
        </div>
      </div>
      <div className="flex-1 relative">
        <Editor
          {...editorProps}
          options={{
            readOnly,
            minimap: { enabled: false },
            wordWrap: "on",
            lineNumbers: lineNumbers ? "on" : "off",
            unusualLineTerminators: "auto",
          }}
          theme={theme === "dark" ? "vs-dark" : "light"}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
