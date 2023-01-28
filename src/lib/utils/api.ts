import type { Message } from "../types/chatTypes";
import { addMessage } from "../stores/chatStore";

const API_BASE =
  "https://qklzaxu7sazzq4xxw7qggrye7y0lxyhs.lambda-url.eu-west-1.on.aws/";

export const askQuestion = async (question: string) => {
  const userMessage: Message = {
    text: question,
    type: "text",
    speaker: "user",
  };
  addMessage(userMessage);

  const message: Message = await callServer(question);

  addMessage(message);
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
    body: body,
  });

  return (await response.json()) as Message;
};
