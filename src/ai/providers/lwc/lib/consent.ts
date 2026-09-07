const APP_NAME = "Dev-Utils";

export function getChatGPTConsentBullets(appName: string = APP_NAME): string[] {
  return [
    `${appName} can make AI requests using your ChatGPT plan until you disconnect.`,
    `Heavy or runaway usage can consume your plan's usage limits.`,
    `Prompts and files pass through ${appName}'s server before reaching OpenAI.`,
    `${appName} does not receive your ChatGPT password.`,
    `The connection can be disconnected from Settings and the stored session is deleted.`,
  ];
}

export { APP_NAME as CHATGPT_APP_NAME };
