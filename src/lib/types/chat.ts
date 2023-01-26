export type Message = {
  text: string;
  type: "text" | "transcript" | "html";
  speaker: "user" | "backend";
};
