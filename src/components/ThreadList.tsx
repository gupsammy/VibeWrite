"use client";

import { Thread } from "@/lib/types/thread";
import { ThreadCard } from "./ThreadCard";
import { motion } from "framer-motion";

interface ThreadListProps {
  threads: Thread[];
  isLoading?: boolean;
  error?: Error | null;
}

export const ThreadList = ({ threads, isLoading, error }: ThreadListProps) => {
  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex gap-2 mt-4">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="h-6 w-16 bg-gray-200 rounded-full"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="ml-4">
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {threads.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} />
      ))}
    </motion.div>
  );
};
