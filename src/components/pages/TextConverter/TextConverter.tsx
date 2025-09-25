import type { TextFormatType } from "@/lib/text-formats";
import TextFormatSelect from "./TextFormatSelect";
import CodeEditor from "@/components/ui/code/code-editor";
import Header from "@/components/pages/page-header";
import { useDispatch, useSelector } from "react-redux";
import type { AppStateType } from "@/store/redux";
import {
  TextConverterActions,
  type TextConverterStateType,
} from "@/store/redux/text-converter-slice";

function TextConverter() {
  const convertDataState = useSelector(
    (state: AppStateType) => state.textConverter
  );
  const dispatch = useDispatch();

  const handleTextConvertion = async (
    toConvert?: string,
    fromFormat?: TextFormatType,
    toFormat?: TextFormatType
  ) => {
    const newConvertDataState: TextConverterStateType = {
      toConvert:
        toConvert !== undefined ? toConvert : convertDataState.toConvert,
      fromFormat: fromFormat ? fromFormat : convertDataState.fromFormat,
      toFormat: toFormat ? toFormat : convertDataState.toFormat,
      converted: convertDataState.converted,
    };

    try {
      if (newConvertDataState.toConvert) {
        const parsedObject = newConvertDataState.fromFormat.parse(
          newConvertDataState.toConvert
        );
        newConvertDataState.converted = await Promise.resolve(
          newConvertDataState.toFormat.unparse(parsedObject)
        );
      }
    } catch (error) {
      newConvertDataState.converted = `${error}`;
      console.error(error);
    }

    dispatch(TextConverterActions.setConvertDataState(newConvertDataState));
  };

  const supportedFormats = ["PlainText", "Base64", "JSON", "YAML", "TOML"];

  return (
    <div className="h-full flex flex-col">
      <Header separator />
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
