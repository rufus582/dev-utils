import { DuckDB } from "./duckdb";
import type ISQLDBProps from "./sql.types";
import { SQLite } from "./sqlite";

export const DatabaseLibs = {
  SQLite: SQLite,
  DuckDB: DuckDB,
};

export type DatabaseType = keyof typeof DatabaseLibs;

export const supportedDatabaseTypes = Object.keys(DatabaseLibs).sort();

export type { ISQLDBProps };
