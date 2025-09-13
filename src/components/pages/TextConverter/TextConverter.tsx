import { useImmer } from "use-immer";
import { TextFormats } from "@/lib/text-formats";
import type { TextFormatType } from "@/lib/text-formats";
import TextFormatSelect from "./TextFormatSelect";
import CodeEditor from "@/components/ui/code/code-editor";
import Header from "@/components/pages/page-header";

interface TextConverterStateType {
  fromFormat: TextFormatType;
  toConvert: string;
  toFormat: TextFormatType;
  converted: string;
}

function TextConverter() {
  const [convertDataState, setConvertDataState] =
    useImmer<TextConverterStateType>({
      fromFormat: TextFormats.Base64,
      toConvert: "",
      toFormat: TextFormats.JSON,
      converted: "",
    });

  const handleTextConvertion = (
    toConvert?: string,
    fromFormat?: TextFormatType,
    toFormat?: TextFormatType
  ) => {
    setConvertDataState((prevState) => {
      prevState.toConvert =
        toConvert !== undefined ? toConvert : prevState.toConvert;
      prevState.fromFormat = fromFormat ? fromFormat : prevState.fromFormat;
      prevState.toFormat = toFormat ? toFormat : prevState.toFormat;

      try {
        if (prevState.toConvert) {
          const parsedObject = prevState.fromFormat.parse(prevState.toConvert);
          prevState.converted = prevState.toFormat.unparse(parsedObject);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  const supportedFormats = ["PlainText", "Base64", "JSON", "YAML", "TOML"];

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex justify-between my-auto px-2 pt-0 py-4">
        <TextFormatSelect
          label="Convert From"
          value={convertDataState.fromFormat.displayable}
          supportedFormats={supportedFormats}
          onTextFormatChange={(format) =>
            handleTextConvertion(undefined, format)
          }
        />
        <TextFormatSelect
          label="Convert To"
          value={convertDataState.toFormat.displayable}
          supportedFormats={supportedFormats}
          onTextFormatChange={(format) =>
            handleTextConvertion(undefined, undefined, format)
          }
        />
      </div>
      <div
        className="grid grid-cols-2 gap-2 h-[93%]"
        style={{ viewTransitionName: "code-view" }}
      >
        <CodeEditor
          className="rounded-l-2xl resize-none rounded-r-md"
          onChange={(value) => handleTextConvertion(value)}
          title="Text to convert"
          value={convertDataState.toConvert}
          language={convertDataState.fromFormat.highlightName}
        />
        <CodeEditor
          className="rounded-r-2xl rounded-l-md"
          title="Converted text"
          value={convertDataState.converted}
          language={convertDataState.toFormat.highlightName}
          readOnly
          copyButton
        />
      </div>
    </div>
  );
}

export default TextConverter;
