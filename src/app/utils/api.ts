import type { Message } from "../types/chatTypes";
import { addMessage, expandMessage } from "../stores/chatStore";
import { getSocket } from "../stores/socketStore";
import { callAPI } from "../../shared/api";

export const sendToServer = async (userInput: string) => {
  const userMessage: Message = {
    text: userInput,
    type: "text",
    speaker: "user",
  };
  addMessage(userMessage);

  let splitHtml = ["", ""];
  let title = "";

  if (!["/h", "/help"].includes(userMessage.text)) {
    let html = await (await fetch(location.href)).text();
    let match = html.match(/<meta name="title" content="(.*?)">/);
    title = match ? match[1] : "Untitled";
    splitHtml = html.split('"captions":');
    if (splitHtml.length <= 1) {
      addMessage({
        text: "There's no transcription available for this video.",
        type: "text",
        speaker: "backend",
      });
      return;
    }
  }
  const socket = getSocket();
  while (socket.readyState !== socket.OPEN) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  socket.send(
    JSON.stringify({
      url: location.href,
      question: userInput.replace("\n", ""),
      title: title,
      captions: splitHtml[1].split(',"videoDetails')[0].replace("\n", ""),
    })
  );

  if (userInput.startsWith("/f") || userInput.startsWith("/t")) {
    socket.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      msg["speaker"] = "backend";
      addMessage(msg);
    };
  } else {
    addMessage({
      text: "",
      type: "text",
      speaker: "backend",
    });
    socket.onmessage = async (event) => {
      expandMessage(event.data);
    };
  }
};

export const initHelp = async () => {
  const response = await callAPI("/help", null, "GET");

  let msg = (await response.json()) as Message;
  msg.speaker = "backend";
  return msg;
};
