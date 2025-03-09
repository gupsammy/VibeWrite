"use client";

import { Note } from "@/lib/types/note";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, FileText } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NoteItemProps {
  note: Note;
}

export function NoteItem({ note }: NoteItemProps) {
  const formatDateTime = (date: Date) => {
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  const isAudio = note.type === "audio";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="mb-4"
    >
      <Card
        className={cn(
          "overflow-hidden border",
          isAudio
            ? "border-l-4 border-l-red-400"
            : "border-l-4 border-l-blue-400"
        )}
      >
        <CardContent className="p-4">
          <p className="text-foreground whitespace-pre-wrap">{note.content}</p>

          <div className="mt-3 flex items-center text-xs text-muted-foreground">
            {isAudio ? (
              <div className="flex items-center text-red-500">
                <Mic className="mr-1 h-3 w-3" />
                <span>Voice Note</span>
              </div>
            ) : (
              <div className="flex items-center text-blue-500">
                <FileText className="mr-1 h-3 w-3" />
                <span>Written Note</span>
              </div>
            )}
            <div className="ml-auto">
              {formatDateTime(note.createdAt.toDate())}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
