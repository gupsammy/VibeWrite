"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createThread, addNoteToThread } from "@/lib/firebase/threadUtils";
import {
  useDeepgram,
  LiveTranscriptionEvents,
  DeepgramTranscription,
} from "@/lib/contexts/DeepgramContext";

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
  const [transcript, setTranscript] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const connectionRef = useRef<any>(null);
  const { deepgramClient, isLoading, error: deepgramError } = useDeepgram();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Clean up Deepgram connection when component unmounts
      if (connectionRef.current) {
        connectionRef.current.close();
      }
    };
  }, []);

  // Handle Deepgram initialization error
  useEffect(() => {
    if (deepgramError) {
      setError(deepgramError.message);
    }
  }, [deepgramError]);

  const startRecording = async () => {
    if (isLoading || !deepgramClient) {
      setError("Deepgram is not ready yet. Please try again.");
      return;
    }

    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setTranscript("");

      // Initialize Deepgram live transcription
      const connection = deepgramClient.listen.live({
        model: "nova-2",
        punctuate: true,
        interim_results: true,
        language: "en",
      });

      connectionRef.current = connection;

      // Set up event listeners
      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log("Deepgram connection established");

        // Start sending audio data once the connection is open
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && connection.getReadyState() === 1) {
            connection.send(event.data);
          }
        };

        mediaRecorder.start(250); // Collect data every 250ms
      });

      connection.on(
        LiveTranscriptionEvents.Transcript,
        (data: DeepgramTranscription) => {
          const receivedTranscript = data.channel.alternatives[0].transcript;
          if (receivedTranscript) {
            setTranscript(receivedTranscript);
          }
        }
      );

      connection.on(LiveTranscriptionEvents.Error, (error) => {
        console.error("Deepgram error:", error);
        setError("Error during transcription. Please try again.");
        stopRecording();
      });

      connection.on(LiveTranscriptionEvents.Close, () => {
        console.log("Deepgram connection closed");
      });

      // Start recording timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Could not access microphone. Please check your permissions.");
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Close Deepgram connection
      if (connectionRef.current) {
        connectionRef.current.close();
        connectionRef.current = null;
      }

      // Save the note
      if (transcript) {
        try {
          if (threadId) {
            // Add note to existing thread
            await addNoteToThread(threadId, {
              content: transcript,
              type: "audio",
            });
          } else {
            // Create new thread with this note
            await createThread({
              content: transcript,
              type: "audio",
            });
          }
          onRecordingComplete?.();
          setRecordingTime(0);
        } catch (error) {
          console.error("Error saving note:", error);
        }
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {isRecording ? "Recording..." : "Start Recording"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {isRecording
                ? formatTime(recordingTime)
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
            {isLoading && (
              <motion.p
                className="text-sm text-blue-500 mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Initializing Deepgram...
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
              <motion.button
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isRecording ? "bg-red-500" : "bg-blue-500"
                } text-white`}
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
              >
                {isRecording ? (
                  <Square className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>

          {onClose && (
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
