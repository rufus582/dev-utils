import { useImperativeHandle, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import JSONGrid from "./json-grid";

export interface JSONGridTabDataProps {
  displayable: string;
  value: string;
  content: JSONObject;
}

interface JSONGridTabsRefProps {
  setSelectedTabValue: (tabValue: string) => void;
}

export type JSONGridTabsRefType = React.RefObject<JSONGridTabsRefProps | null>;

export interface JSONGridTabsPropsType {
  ref?: JSONGridTabsRefType;
  className?: string;
  tabsData: JSONGridTabDataProps[];
  highlightSelected?: boolean;
}

const JSONGridTabs = ({
  className,
  tabsData,
  ref,
  ...props
}: JSONGridTabsPropsType) => {
  const [tabValue, setTabValue] = useState<string>(
    `${tabsData[0]?.value}` || ""
  );

  useImperativeHandle(
    ref,
    () => ({
      setSelectedTabValue: setTabValue,
    }),
    []
  );

  return (
    <Tabs
      className={`gap-0 overflow-hidden flex flex-col border border-border bg-[#ffffff] dark:bg-[#1e1e1e] ${className} `}
      value={tabValue}
      onValueChange={setTabValue}
    >
      <div className="p-2 gap-4 flex bg-muted text-muted-foreground">
        <TabsList className="pl-0">
          {tabsData.map((tabData) => (
            <TabsTrigger key={tabData.value} value={tabData.value}>
              {tabData.displayable}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {tabsData.map((tabData) => (
        <TabsContent key={tabData.value} value={tabData.value}>
          <JSONGrid
            data={tabData.content}
            className="mt-0 border-0 pt-0"
            {...props}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default JSONGridTabs;
