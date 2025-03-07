"use client";

import { Mic, PenLine } from "lucide-react";
import { motion } from "framer-motion";

interface FloatingDockProps {
  onRecord: () => void;
  onWrite: () => void;
}

export const FloatingDock = ({ onRecord, onWrite }: FloatingDockProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-8 pointer-events-none">
      <motion.div
        className="bg-white rounded-full shadow-lg p-2 flex gap-4 pointer-events-auto"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.button
          className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          onClick={onRecord}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          <Mic className="w-5 h-5" />
        </motion.button>

        <motion.button
          className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
          onClick={onWrite}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          <PenLine className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
};
