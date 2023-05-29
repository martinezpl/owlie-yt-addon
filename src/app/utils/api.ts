import type { Message } from "../types/chatTypes";
import { addMessage, expandMessage } from "../stores/chatStore";
import { getSocket, closeSocket } from "../stores/socketStore";
import { getFromStorage } from "../../shared/storage";
import { callAPI } from "../../shared/api";

export const askQuestion = async (question: string) => {
  const userMessage: Message = {
    text: question,
    type: "text",
    speaker: "user",
  };
  addMessage(userMessage);

  let html = await (await fetch(location.href)).text();
  let match = html.match(/<meta name="title" content="(.*?)">/);
  let title = match ? match[1] : "Untitled";
  const splitHtml = html.split('"captions":');
  if (splitHtml.length <= 1) {
    addMessage({
      text: "There's no transcription available for this video.",
      type: "text",
      speaker: "backend",
    });
    return;
  }
  getSocket().send(
    JSON.stringify({
      url: location.href,
      question: question.replace("\n", ""),
      title: title,
      captions: splitHtml[1].split(',"videoDetails')[0].replace("\n", ""),
    })
  );

  addMessage({
    text: "",
    type: "text",
    speaker: "backend",
  });
  getSocket().onmessage = async (event) => {
    console.log(JSON.stringify(event));
    if (event.data == "OWLIEWSclose") {
      closeSocket();
      return;
    }
    expandMessage(event.data);
  };
};

export const askServer = async (question: string) => {
  const body = JSON.stringify({
    url: location.href,
    question: question.replace("\n", ""),
  });

  const response = await callAPI(
    "/ask",
    await getFromStorage("owlie-id"),
    body
  );

  let msg = (await response.json()) as Message;
  msg.speaker = "backend";
  return msg;
};
