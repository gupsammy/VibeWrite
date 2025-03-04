"use client";

import { useEffect, useState } from "react";
import { Thread, Note } from "@/lib/types/thread";
import { subscribeToThreadNotes } from "@/lib/firebase/threadUtils";
import { FloatingDock } from "@/components/FloatingDock";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { WriteNoteModal } from "@/components/WriteNoteModal";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ThreadPage({ params }: { params: { id: string } }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToThreadNotes(params.id, (updatedNotes) => {
      setNotes(updatedNotes);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [params.id]);

  const handleRecord = () => {
    setIsRecording(true);
  };

  const handleWrite = () => {
    setIsWriting(true);
  };

  const handleRecordingComplete = () => {
    setIsRecording(false);
  };

  const handleWritingComplete = () => {
    setIsWriting(false);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-[50vh]">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Oops! Something went wrong
              </h3>
              <p className="text-gray-500">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-16 flex items-center">
            <Link
              href="/"
              className="flex items-center text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
              >
                <p className="text-gray-800">{note.content}</p>
                <div className="mt-2 text-xs text-gray-500">
                  {note.type === "audio" ? "🎤 Voice Note" : "✍️ Written Note"}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </main>

      <FloatingDock onRecord={handleRecord} onWrite={handleWrite} />

      {isRecording && (
        <VoiceRecorder
          threadId={params.id}
          onRecordingComplete={handleRecordingComplete}
          onClose={() => setIsRecording(false)}
        />
      )}

      {isWriting && (
        <WriteNoteModal
          threadId={params.id}
          onComplete={handleWritingComplete}
          onClose={() => setIsWriting(false)}
        />
      )}
    </div>
  );
}
