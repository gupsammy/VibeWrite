import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Thread, Note } from "../types/thread";
import { getAuth } from "firebase/auth";

// Collection references
const threadsCollection = collection(db, "threads");
const notesCollection = collection(db, "notes");

// Create a new thread
export const createThread = async (
  initialNote: Omit<Note, "id" | "threadId" | "createdAt" | "updatedAt">
) => {
  const threadData: Omit<Thread, "id"> = {
    title: "New Thread",
    description: "Processing...",
    tags: [],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    noteCount: 1,
  };

  const threadRef = await addDoc(threadsCollection, threadData);

  const noteData: Omit<Note, "id"> = {
    ...initialNote,
    threadId: threadRef.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await addDoc(notesCollection, noteData);
  return threadRef.id;
};

// Add a note to an existing thread
export const addNoteToThread = async (
  threadId: string,
  noteData: Omit<Note, "id" | "threadId" | "createdAt" | "updatedAt">
) => {
  const threadRef = doc(threadsCollection, threadId);
  const threadDoc = await getDoc(threadRef);

  if (!threadDoc.exists()) {
    throw new Error("Thread not found");
  }

  const newNote: Omit<Note, "id"> = {
    ...noteData,
    threadId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const noteRef = await addDoc(notesCollection, newNote);

  await updateDoc(threadRef, {
    noteCount: (threadDoc.data() as Thread).noteCount + 1,
    updatedAt: Timestamp.now(),
  });

  return noteRef.id;
};

// Subscribe to threads with real-time updates
export const subscribeToThreads = async (
  callback: (threads: Thread[]) => void
) => {
  console.log("[ThreadUtils] Starting subscription setup");

  // Check auth state
  const auth = getAuth();
  console.log("[ThreadUtils] Current auth state:", {
    isAuthenticated: !!auth.currentUser,
    userId: auth.currentUser?.uid,
    emailVerified: auth.currentUser?.emailVerified,
  });

  try {
    const threadsRef = collection(db, "threads");
    console.log("[ThreadUtils] Collection reference created");

    // Create a query with orderBy
    const q = query(threadsRef, orderBy("updatedAt", "desc"));
    console.log("[ThreadUtils] Query created with orderBy");

    return onSnapshot(
      q,
      (snapshot) => {
        console.log("[ThreadUtils] Snapshot received:", {
          empty: snapshot.empty,
          size: snapshot.size,
          metadata: snapshot.metadata,
        });

        const threads = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Thread[];

        callback(threads);
      },
      (error) => {
        console.error("[ThreadUtils] Snapshot error:", {
          code: error.code,
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
      }
    );
  } catch (error) {
    console.error("[ThreadUtils] Subscription setup error:", error);
    throw error;
  }
};

// Subscribe to notes in a thread with real-time updates
export const subscribeToThreadNotes = (
  threadId: string,
  callback: (notes: Note[]) => void
) => {
  const q = query(notesCollection, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Note[];

    const threadNotes = notes.filter((note) => note.threadId === threadId);
    callback(threadNotes);
  });
};
