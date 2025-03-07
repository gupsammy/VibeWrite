"use client";

import { Thread } from "@/lib/types/thread";
import { motion } from "framer-motion";
import { MessageSquare, ChevronRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface ThreadCardProps {
  thread: Thread;
}

// Helper function to format Firestore timestamp
const formatDate = (timestamp: any) => {
  if (!timestamp) return "Unknown date";

  // Convert Firestore timestamp to JS Date if needed
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return format(date, "MMM d, yyyy");
};

export const ThreadCard = ({ thread }: ThreadCardProps) => {
  return (
    <Link href={`/thread/${thread.id}`}>
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <h3 className="font-medium text-lg text-gray-900">{thread.title}</h3>
        <p className="text-gray-500 mt-1 text-sm line-clamp-2">
          {thread.description}
        </p>

        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {thread.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center mt-4 text-xs text-gray-400">
          <CalendarDays className="w-3 h-3 mr-1" />
          {formatDate(thread.updatedAt)}
          <div className="mx-2">•</div>
          <MessageSquare className="w-3 h-3 mr-1" />
          {thread.noteCount} {thread.noteCount === 1 ? "note" : "notes"}
        </div>
      </motion.div>
    </Link>
  );
};
