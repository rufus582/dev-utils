import * as jq from "@/lib/jq/jq";
import jqWorkerOps from "@/lib/jq/jq.worker.helper";
import JQWorker from "@/lib/jq/jq.worker?worker";
import { useCallback, useEffect, useEffectEvent } from "react";
import { useImmer } from "use-immer";

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
  onChange,
}: UseJQOptionsType) => {
  const [jqDataState, setJQDataState] = useImmer<JQDataStateType>(initial);

  const invoke = useCallback(async () => {
    if (jqWorker) {
      jqWorkerOps.invoke(
        jqWorker,
        jqDataState.jsonStr,
        jqDataState.filter,
        (result) =>
          setJQDataState((prevState) => ({
            ...prevState,
            result: result,
          }))
      );
    } else {
      const result = await jq.invoke(jqDataState.jsonStr, jqDataState.filter);
      setJQDataState((prevState) => ({
        ...prevState,
        result: result,
      }));
    }
  }, [jqDataState.jsonStr, jqDataState.filter, setJQDataState]);

  const onChangeHandler = useEffectEvent(onChange ?? (() => {}));

  useEffect(() => {
    if (logJqVersion)
      if (jqWorker) jqWorkerOps.version(jqWorker, console.log);
      else jq.version().then(console.log);
  }, [logJqVersion]);

  useEffect(() => {
    if (invokeOnChange) {
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

export { useJQ, type JQDataStateType };
