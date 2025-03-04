import { Timestamp } from "firebase/firestore";

export interface Thread {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  noteCount: number;
}

export interface Note {
  id: string;
  threadId: string;
  content: string;
  type: "audio" | "text";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ThreadWithNotes extends Thread {
  notes: Note[];
}
