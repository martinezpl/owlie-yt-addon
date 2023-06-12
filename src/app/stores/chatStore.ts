import { get, Writable, writable } from "svelte/store";
import type { Message, TextMessage } from "../types/chatTypes";

export const isChatVisible: Writable<boolean> = writable<boolean>(false);
export const conversationHistory: Writable<Array<Message>> = writable([]);
export const userInput: Writable<string> = writable("");
export const userInputHistory: Writable<Array<string>> = writable([]);
export const userInputHistoryTraversalIndex: Writable<number> = writable(-1);

export const addMessage = (msg: Message) => {
  conversationHistory.set([...get(conversationHistory), msg]);
  if (msg.speaker === "user" && msg.type === "text") {
    userInputHistory.set([...get(userInputHistory), msg.text]);
    userInputHistoryTraversalIndex.set(-1);
  }
};

export const expandMessage = (msg: string) => {
  let history = get(conversationHistory);
  (history[history.length - 1] as TextMessage).text += msg;
  conversationHistory.set(history);
};

export const traverseInputHistory = (direction: "previous" | "next") => {
  const history = get(userInputHistory);
  const index = get(userInputHistoryTraversalIndex);
  if (direction === "previous") {
    if (index === -1) {
      userInputHistoryTraversalIndex.set(history.length - 1);
    } else if (index > 0) {
      userInputHistoryTraversalIndex.set(index - 1);
    }
  } else if (direction === "next") {
    if (index === -1) {
      return;
    } else if (index < history.length - 1) {
      userInputHistoryTraversalIndex.set(index + 1);
    } else if (index === history.length - 1) {
      userInputHistoryTraversalIndex.set(-1);
    }
  }

  return history[get(userInputHistoryTraversalIndex)];
};
