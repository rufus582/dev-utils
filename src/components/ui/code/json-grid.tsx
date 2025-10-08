import { useTheme } from "@/store/theme-provider";
import ReactJSONGrid from "@redheadphone/react-json-grid";
import { Button } from "../button";

interface JSONGridPropsType {
  className?: string;
  data: JSONObject;
  title?: string;
  highlightSelected?: boolean;
}

const JSONGrid = ({ className, title, ...props }: JSONGridPropsType) => {
  const { theme } = useTheme();

  const darkModeTheme = {
    bgColor: "#1e1e1e",
    borderColor: "#3c3c3c",
    selectHighlightBgColor: "#264f7870",
    cellBorderColor: "#333333",
    keyColor: "#9cdcfe",
    indexColor: "#cccccc",
    numberColor: "#b5cea8",
    booleanColor: "#569cd6",
    stringColor: "#ce9178",
    objectColor: "#dcdcdc",
    tableHeaderBgColor: "#252526",
    tableIconColor: "#ffffff00",
    searchHighlightBgColor: "#613214",
  };

  const lightModeTheme = {
    bgColor: "#ffffff",
    borderColor: "#e1e1e1",
    selectHighlightBgColor: "#add6ff70",
    cellBorderColor: "#dcdcdc",
    keyColor: "#001080",
    indexColor: "#333333",
    numberColor: "#098658",
    booleanColor: "#0000ff",
    stringColor: "#a31515",
    objectColor: "#000000",
    tableHeaderBgColor: "#f3f3f3",
    tableIconColor: "#33333300",
    searchHighlightBgColor: "#fffbdd",
  };

  return (
    <div
      className={`overflow-hidden flex flex-col border border-border bg-[#ffffff] dark:bg-[#1e1e1e] ${className}`}
    >
      {title && (
        <div className="p-2 px-4 gap-4 flex bg-muted text-muted-foreground">
          <span className="my-auto">{title}</span>
          <Button className="invisible" size="sm" />
        </div>
      )}
      <div className="overflow-scroll">
        <ReactJSONGrid
          customTheme={theme === "dark" ? darkModeTheme : lightModeTheme}
          {...props}
        />
      </div>
    </div>
  );
};

export default JSONGrid;
