export default {
  invoke: (
    workerObj: Worker,
    jsonStr: string,
    jqFilter: string,
    onMessage: (message: string) => void
  ) => {
    workerObj.postMessage({ jsonStr, jqFilter });
    workerObj.onmessage = (e: MessageEvent<string>) => onMessage(e.data);
  },
  version: (workerObj: Worker, onMessage: (message: string) => void) => {
    workerObj.postMessage({ type: "version" });
    workerObj.onmessage = (e: MessageEvent<string>) => onMessage(e.data);
  },
};
