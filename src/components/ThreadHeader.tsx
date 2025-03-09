"use client";

import { Thread } from "@/lib/types/thread";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";

interface ThreadHeaderProps {
  thread: Thread;
}

export function ThreadHeader({ thread }: ThreadHeaderProps) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-foreground">{thread.title}</h1>
      <p className="text-muted-foreground mt-2 text-lg">{thread.description}</p>

      <div className="flex justify-between items-center mt-4">
        <div className="flex flex-wrap gap-2">
          {thread.tags &&
            thread.tags.length > 0 &&
            thread.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-background">
                {tag}
              </Badge>
            ))}
        </div>

        <div className="text-xs text-muted-foreground">
          Last updated: {formatDate(thread.updatedAt.toDate())}
        </div>
      </div>

      <div className="mt-6 border-b border-border/40"></div>
    </motion.div>
  );
}
