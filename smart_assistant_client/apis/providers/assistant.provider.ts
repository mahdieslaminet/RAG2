import { urls } from "@/utils/urls";
import { SERVER_URL } from "../client";

type promptFuncType = (_: IPromptReqDto) => Promise<void>;
export const prompt: promptFuncType = async ({ handler, ...body }) => {
  const response = await fetch(SERVER_URL + urls.assistant.prompt, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (response.status !== 200) {
    throw new Error("Something went wrong.");
  }
  if (!response.body) {
    throw new Error("ReadableStream is not supported in this browser.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;

    handler(value ? decoder.decode(value, { stream: true }) : "", done);
  }
};

type voicePromptFuncType = (_: IVoicePromptReqDto) => Promise<void>;
export const voicePrompt: voicePromptFuncType = async ({ handler, data }) => {
  const response = await fetch(SERVER_URL + urls.assistant.voicePrompt, {
    method: "POST",
    body: data,
  });
  if (response.status !== 200) {
    throw new Error("Something went wrong.");
  }
  if (!response.body) {
    throw new Error("ReadableStream is not supported in this browser.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;

    handler(value ? decoder.decode(value, { stream: true }) : "", done);
  }
};
