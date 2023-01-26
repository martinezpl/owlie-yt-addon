import { get } from "svelte/store";
import type { Message } from "../types/chat";
import { addMessage, userInput } from "../stores/chatStore";

const API_BASE =
  "https://qklzaxu7sazzq4xxw7qggrye7y0lxyhs.lambda-url.eu-west-1.on.aws/";

export const askQuestion = async () => {
  const userMessage: Message = {
    text: get(userInput),
    type: "text",
    speaker: "user",
  };
  addMessage(userMessage);

  let backendResponse: Message;
  try {
    const response: string = await callServer();
    backendResponse = {
      text: response,
      type: "text",
      speaker: "backend",
    };
  } catch (error) {
    backendResponse = {
      text: error.message,
      type: "text",
      speaker: "backend",
    };
  }
  addMessage(backendResponse);
};

export const callServer = async () => {
  const body = JSON.stringify({
    url: location.href,
    question: get(userInput).replace("\n", ""),
  });

  const response = await fetch(API_BASE, {
    method: "POST",
    mode: "cors",
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit

    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const json_response = (await response.json()) as {
    text: string;
    error?: { message: string };
  };

  if (response.status >= 200 && response.status <= 299) {
    return json_response.text
      .replace(/&amp;#39;/g, "'")
      .replace(/&amp;quot;/g, '"');
  } else {
    throw new Error(json_response.error.message);
  }
};
