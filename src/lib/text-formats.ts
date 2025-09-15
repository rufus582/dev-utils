import YAML from "yaml";
import TOML from "smol-toml";
import CSV from "papaparse";
import { parquetReadObjects } from "hyparquet";

export interface TextFormatType {
  displayable: string;
  highlightName?: string;
  mimeType: string;
  extensions: string[];
  isBinary?: boolean;
  parse: (
    input: string | ArrayBuffer
  ) => object | string | Promise<object | string>;
  unparse: (input: object | string) => string | Promise<string>;
}

const getStringFromObject = (input: string | object) =>
  typeof input == "string" ? input : JSON.stringify(input, null, 4);

const unparseObj = (
  input: string | object,
  unparseFunc: (input: object) => string
) => (typeof input === "string" ? input : unparseFunc(input));

function parseStrBuffer(input: string | ArrayBuffer): string;
function parseStrBuffer(
  input: string | ArrayBuffer,
  parseFunc?: (input: string) => object | string | Promise<object | string>
): object | string | Promise<object | string>;
function parseStrBuffer(
  input: string | ArrayBuffer,
  parseFunc?: (input: string) => object | string | Promise<object | string>
) {
  if (input instanceof ArrayBuffer) {
    const decoder = new TextDecoder();
    const inputStr = decoder.decode(input);
    return parseFunc ? parseFunc(inputStr) : inputStr;
  }
  return parseFunc ? parseFunc(input) : input;
}

export const TextFormatsList: TextFormatType[] = [
  {
    displayable: "PlainText",
    highlightName: "plaintext",
    mimeType: "text",
    extensions: ["txt"],
    parse: (input) => parseStrBuffer(input),
    unparse: (input) => getStringFromObject(input),
  },
  {
    displayable: "Base64",
    highlightName: "plaintext",
    mimeType: "text",
    extensions: [],
    parse: (input) => parseStrBuffer(input, atob),
    unparse: (input) => btoa(getStringFromObject(input)),
  },
  {
    displayable: "JSON",
    highlightName: "json",
    mimeType: "application/json",
    extensions: ["json"],
    parse: (input) => parseStrBuffer(input, JSON.parse),
    unparse: (input) => unparseObj(input, getStringFromObject),
  },
  {
    displayable: "YAML",
    highlightName: "yaml",
    mimeType: "application/yaml",
    extensions: ["yaml", "yml"],
    parse: (input) => parseStrBuffer(input, YAML.parse),
    unparse: (input) => unparseObj(input, YAML.stringify),
  },
  {
    displayable: "TOML",
    highlightName: "toml",
    mimeType: "application/toml",
    extensions: ["toml"],
    parse: (input) => parseStrBuffer(input, TOML.parse),
    unparse: (input) => unparseObj(input, TOML.stringify),
  },
  {
    displayable: "CSV",
    highlightName: "csv",
    mimeType: "text/csv",
    extensions: ["csv"],
    parse: (input) =>
      new Promise((resolve, reject) => {
        const inputStr = parseStrBuffer(input);
        const result = CSV.parse(inputStr, {
          header: true,
        });
        if (result.errors.length > 0) {
          return reject(result.errors.map((error) => error.message));
        }
        if (result.data.length > 0) {
          return resolve(result.data);
        }
        return reject(["There is no CSV data to parse"]);
      }),
    unparse: (input) =>
      unparseObj(input, (input) => {
        if (!Array.isArray(input)) {
          throw new Error("Value must be an array to be stringified to CSV");
        }

        return CSV.unparse(input, {
          header: true,
        });
      }),
  },
  {
    displayable: "PARQUET",
    highlightName: "json",
    mimeType: "application/parquet",
    extensions: ["parquet"],
    isBinary: true,
    parse: (input) => {
      if (typeof input === "string")
        throw new Error("Cannot parse PARQUET data from string");

      return parquetReadObjects({ file: input });
    },
    unparse: () => {
      throw new Error("Cannot create PARQUET data as string");
    },
  },
] as const;

export const TextFormats = Object.fromEntries(
  TextFormatsList.map((format) => [format.displayable, format])
) as {
  [K in (typeof TextFormatsList)[number]["displayable"]]: TextFormatType;
};
