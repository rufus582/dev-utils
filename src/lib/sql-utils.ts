import type { QueryExecResult, SqlValue } from "sql.js";
import { TextFormats } from "./text-formats";

export function generateTableQueryFromJsonArray(
  jsonArray: JSONObject[],
  tableName: string
) {
  if (jsonArray.length == 0) {
    throw new Error(
      `Cannot create table ${tableName} as provided data is empty`
    );
  }

  const jsonEntries = Object.entries(jsonArray[0]);
  const sqlTableSchema = jsonEntries.map(([key, value]) => {
    let sqlTypeOfVal = "";
    switch (typeof value) {
      case "string":
        sqlTypeOfVal = "TEXT";
        break;
      case "boolean":
        sqlTypeOfVal = "BOOLEAN";
        break;
      case "number":
        sqlTypeOfVal = "REAL";
        break;
      default:
        sqlTypeOfVal = "STRINGIFY";
        break;
    }

    return { key, type: sqlTypeOfVal };
  });

  const tableColumnsStr = sqlTableSchema
    .map(
      (column) =>
        `"${column.key}" ${column.type === "STRINGIFY" ? "TEXT" : column.type}`
    )
    .join(",");

  const sqlCreateTableQuery = `CREATE TABLE '${tableName}' (${tableColumnsStr});`;
  const insertQueries = jsonArray.map((jsonObj) => {
    const columns: string[] = [];
    const values: string[] = [];
    Object.entries(jsonObj).map(([key, value]) => {
      columns.push(key);
      const columnSchema = sqlTableSchema.find((column) => column.key === key);
      if (!columnSchema) {
        return;
      }

      if (columnSchema.type === "STRINGIFY") {
        values.push(JSON.stringify(value));
      } else {
        values.push(value);
      }
    });

    return `INSERT INTO "${tableName}" ("${columns.join(
      '", "'
    )}") VALUES ('${values.join("', '")}')`;
  });

  return {
    createTableQuery: sqlCreateTableQuery,
    insertQueries,
  };
}

export function convertSqlResultToRecords(result: QueryExecResult): JSONObject {
  const columns = Object.fromEntries(result.columns.entries());
  const records = result.values.map((row) => {
    let rowObject: JSONObject = {};
    row.forEach((rowValue, index) => {
      let parsedRowValue: SqlValue | object = rowValue;
      try {
        if (typeof parsedRowValue === "string")
          parsedRowValue = TextFormats.JSON.parse(parsedRowValue);
      } catch {
        /* empty */
      }

      rowObject = {
        ...rowObject,
        [columns[index]]: parsedRowValue,
      };
    });
    return rowObject;
  });

  return records;
}
