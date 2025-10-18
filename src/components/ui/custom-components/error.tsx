import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CircleXIcon } from "lucide-react";
import type React from "react";

// Define error messages for common HTTP error status codes
const defaultHttpErrorMessages = {
  // 4xx Client Errors
  400: "The server cannot process the request due to a client error.",
  401: "Authentication is required and has failed or not been provided.",
  403: "You don't have permission to access this resource.",
  404: "The requested resource could not be found.",
  405: "The request method is not supported for this resource.",
  406: "The server cannot produce a response matching the list of acceptable values.",
  408: "The server timed out waiting for the request.",
  409: "The request could not be completed due to a conflict with the current state of the resource.",
  410: "The requested resource is no longer available and will not be available again.",
  413: "The request entity is larger than limits defined by server.",
  414: "The URI requested by the client is longer than the server is willing to interpret.",
  415: "The media format of the requested data is not supported.",
  429: "You have sent too many requests in a given amount of time.",

  // 5xx Server Errors
  500: "The server has encountered a situation it doesn't know how to handle.",
  501: "The request method is not supported by the server.",
  502: "The server received an invalid response from an upstream server.",
  503: "The server is currently unavailable.",
  504: "The server did not receive a timely response from an upstream server.",
  505: "The HTTP version used in the request is not supported.",
  511: "You need to authenticate to gain network access.",
};

type HTTPErrorStatusType = keyof typeof defaultHttpErrorMessages;

const getHttpErrorMessage = (
  status: HTTPErrorStatusType,
  customHttpMessages?: Partial<typeof defaultHttpErrorMessages>
): string | undefined => {
  let httpStatusMessage = defaultHttpErrorMessages[status];
  if (customHttpMessages)
    httpStatusMessage = customHttpMessages[status] ?? httpStatusMessage;

  return httpStatusMessage;
};

interface IErrorProps {
  httpStatus?: {
    status: number;
    statusText: string;
  };
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  httpErrorMessages?: Partial<typeof defaultHttpErrorMessages>;
}

const Error = ({
  httpStatus,
  title,
  message,
  icon = <CircleXIcon />,
  children,
  className,
  httpErrorMessages,
}: IErrorProps) => {
  let errorMessage = message;
  let errorTitle = title;
  if (httpStatus) {
    errorTitle = `${httpStatus.status} - ${httpStatus.statusText}`;

    const httpStatusMessage = getHttpErrorMessage(
      httpStatus.status as HTTPErrorStatusType,
      httpErrorMessages
    );
    errorMessage = !message && httpStatusMessage ? httpStatusMessage : message;
  }

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        {errorTitle && <EmptyTitle>{errorTitle}</EmptyTitle>}
        {errorMessage && <EmptyDescription>{errorMessage}</EmptyDescription>}
      </EmptyHeader>
      <EmptyContent>{children}</EmptyContent>
    </Empty>
  );
};

export default Error;
