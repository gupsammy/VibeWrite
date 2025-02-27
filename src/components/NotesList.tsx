"use client";

import { useNotes } from "@/lib/hooks/useNotes";
import { motion } from "framer-motion";

export default function NotesList() {
  const { notes, loading, error, deleteNote } = useNotes();

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No voice notes yet. Start recording to create your first note!
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 mt-8">
      <h2 className="text-xl font-semibold mb-4">Your Voice Notes</h2>
      {notes.map((note, index) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white p-4 rounded-lg shadow-md"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">
                {formatDate(note.timestamp)}
              </p>
              <p className="text-gray-800">{note.text}</p>
            </div>
            <button
              onClick={() => deleteNote(note.id)}
              className="text-red-500 hover:text-red-700 ml-2"
              aria-label="Delete note"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
