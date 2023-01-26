import { get, Writable, writable } from "svelte/store";
import type { Message } from "../types/chatTypes";

export const isChatVisible: Writable<boolean> = writable<boolean>(false);
export const conversationHistory: Writable<Array<Message>> = writable([]);
export const userInput: Writable<string> = writable("");

export const addMessage = (msg: Message) => {
  conversationHistory.set([...get(conversationHistory), msg]);
};
