import newJQ from "./jq.wasm.js";

const invoke = async (jsonStr: string, jqFilter: string) => {
  try {
    const jq = await newJQ({
      locateFile: (path: string, prefix: string) => {
        return path.endsWith("jq.wasm") ? "/jq.wasm" : prefix + path;
      },
    });

    return await jq.invoke(jsonStr, jqFilter);
  } catch (error) {
    return error ? `${error}` : "Error processing JQ query";
  }
};

const version = async () => {
  try {
    const jq = await newJQ({
      locateFile: (path: string, prefix: string) => {
        return path.endsWith("jq.wasm") ? "/jq.wasm" : prefix + path;
      },
    });
    const jqVersion = await jq.invoke("", "", [ "--version" ]);
    return `Using JQ Version: '${jqVersion}'`;
  } catch (error) {
    return error ? `${error}` : "Unable to get JQ version";
  }
};

export { invoke, version };
