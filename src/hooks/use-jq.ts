import { useCallback, useEffect, useEffectEvent } from "react";
import { useImmer } from "use-immer";
import * as jq from "@/lib/jq/jq";
import JQWorker from "@/lib/jq/jq.worker?worker";
import jqWorkerOps from "@/lib/jq/jq.worker.helper";

const jqWorker = Worker !== undefined ? new JQWorker() : null;

type JQDataStateType = {
  filter: string;
  result: string;
  jsonStr: string;
};

type UseJQOptionsType = {
  initial?: JQDataStateType;
  logJqVersion?: boolean;
  invokeOnChange?: boolean;
  shouldInvoke?: () => boolean;
  onChange?: (state: JQDataStateType) => void;
};

const initialState: JQDataStateType = {
  filter: "",
  result: "",
  jsonStr: "",
};

const useJQ = ({
  initial = initialState,
  logJqVersion,
  invokeOnChange,
  shouldInvoke,
  onChange,
}: UseJQOptionsType) => {
  const [jqDataState, setJQDataState] = useImmer<JQDataStateType>(initial);

  const invoke = useCallback(
    async (override?: { filter?: string; jsonStr?: string }) => {
      const jsonStr = override?.jsonStr ?? jqDataState.jsonStr;
      const filter = override?.filter ?? jqDataState.filter;

      if (jqWorker) {
        jqWorkerOps.invoke(jqWorker, jsonStr, filter, (result) =>
          setJQDataState((prevState) => ({
            ...prevState,
            result: result,
          })),
        );
      } else {
        const result = await jq.invoke(jsonStr, filter);
        setJQDataState((prevState) => ({
          ...prevState,
          result: result,
        }));
      }
    },
    [jqDataState.jsonStr, jqDataState.filter, setJQDataState],
  );

  const onChangeHandler = useEffectEvent(onChange ?? (() => {}));
  const shouldInvokeHandler = useEffectEvent(shouldInvoke ?? (() => true));

  useEffect(() => {
    if (logJqVersion) jq.version().then(console.log);
  }, [logJqVersion]);

  useEffect(() => {
    if (invokeOnChange && shouldInvokeHandler()) {
      invoke();
    }
  }, [jqDataState.filter, jqDataState.jsonStr, invokeOnChange, invoke]);

  useEffect(() => {
    onChangeHandler(jqDataState);
  }, [jqDataState]);

  return {
    jqDataState,
    setFilter: (filter?: string) => {
      setJQDataState((state) => {
        state.filter = filter ?? "";
      });
    },
    setJSONStr: (jsonStr?: string) => {
      setJQDataState((state) => {
        state.jsonStr = jsonStr ?? "";
      });
    },
    setJQDataState,
    invoke,
  };
};

export { type JQDataStateType, useJQ };
