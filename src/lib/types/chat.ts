interface MessageBase {
  speaker: "user" | "backend";
}

interface HtmlMessage extends MessageBase {
  text: string;
  type: "html";
}

interface TranscriptNode {
  dataStart: number;
  text: string;
}

interface TranscriptMessage extends MessageBase {
  transcript: Array<TranscriptNode>;
  type: "transcript";
}

interface TextMessage extends MessageBase {
  text: string;
  type: "text";
}

export type Message = HtmlMessage | TranscriptMessage | TextMessage;

export type BackendResponse = {
  res: Message;
  error?: { message: string };
};