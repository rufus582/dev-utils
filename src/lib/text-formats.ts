import YAML from "yaml"
import TOML from "smol-toml";

export interface TextFormatType {
  displayable: string,
  highlightName?: string,
  mimeType: string,
  parse: (input: string) => object | string,
  unparse: (input: object | string) => string
}

const getStringFromObject = (input: string | object) => typeof input == "string" ? input : JSON.stringify(input, null, 4)
const unparseObj = (
  input: string | object,
  unparseFunc: (input: object) => string
) => (typeof input === "string" ? input : unparseFunc(input));

export const TextFormatsList: TextFormatType[] = [
  {
    displayable: 'PlainText',
    highlightName: 'plaintext',
    mimeType: 'text',
    parse: (input) => input,
    unparse: (input) => getStringFromObject(input)
  },
  {
    displayable: 'Base64',
    highlightName: 'plaintext',
    mimeType: 'text',
    parse: (input) => atob(input),
    unparse: (input) => btoa(getStringFromObject(input)),
  },
  {
    displayable: 'JSON',
    highlightName: 'json',
    mimeType: 'application/json',
    parse: (input) => JSON.parse(input),
    unparse: (input) => unparseObj(input, getStringFromObject)
  },
  {
    displayable: 'YAML',
    highlightName: 'yaml',
    mimeType: 'application/yaml',
    parse: (input) => YAML.parse(input),
    unparse: (input) => unparseObj(input, YAML.stringify)
  },
  {
    displayable: 'TOML',
    highlightName: 'toml',
    mimeType: 'application/toml',
    parse: (input) => TOML.parse(input),
    unparse: (input) => unparseObj(input, TOML.stringify)
  }
] as const;

export const TextFormats = Object.fromEntries(
  TextFormatsList.map(format => [format.displayable, format])
) as {
  [K in typeof TextFormatsList[number]['displayable']]: TextFormatType
};




