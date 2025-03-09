"use client";

import { useEffect, useState } from "react";
import { Thread } from "@/lib/types/thread";
import { Note } from "@/lib/types/note";
import { subscribeToThreadNotes } from "@/lib/firebase/threadUtils";
import { FloatingDock } from "@/components/FloatingDock";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { WriteNoteModal } from "@/components/WriteNoteModal";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { ThreadHeader } from "@/components/ThreadHeader";
import { NoteItem } from "@/components/NoteItem";
import { LeadingQuestions } from "@/components/LeadingQuestions";
import { Button } from "@/components/ui/button";

export default function ThreadPage({ params }: { params: { id: string } }) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

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

    return () => {
      unsubscribeThread();
      unsubscribeNotes();
    };
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="py-4">
          <Link href="/" passHref>
            <Button
              variant="ghost"
              className="flex items-center text-muted-foreground hover:text-foreground px-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Threads</span>
            </Button>
          </Link>
        </div>

        <div className="py-2">
          {thread && <ThreadHeader thread={thread} />}

          {isLoading ? (
            <div className="space-y-4 mt-8">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-border p-4 animate-pulse"
                >
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 mt-8">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-muted-foreground">
                Transcribing your audio...
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                This may take a few moments
              </p>
            </div>
          ) : (
            <motion.div
              className="space-y-0 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {notes.map((note, index) => (
                <div key={note.id}>
                  <NoteItem note={note} />

                  {/* Show leading questions card below the most recent note */}
                  {index === notes.length - 1 &&
                    thread?.leadingQuestions &&
                    thread.leadingQuestions.length > 0 && (
                      <LeadingQuestions questions={thread.leadingQuestions} />
                    )}
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

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
