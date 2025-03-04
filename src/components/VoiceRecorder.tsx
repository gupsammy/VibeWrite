"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createEmptyThread, addNoteToThread } from "@/lib/firebase/threadUtils";
import { useRouter } from "next/navigation";

interface VoiceRecorderProps {
  threadId?: string;
  onRecordingComplete?: () => void;
  onClose?: () => void;
}

export const VoiceRecorder = ({
  threadId,
  onRecordingComplete,
  onClose,
}: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [createdThreadId, setCreatedThreadId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start recording timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Could not access microphone. Please check your permissions.");
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    setIsRecording(false);
    setIsTranscribing(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Create a callback for when recording is stopped
    mediaRecorderRef.current.onstop = async () => {
      try {
        // Create a blob from all the audio chunks
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        // Convert blob to base64 string for easier transmission
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;

          // Create a new thread or use existing one
          let targetThreadId = threadId;

          // If we don't have a threadId, create an empty thread
          if (!targetThreadId) {
            try {
              const newThreadId = await createEmptyThread();
              setCreatedThreadId(newThreadId);
              targetThreadId = newThreadId;

              // Navigate to the new thread page
              router.push(`/thread/${newThreadId}`);
            } catch (error) {
              console.error("Error creating thread:", error);
              setError("Failed to create a new thread. Please try again.");
              setIsTranscribing(false);
              return;
            }
          }

          // Send the audio to our API for transcription
          try {
            const response = await fetch("/api/deepgram/transcribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ audioData: base64Audio }),
            });

            if (!response.ok) {
              throw new Error(`Transcription failed: ${response.statusText}`);
            }

            const data = await response.json();
            setTranscript(data.transcript);

            // Add the transcription as a new note to the thread
            if (targetThreadId) {
              await addNoteToThread(targetThreadId, {
                content: data.transcript,
                type: "audio",
              });
            }

            setIsTranscribing(false);
            onRecordingComplete?.();
            setRecordingTime(0);
          } catch (error) {
            console.error("Transcription error:", error);
            setError("Failed to transcribe audio. Please try again.");
            setIsTranscribing(false);
          }
        };
      } catch (error) {
        console.error("Error processing recording:", error);
        setError("Failed to process recording. Please try again.");
        setIsTranscribing(false);
      }
    };

    // Stop the media recorder to trigger the onstop callback
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream
      .getTracks()
      .forEach((track) => track.stop());
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
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
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {isRecording
                ? "Recording..."
                : isTranscribing
                ? "Transcribing Audio..."
                : "Start Recording"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {isRecording
                ? formatTime(recordingTime)
                : isTranscribing
                ? "Please wait while we process your audio"
                : "Press the button to start"}
            </p>
            {error && (
              <motion.p
                className="text-sm text-red-500 mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
          </div>

          <div className="relative">
            {transcript && (
              <motion.div
                className="bg-gray-50 rounded-lg p-4 mb-4 text-gray-700 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {transcript}
              </motion.div>
            )}

            <div className="flex justify-center">
              {isTranscribing ? (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <motion.button
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    isRecording ? "bg-red-500" : "bg-blue-500"
                  } text-white`}
                  whileTap={{ scale: 0.95 }}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? (
                    <Square className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {onClose && !isTranscribing && (
            <button
              className="mt-6 w-full text-sm text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
