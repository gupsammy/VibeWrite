"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { FloatingDock } from "@/components/FloatingDock";
import { ThreadList } from "@/components/ThreadList";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { WriteNoteModal } from "@/components/WriteNoteModal";
import { Thread } from "@/lib/types/thread";
import { subscribeToThreads } from "@/lib/firebase/threadUtils";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (!user) return; // Don't set up subscription if not authenticated

    let unsubscribe: (() => void) | undefined;

    const setupSubscription = async () => {
      try {
        unsubscribe = await subscribeToThreads((updatedThreads) => {
          setThreads(updatedThreads);
          setIsLoading(false);
        });
      } catch (err) {
        console.error("Error setting up thread subscription:", err);
        setError(err as Error);
        setIsLoading(false);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, authLoading, router]);

  const handleRecord = () => {
    setIsRecording(true);
  };

  const handleWrite = () => {
    setIsWriting(true);
  };

  // This function won't get called until after navigation to the thread page
  // So we need to ensure it doesn't cause issues
  const handleRecordingComplete = () => {
    // Use a timeout to prevent state updates on unmounted components
    setTimeout(() => {
      setIsRecording(false);
    }, 0);
  };

  const handleWritingComplete = () => {
    setIsWriting(false);
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4">
        {threads.length === 0 && !isLoading ? (
          <EmptyState />
        ) : (
          <div className="py-8">
            <ThreadList threads={threads} isLoading={isLoading} error={error} />
          </div>
        )}
      </main>
      <FloatingDock onRecord={handleRecord} onWrite={handleWrite} />

      {isRecording && (
        <VoiceRecorder
          onRecordingComplete={handleRecordingComplete}
          onClose={() => setIsRecording(false)}
        />
      )}

      {isWriting && (
        <WriteNoteModal
          onComplete={handleWritingComplete}
          onClose={() => setIsWriting(false)}
        />
      )}
    </div>
  );
}
