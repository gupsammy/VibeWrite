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
import { db } from "@/lib/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function ThreadPage({ params }: { params: { id: string } }) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    // Subscribe to thread metadata
    const threadRef = doc(db, "threads", params.id);
    const unsubscribeThread = onSnapshot(threadRef, (doc) => {
      if (doc.exists()) {
        const threadData = { id: doc.id, ...doc.data() } as Thread;
        setThread(threadData);
      }
    });

    // Subscribe to notes
    const unsubscribeNotes = subscribeToThreadNotes(
      params.id,
      (updatedNotes) => {
        // Filter out prompt notes for display
        const regularNotes = updatedNotes.filter((note) => !note.isPrompt);
        setNotes(regularNotes);
        setIsLoading(false);
      }
    );

    // Cycle through questions every 5 seconds if they exist
    const interval = setInterval(() => {
      if (thread?.leadingQuestions?.length) {
        setCurrentQuestionIndex(
          (prev) => (prev + 1) % thread.leadingQuestions.length
        );
      }
    }, 5000);

    return () => {
      unsubscribeThread();
      unsubscribeNotes();
      clearInterval(interval);
    };
  }, [params.id, thread?.leadingQuestions?.length]);

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
        {thread && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-gray-900">{thread.title}</h1>
            <p className="text-gray-500 mt-2">{thread.description}</p>
            {thread.tags && thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {thread.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}

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
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500">Transcribing your audio...</p>
            <p className="text-xs text-gray-400 mt-2">
              This may take a few moments
            </p>
          </div>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {notes.map((note, index) => (
              <div key={note.id}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <p className="text-gray-800">{note.content}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {note.type === "audio"
                      ? "🎤 Voice Note"
                      : "✍️ Written Note"}
                  </div>
                </div>

                {/* Show leading questions card below the most recent note */}
                {index === notes.length - 1 &&
                  thread?.leadingQuestions &&
                  thread.leadingQuestions.length > 0 && (
                    <motion.div
                      className="mt-4 p-4 bg-blue-50 rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={currentQuestionIndex}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-sm font-semibold text-blue-800 mb-2">
                        Explore Further
                      </h3>
                      <p className="text-sm text-blue-700">
                        {thread.leadingQuestions[currentQuestionIndex]}
                      </p>
                    </motion.div>
                  )}
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
