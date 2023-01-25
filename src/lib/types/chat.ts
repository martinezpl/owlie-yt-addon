export type Message = {
  text: string;
  type: "text" | "transcript";
  speaker: "user" | "backend";
};
