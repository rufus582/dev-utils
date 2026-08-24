export interface JQ {
  invoke(input: string, filter: string, options?: string[]): Promise<string>;
}

export default function newJQ(module?: unknown): Promise<JQ>;
