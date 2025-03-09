import { Timestamp } from "firebase/firestore";

export interface Note {
  id: string;
  threadId: string;
  content: string;
  type: "text" | "audio";
  isPrompt?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
