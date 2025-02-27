"use client";

import { useState } from "react";
import { useDeepgram, SOCKET_STATES } from "@/lib/contexts/DeepgramContext";
import { addDocument } from "@/lib/firebase/firebaseUtils";
import { motion } from "framer-motion";
import { useNotes } from "@/lib/hooks/useNotes";

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const {
    connectToDeepgram,
    disconnectFromDeepgram,
    connectionState,
    realtimeTranscript,
    error: deepgramError,
  } = useDeepgram();
  const { refreshNotes } = useNotes();

  const handleStartRecording = async () => {
    try {
      await connectToDeepgram();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsSaving(true);
      disconnectFromDeepgram();
      setIsRecording(false);

      // Save the note to Firebase
      if (realtimeTranscript.trim()) {
        await addDocument("notes", {
          text: realtimeTranscript.trim(),
          timestamp: new Date().toISOString(),
        });

        // Refresh the notes list
        refreshNotes();
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Audio visualization animation variants
  const waveVariants = {
    recording: {
      scale: [1, 1.2, 1.5, 1.2, 1],
      opacity: [0.6, 0.8, 1, 0.8, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    idle: {
      scale: 1,
      opacity: 0.6,
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {deepgramError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {deepgramError}
        </div>
      )}

      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        disabled={isSaving}
        className={`w-full py-3 px-4 rounded-full flex items-center justify-center transition-all ${
          isRecording
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white font-bold ${
          isSaving ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isSaving ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Saving...
          </>
        ) : isRecording ? (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"></path>
            </svg>
            Stop Recording
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              ></path>
            </svg>
            Start Recording
          </>
        )}
      </button>

      {isRecording && (
        <div className="mt-6 p-5 bg-white rounded-lg shadow-md">
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                variants={waveVariants}
                animate="recording"
                initial="idle"
                custom={i}
                style={{ animationDelay: `${i * 0.1}s` }}
                className="w-2 h-12 bg-blue-500 rounded-full"
              />
            ))}
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-md max-h-40 overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-wrap break-words">
              {realtimeTranscript || "Listening..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
