import * as duckdb from "@duckdb/duckdb-wasm";
import eh_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";
import mvp_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import type ISQLDBProps from "./sql.types";

const logger = {
  log: () => {},
};

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker: mvp_worker,
  },
  eh: {
    mainModule: duckdb_wasm_eh,
    mainWorker: eh_worker,
  },
};

export class DuckDB implements ISQLDBProps {
  connection: duckdb.AsyncDuckDBConnection | null = null;

  establishConnection = async () => {
    // Select a bundle based on browser checks
    const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
    // Instantiate the asynchronous version of DuckDB-wasm
    const worker = new Worker(bundle.mainWorker!);
    const db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

    this.connection = await db.connect();
    console.log("DuckDB connection established");
  };

  exec = async (query: string) => {
    const resultTable = await this.connection?.query(query);
    const result = resultTable
      ?.toArray()
      .map((row) => row.toJSON()) as JSONObject;

    if (result && result.length > 0)
      return [
        {
          displayable: "Result 0",
          value: "1",
          content: result,
        },
      ];

    return [];
  };

  run = async (query: string) => {
    await this.connection?.query(query);
  };

  showTables = async () => {
    const result = await this.connection?.query("SHOW TABLES;");
    return result?.toArray().map((row) => row.toJSON()) as JSONObject[];
  };

  close = async () => {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
      console.log("DuckDB connection closed");
    }
  };
}
