interface MessageBase {
  speaker: "user" | "backend";
}

export interface HtmlMessage extends MessageBase {
  text: string;
  type: "html";
}

export interface TranscriptNode {
  dataStart: number;
  text: string;
}

export interface TranscriptMessage extends MessageBase {
  transcript: Array<TranscriptNode>;
  type: "transcript";
}

export interface TextMessage extends MessageBase {
  text: string;
  type: "text";
}

export type Message = HtmlMessage | TranscriptMessage | TextMessage;

export type BackendResponse = {
  res: Message;
  error?: { message: string };
};
