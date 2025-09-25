import { executeCurlCommand } from "@/lib/execute-curl";
import { useState } from "react";

interface CurlStateType {
  curlCommand: string;
  error?: unknown;
}

interface CurlResponseType {
  responseJson: unknown;
  isSuccess: boolean;
  statusCode: number;
  statusText: string;
}

export function useCurl(initialCurl = "") {
  const [isFetching, setIsFetching] = useState(false);

  const [curlState, setCurlState] = useState<CurlStateType>({
    curlCommand: initialCurl,
  });

  const execute = async (curlCommand?: string): Promise<CurlResponseType> => {
    setIsFetching(true);
    const newCurlState: CurlStateType = {
      curlCommand: curlCommand ? curlCommand : curlState.curlCommand,
      error: null,
    };

    const curlResponse: CurlResponseType = {
      isSuccess: false,
      statusCode: 0,
      statusText: "",
      responseJson: null,
    };

    try {
      const response = await executeCurlCommand(newCurlState.curlCommand);
      curlResponse.isSuccess = response.ok;
      curlResponse.statusCode = response.status;
      curlResponse.statusText = response.statusText;
      curlResponse.responseJson = await response.json();
    } catch (error) {
      newCurlState.error = error;
    } finally {
      setCurlState(newCurlState);
      setIsFetching(false);
    }

    return curlResponse;
  };

  return {
    execute,
    curlCommand: curlState.curlCommand,
    isFetching,
    error: curlState.error,
  };
}
