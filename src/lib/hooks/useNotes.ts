import { useState, useEffect, useCallback } from "react";
import { getDocuments, deleteDocument } from "@/lib/firebase/firebaseUtils";

interface Note {
  id: string;
  text: string;
  timestamp: string;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const notesData = await getDocuments("notes");
      // Sort notes by timestamp, newest first
      const sortedNotes = notesData.sort(
        (a: any, b: any) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setNotes(sortedNotes as Note[]);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to load notes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNote = useCallback(
    async (id: string) => {
      try {
        await deleteDocument("notes", id);
        setNotes(notes.filter((note) => note.id !== id));
        return true;
      } catch (err) {
        console.error("Error deleting note:", err);
        setError("Failed to delete note. Please try again.");
        return false;
      }
    },
    [notes]
  );

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    refreshNotes: fetchNotes,
    deleteNote,
  };
}
