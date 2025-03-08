"use client";

import { Mic, PenLine, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingDockProps {
  onRecord?: () => void;
  onWrite?: () => void;
  onChat?: () => void;
  className?: string;
}

export const FloatingDock = ({
  onRecord,
  onWrite,
  onChat,
  className,
}: FloatingDockProps) => {
  return (
    <div
      className={cn("fixed bottom-6 left-1/2 -translate-x-1/2 z-40", className)}
    >
      <motion.div
        className="flex items-center gap-3 px-3 py-2 rounded-[24px] bg-[#18181B]/90 shadow-lg backdrop-blur-sm"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <Button
          onClick={onRecord}
          variant="ghost"
          className="h-[44px] w-[120px] rounded-[16px] bg-[#EA580C] hover:bg-[#EA580C]/90 text-white hover:text-white transition-colors flex items-center gap-2"
        >
          <Mic className="h-5 w-5" />
          <span className="text-sm font-medium">Record</span>
        </Button>

        <Button
          onClick={onWrite}
          variant="ghost"
          className="h-[44px] w-[120px] rounded-[16px] bg-white/10 hover:bg-white/15 text-white hover:text-white transition-colors flex items-center gap-2"
        >
          <PenLine className="h-5 w-5" />
          <span className="text-sm font-medium">Write</span>
        </Button>

        <Button
          onClick={onChat}
          variant="ghost"
          className="h-[44px] w-[120px] rounded-[16px] bg-white/10 hover:bg-white/15 text-white hover:text-white transition-colors flex items-center gap-2"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-sm font-medium">Chat</span>
        </Button>
      </motion.div>
    </div>
  );
};
