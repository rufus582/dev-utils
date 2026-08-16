import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type React from "react";
import { useEffect, useRef } from "react";
import { Button } from "#ui/custom-components/animated-button";
import useOpenFile, { type IUseOpenFileInputType } from "@/hooks/use-open-file";
import { cn, copyToClipboard } from "@/lib/utils";
import { useTheme } from "@/store/theme-provider";
import { Icon } from "../../icons/huge-icon";
import {
  CancelCircleIcon,
  CopyCheckIcon,
  CopyIcon,
  FolderOpenIcon,
  LoadingIcon,
} from "../../icons/ui";
import { Tooltip } from "../custom-components/tooltip-wrapper";
import { Skeleton } from "../skeleton";
import { Spinner } from "../spinner";
import "./code-editor-overrides.css";
import { AnimatePresence, motion } from "motion/react";
import { ThinkingOrb } from "thinking-orbs";

export type CodeEditorRefType =
  React.RefObject<editor.IStandaloneCodeEditor | null>;

interface ICodeEditorProps {
  title?: string;
  className?: string;
  copyButton?: boolean;
  headerActions?: React.ReactNode;
  ignoreCommandKeyCombination?: boolean;
  onChange?: (value?: string) => void;
  defaultValue?: string;
  defaultLanguage?: string;
  value?: string;
  language?: string;
  readOnly?: boolean;
  lineNumbers?: boolean;
  border?: boolean;
  fileButton?: ICodeEditorFileButtonOptions;
  showAiProcessingUI?: boolean;
  aiProcessingText?: string;
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
  headerActions,
  ignoreCommandKeyCombination = true,
  className,
  lineNumbers = true,
  border = true,
  fileButton,
  showAiProcessingUI = false,
  aiProcessingText = "Generating...",
  ref,
  ...editorProps
}: ICodeEditorProps) => {
  const { theme } = useTheme();
  const editorInstanceRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { FileInputComponent, openFileDialog } = useOpenFile(
    fileButton ?? {
      onOpenFiles: () => undefined,
    },
  );

  const handleCopyToClipboard = async () => {
    const error = await copyToClipboard(editorProps.value ?? "");
    if (error) {
      console.error(error);
      return false;
    }
    return true;
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorInstanceRef.current = editor;
    if (ref) ref.current = editor;

    if (ignoreCommandKeyCombination)
      monaco.editor.addKeybindingRules([
        {
          keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
          command: null,
        },
      ]);
  };

  useEffect(() => {
    if (!showAiProcessingUI) return;

    const frame = requestAnimationFrame(() => {
      const editorInstance = editorInstanceRef.current;
      const model = editorInstance?.getModel();
      if (!editorInstance || !model) return;

      const lineCount = model.getLineCount();
      const lastColumn = model.getLineMaxColumn(lineCount);
      editorInstance.revealPositionInCenterIfOutsideViewport({
        lineNumber: lineCount,
        column: lastColumn,
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [showAiProcessingUI, editorProps.value]);

  return (
    <div
      className={cn(
        className ?? "",
        border ? "border border-border" : "",
        "flex flex-col overflow-hidden relative",
      )}
    >
      <AnimatePresence>
        {showAiProcessingUI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-0 z-100 w-full h-full flex items-center justify-center bg-background/60 select-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.2, filter: "blur(4px)" }}
              whileTap={{ scale: 0.97 }}
              transition={{
                opacity: { duration: 0.2, ease: "easeOut" },
                scale: { type: "spring", stiffness: 380, damping: 26 },
                filter: { duration: 0.25, ease: "easeOut" },
              }}
              className="flex bg-muted py-2 px-4 pr-12 rounded-full gap-2 drop-shadow-xl"
            >
              <ThinkingOrb state="composing" size={64} className="scale-90" />
              <span className="my-auto shimmer text-muted-foreground">
                {aiProcessingText}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <FileInputComponent />
      <div className="p-2 px-4 gap-4 flex bg-muted text-muted-foreground">
        {title && <span className="my-auto">{title}</span>}
        <div className="ml-auto flex gap-2">
          {headerActions}
          {fileButton?.enabled && (
            <Tooltip
              content={fileButton.tooltipContent ?? ""}
              className={fileButton.tooltipContent ? "" : "hidden"}
              asChild
            >
              <Button
                className="rounded-full hover:bg-secondary bg-secondary text-secondary-foreground border-border border-2"
                size="sm"
                buttonIcon={<Icon icon={FolderOpenIcon} />}
                errorIcon={null}
                successIcon={null}
                loaderIcon={null}
                onClick={() => openFileDialog() || true}
                useDefaultInteractionAnimation
              >
                Open File
              </Button>
            </Tooltip>
          )}
          <Button
            className={cn(
              "rounded-full hover:bg-secondary bg-secondary text-secondary-foreground border-border border-2",
              fileButton?.enabled && !copyButton
                ? "hidden"
                : !copyButton
                  ? "invisible"
                  : "",
            )}
            size="sm"
            buttonIcon={<Icon icon={CopyIcon} />}
            loaderIcon={<Icon icon={LoadingIcon} />}
            successIcon={<Icon icon={CopyCheckIcon} />}
            successBgColorClass="bg-success-alt"
            errorIcon={<Icon icon={CancelCircleIcon} />}
            errorBgColorClass="bg-destructive-alt"
            onClick={handleCopyToClipboard}
            useDefaultInteractionAnimation
          >
            Copy
          </Button>
        </div>
      </div>
      <div className="flex-1 relative" style={{ containerType: "inline-size" }}>
        <Editor
          {...editorProps}
          options={{
            readOnly,
            minimap: { enabled: false },
            wordWrap: "on",
            lineNumbers: lineNumbers ? "on" : "off",
            unusualLineTerminators: "auto",
          }}
          loading={
            <Skeleton className="h-full w-full flex rounded-none">
              <Spinner className="m-auto size-8" />
            </Skeleton>
          }
          theme={theme === "dark" ? "vs-dark" : "light"}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
