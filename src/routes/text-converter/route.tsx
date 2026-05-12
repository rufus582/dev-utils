import { createFileRoute } from "@tanstack/react-router";
import { Icon } from "#icons/huge-icon";
import { TextIcon } from "#icons/routes";
import Header from "@/components/layout/header/page-header";
import CodeEditor from "#ui/code/code-editor";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getTextFormat } from "@/lib/text-formats";
import {
  TextConverterActions,
  type TextConverterStateType,
} from "@/store/redux/text-converter-slice";
import TextFormatSelect from "./-text-format-select";

export const Route = createFileRoute("/text-converter")({
  component: RouteComponent,
  ssr: false,
  staticData: {
    title: "Text Converter",
    sidebar: {
      label: "Text Converter",
      icon: <Icon icon={TextIcon} />,
      place: "content",
      category: "JSON",
      keywords: ["base64", "json", "yaml", "toml"],
      order: 1,
    },
  },
});

function RouteComponent() {
  const convertDataState = useAppSelector((state) => state.textConverter);
  const dispatch = useAppDispatch();

  const fromFormat = getTextFormat(convertDataState.fromFormatName);
  const toFormat = getTextFormat(convertDataState.toFormatName);

  const handleTextConvertion = async (
    toConvert?: string,
    fromFormatName?: string,
    toFormatNmae?: string,
  ) => {
    const newConvertDataState: TextConverterStateType = {
      toConvert:
        toConvert !== undefined ? toConvert : convertDataState.toConvert,
      fromFormatName: fromFormatName
        ? fromFormatName
        : convertDataState.fromFormatName,
      toFormatName: toFormatNmae ? toFormatNmae : convertDataState.toFormatName,
      converted: convertDataState.converted,
    };

    const newFromFormat = getTextFormat(newConvertDataState.fromFormatName);
    const newToFormat = getTextFormat(newConvertDataState.toFormatName);

    try {
      if (newConvertDataState.toConvert) {
        const parsedObject = await newFromFormat?.parse(
          newConvertDataState.toConvert,
        );
        newConvertDataState.converted =
          (await Promise.resolve(newToFormat?.unparse(parsedObject ?? ""))) ??
          "";
      }
    } catch (error) {
      newConvertDataState.converted = `${error}`;
      console.error(error);
    }

    dispatch(TextConverterActions.setState(newConvertDataState));
  };

  const supportedFormats = ["PlainText", "Base64", "JSON", "YAML", "TOML"];

  return (
    <div className="h-full flex flex-col">
      <Header separator />
      <div className="flex justify-between my-auto px-2 pt-0 py-4">
        <TextFormatSelect
          label="Convert From"
          value={convertDataState.fromFormatName}
          supportedFormats={supportedFormats}
          onValueChange={(value) => handleTextConvertion(undefined, value)}
        />
        <TextFormatSelect
          label="Convert To"
          value={convertDataState.toFormatName}
          supportedFormats={supportedFormats}
          onValueChange={(value) =>
            handleTextConvertion(undefined, undefined, value)
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
          language={fromFormat?.highlightName}
        />
        <CodeEditor
          className="rounded-r-2xl rounded-l-md"
          title="Converted text"
          value={convertDataState.converted}
          language={toFormat?.highlightName}
          readOnly
          copyButton
        />
      </div>
    </div>
  );
}
