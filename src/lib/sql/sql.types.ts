import type { JSONGridTabDataProps } from "@/components/ui/code/json-grid-tabs";

export default interface ISQLDBProps {
  connection: unknown;
  establishConnection: () => Promise<void> | void;
  exec: (query: string) => Promise<JSONGridTabDataProps[]>;
  run: (query: string) => Promise<void> | void;
  showTables: () => Promise<JSONObject[]> | JSONObject[];
  close: () => Promise<void> | void;
}
