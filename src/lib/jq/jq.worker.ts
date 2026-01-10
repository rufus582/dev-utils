import { invoke, version } from "./jq";

interface JQWorkerEvent {
  type: "invoke" | "version";
  jsonStr: string;
  jqFilter: string;
}

onmessage = async (e: MessageEvent<JQWorkerEvent>) => {
  if (e.data.type === "version") postMessage(await version());
  else postMessage(await invoke(e.data.jsonStr, e.data.jqFilter));
};
