"use client";

import { Plus, FileText, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  onRecord?: () => void;
  onWrite?: () => void;
  className?: string;
}

export const EmptyState = ({
  onRecord,
  onWrite,
  className,
}: EmptyStateProps) => {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center min-h-[400px] px-4 text-center",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 160 }}
      >
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
          <Plus className="w-10 h-10 text-primary" />
        </div>
        <motion.div
          className="absolute -right-4 -bottom-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <Mic className="w-6 h-6 text-red-600" />
        </motion.div>
        <motion.div
          className="absolute -left-4 -bottom-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <FileText className="w-6 h-6 text-blue-600" />
        </motion.div>
      </motion.div>

      <motion.h2
        className="text-2xl font-semibold mb-3 text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Start Your First Thread
      </motion.h2>

      <motion.p
        className="text-muted-foreground max-w-md mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Record a voice note or write your thoughts to create your first thread.
        VibeWrite will help organize your ideas.
      </motion.p>

      {(onRecord || onWrite) && (
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {onRecord && (
            <Button
              onClick={onRecord}
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Mic className="mr-2 h-5 w-5" />
              Record Voice Note
            </Button>
          )}

          {onWrite && (
            <Button
              onClick={onWrite}
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <FileText className="mr-2 h-5 w-5" />
              Write Note
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
