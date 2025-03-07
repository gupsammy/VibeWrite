"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createThread, addNoteToThread } from "@/lib/firebase/threadUtils";

interface WriteNoteModalProps {
  threadId?: string;
  onComplete?: () => void;
  onClose: () => void;
}

export const WriteNoteModal = ({
  threadId,
  onComplete,
  onClose,
}: WriteNoteModalProps) => {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSaving(true);
      if (threadId) {
        // Add note to existing thread
        await addNoteToThread(threadId, {
          content: content.trim(),
          type: "text",
        });
      } else {
        // Create new thread with this note
        await createThread({
          content: content.trim(),
          type: "text",
        });
      }
      onComplete?.();
      onClose();
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl p-6 w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Write a Note
              </h3>
              <p className="text-sm text-gray-500">Type your thoughts below</p>
            </div>

            <textarea
              className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSaving}
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSaving ? "cursor-not-allowed" : ""
                }`}
                disabled={!content.trim() || isSaving}
              >
                {isSaving ? "Saving..." : "Save Note"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
