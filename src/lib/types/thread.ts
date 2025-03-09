import { Timestamp } from "firebase/firestore";
import { Note } from "./note";

export interface Thread {
  id: string;
  title: string;
  description: string;
  tags: string[];
  leadingQuestions?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  noteCount: number;
}

export interface ThreadWithNotes extends Thread {
  notes: Note[];
}
