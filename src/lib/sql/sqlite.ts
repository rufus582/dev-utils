import initSqlJs, { type Database } from "sql.js";
import type { JSONGridTabDataProps } from "@/components/ui/code/json-grid-tabs";
import { convertSqlResultToRecords } from "@/lib/sql-utils";
import type ISQLDBProps from "./sql.types";

export class SQLite implements ISQLDBProps {
  connection: Database | null = null;

  establishConnection = () => {
    if (!this.connection) {
      initSqlJs({
        locateFile: (file) => `/${file}`,
      })
        .then((SQL) => {
          this.connection = new SQL.Database();
          console.log("SQLite DB was successfully created");
        })
        .catch((e) => console.log(e));
    }
  };

  exec = async (query: string) => {
    const result = this.connection?.exec(query);
    let resultData: JSONGridTabDataProps[] = [];
    if (result && result.length > 0) {
      resultData = result.map((resultItem, index) => {
        const resultRecords = convertSqlResultToRecords(resultItem);
        return {
          displayable: `Result ${index + 1}`,
          value: `${index + 1}`,
          content: resultRecords,
        };
      });
    }
    return resultData;
  };

  run = (query: string) => {
    this.connection?.run(query);
  };

  showTables = () => {
    let tablesList: JSONObject[] = [];
    const result = this.connection?.exec(
      'SELECT name FROM sqlite_master WHERE type = "table"',
    );
    if (result && result.length > 0)
      tablesList = convertSqlResultToRecords(result[0]);
    return tablesList;
  };

  close = () => {
    if (this.connection) {
      this.connection?.close();
      this.connection = null;
      console.log("SQLite DB connection closed");
    }
  };
}
