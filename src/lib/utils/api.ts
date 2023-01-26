import { get } from "svelte/store";
import type { BackendResponse, Message } from "../types/chat";
import { addMessage, userInput } from "../stores/chatStore";

const API_BASE =
  "https://qklzaxu7sazzq4xxw7qggrye7y0lxyhs.lambda-url.eu-west-1.on.aws/";

export const askQuestion = async (question: string) => {
  const userMessage: Message = {
    text: question,
    type: "text",
    speaker: "user",
  };
  addMessage(userMessage);

  let backendResponse: Message;
  try {
    const response: Message = await callServer(question);

    switch (response.type) {
      case "text":
      case "html":
        backendResponse = {
          type: response.type,
          text: response.text,
          speaker: "backend",
        };
        break;
      case "transcript":
        backendResponse = {
          type: response.type,
          transcript: response.transcript,
          speaker: "backend",
        };
        break;
      default:
        console.log("Unexpected response", response);
        break;
    }
    addMessage(backendResponse);
  } catch (error) {
    backendResponse = {
      text: error.message,
      type: "text",
      speaker: "backend",
    };
    addMessage(backendResponse);
    throw new Error(error);
  }
};

export const callServer = async (question: string) => {
  const body = JSON.stringify({
    url: location.href,
    question: question.replace("\n", ""),
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

  const json_response = (await response.json()) as BackendResponse;

  if (response.status >= 200 && response.status <= 299) {
    return json_response.res;
  } else {
    throw new Error(json_response.error.message);
  }
};
