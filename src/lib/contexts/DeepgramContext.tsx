"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  createClient,
  DeepgramClient,
  LiveTranscriptionEvents,
} from "@deepgram/sdk";

interface DeepgramTranscription {
  channel: {
    alternatives: Array<{
      transcript: string;
    }>;
  };
  is_final: boolean;
}

interface DeepgramContextType {
  deepgramClient: DeepgramClient | null;
  isLoading: boolean;
  error: Error | null;
}

const DeepgramContext = createContext<DeepgramContextType | null>(null);

export const DeepgramProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [deepgramClient, setDeepgramClient] = useState<DeepgramClient | null>(
    null
  );

  useEffect(() => {
    const initializeDeepgram = async () => {
      try {
        const response = await fetch("/api/deepgram");
        const { key } = await response.json();

        if (!key) {
          throw new Error("Failed to get Deepgram API key");
        }

        const client = createClient(key);
        setDeepgramClient(client);
        setIsLoading(false);
      } catch (err) {
        console.error("Deepgram initialization error:", err);
        setError(err as Error);
        setIsLoading(false);
      }
    };

    initializeDeepgram();
  }, []);

  if (!deepgramClient) {
    return null;
  }

  return (
    <DeepgramContext.Provider
      value={{
        deepgramClient,
        isLoading,
        error,
      }}
    >
      {children}
    </DeepgramContext.Provider>
  );
};

export const useDeepgram = () => {
  const context = useContext(DeepgramContext);
  if (!context) {
    throw new Error("useDeepgram must be used within a DeepgramProvider");
  }
  return context;
};

export { LiveTranscriptionEvents };
export type { DeepgramTranscription };
