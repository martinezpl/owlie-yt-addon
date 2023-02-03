import type { Message } from "../types/chatTypes";
import { addMessage } from "../stores/chatStore";
import { getId } from "../stores/idStore";

const API_BASE =
  "https://g9163tkhmf.execute-api.eu-west-1.amazonaws.com/production";

export const askQuestion = async (question: string) => {
  const userMessage: Message = {
    text: question,
    type: "text",
    speaker: "user",
  };
  addMessage(userMessage);

  const message: Message = await askServer(question);

  addMessage(message);
};

export const askServer = async (question: string) => {
  const body = JSON.stringify({
    url: location.href,
    question: question.replace("\n", ""),
  });

  const response = await fetch(API_BASE + "/ask", {
    method: "POST",
    mode: "cors",
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit

    headers: {
      "Content-Type": "application/json",
      "x-owlie-code": (await getId())
    },
    body: body,
  });

  let msg = (await response.json()) as Message;
  msg.speaker = 'backend';
  return msg
};
