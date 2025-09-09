import YAML from "yaml"
import TOML from "smol-toml";

export interface TextFormatType {
  displayable: string,
  highlightName?: string,
  parse: (input: string) => object | string,
  unparse: (input: object | string) => string
}

const getStringFromObject = (input: string | object) => typeof input == "string" ? input : JSON.stringify(input)
const unparseObj = (
  input: string | object,
  unparseFunc: (input: object) => string
) => (typeof input === "string" ? input : unparseFunc(input));

export const TextFormatsList: TextFormatType[] = [
  {
    displayable: 'PlainText',
    highlightName: 'plaintext',
    parse: (input) => input,
    unparse: (input) => getStringFromObject(input)
  },
  {
    displayable: 'Base64',
    highlightName: 'plaintext',
    parse: (input) => atob(input),
    unparse: (input) => btoa(getStringFromObject(input)),
  },
  {
    displayable: 'JSON',
    highlightName: 'json',
    parse: (input) => JSON.parse(input),
    unparse: (input) => unparseObj(input, (input) => JSON.stringify(input, null, 4))
  },
  {
    displayable: 'YAML',
    highlightName: 'yaml',
    parse: (input) => YAML.parse(input),
    unparse: (input) => unparseObj(input, YAML.stringify)
  },
  {
    displayable: 'TOML',
    highlightName: 'toml',
    parse: (input) => TOML.parse(input),
    unparse: (input) => unparseObj(input, TOML.stringify)
  }
] as const;

export const TextFormats = Object.fromEntries(
  TextFormatsList.map(format => [format.displayable, format])
) as {
  [K in typeof TextFormatsList[number]['displayable']]: TextFormatType
};




