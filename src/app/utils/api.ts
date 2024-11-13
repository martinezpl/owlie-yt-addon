import type { Message } from "../types/chatTypes";
import {
  addMessage,
  expandMessage,
  changeLastMessageType,
} from "../stores/chatStore";
import { getSocket, maybeInitSocket } from "../stores/socketStore";

export const sendToServer = async (userInput: string) => {
  const userMessage: Message = {
    text: userInput,
    type: "text",
    speaker: "user",
  };
  addMessage(userMessage);
  maybeInitSocket();

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
        type: "error",
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

  if (userInput === "/s" || !userInput.startsWith("/")) {
    addMessage({
      text: "",
      type: "text",
      speaker: "backend",
    });
    socket.onmessage = async (event) => {
      // Response messages to /s or a question are word by word. If a message is a JSON it means there's been an error
      if (event.data.includes('"type":')) {
        changeLastMessageType("error");
        expandMessage(JSON.parse(event.data).text);
        return;
      }
      expandMessage(event.data);
    };
  } else {
    socket.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      msg["speaker"] = "backend";
      addMessage(msg);
    };
  }
};

const examples = [
  "Write me a poem about it.",
  "Disagree with the speaker.",
  "Explain it to me like I'm 5 years old.",
  "Turn it into a funny story.",
  "Mock the speaker.",
];

export const initHelp = () => {
  addMessage({
    type: "text",
    speaker: "backend",
    text: `Commands:
    - /s : summarize the video's content
    - /t : extract transcription; click on a sentence to jump to the moment it's spoken
    - /f : find a word or a phrase, e.g. "/f open source"
    - /h : see this message

    You can optionally add a language code to target a specific language, e.g. "/t es", "/s pl", etc..

    If the transcript for the language is not available I will default to English or the only existing transcript.

    You can also simply ask a question or tell me what to do with the video's content. For example: "${
      examples[Math.floor(Math.random() * 5)]
    }"
    `,
  });
};
