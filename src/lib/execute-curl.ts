import * as curl from "@scrape-do/curl-parser";

export async function executeCurlCommand(curlCommand: string) {
  const parsedCurlCommand = curl.parse(curlCommand);
  return fetch(parsedCurlCommand.url ?? "", {
    method: parsedCurlCommand.method,
    headers: Object.fromEntries(
      parsedCurlCommand.headers.map((item) => [item.key, item.value])
    ),
    body: parsedCurlCommand.body,
  });
}
