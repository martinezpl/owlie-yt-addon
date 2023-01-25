import { Writable, writable } from "svelte/store";
import type { Message } from "../types/chat";

export const isChatVisible: Writable<boolean> = writable<boolean>(false);
export const conversationHistory: Writable<Array<Message>> = writable([
  { text: "alex", type: "text", speaker: "user" },
  { text: "marcin", type: "text", speaker: "backend" },
]);
