"use client";

import { Thread } from "@/lib/types/thread";
import { motion } from "framer-motion";
import { MessageSquare, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ThreadCardProps {
  thread: Thread;
}

export const ThreadCard = ({ thread }: ThreadCardProps) => {
  return (
    <Link href={`/thread/${thread.id}`}>
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 hover:shadow-md transition-shadow cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
              {thread.title}
            </h3>
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
              {thread.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {thread.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end ml-4">
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <div className="flex items-center mt-auto pt-4">
              <MessageSquare className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-500">{thread.noteCount}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
