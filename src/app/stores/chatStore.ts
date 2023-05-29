import { get, Writable, writable } from "svelte/store";
import type { Message, TextMessage } from "../types/chatTypes";

export const isChatVisible: Writable<boolean> = writable<boolean>(false);
export const conversationHistory: Writable<Array<Message>> = writable([]);
export const userInput: Writable<string> = writable("");

export const addMessage = (msg: Message) => {
  conversationHistory.set([...get(conversationHistory), msg]);
};

export const expandMessage = (msg: TextMessage) => {
  let history = get(conversationHistory);
  (history[history.length - 1] as TextMessage).text += msg;
  conversationHistory.set(history);
};
