interface MessageBase {
  speaker?: 'user' | 'backend';
}

export type TranscriptNode = {
  dataStart: number;
  text: string;
};

interface TranscriptMessage extends MessageBase {
  transcript: Array<TranscriptNode>;
  type: 'transcript';
}

interface TextMessage extends MessageBase {
  text: string;
  type: 'text';
}

interface ErrorMessage extends MessageBase {
  text: string;
  type: 'error';
}

export type Message = TranscriptMessage | TextMessage | ErrorMessage;

export type BackendResponse = {
  res: Message;
  error?: { message: string };
};
