"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export const EmptyState = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-[calc(100vh-6rem)] text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 160 }}
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Plus className="w-8 h-8 text-gray-400" />
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-semibold mb-2 text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        No YapThreads Yet
      </motion.h2>

      <motion.p
        className="text-gray-500 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Click below to create your first YapThread to start organizing your
        thoughts
      </motion.p>
    </motion.div>
  );
};
