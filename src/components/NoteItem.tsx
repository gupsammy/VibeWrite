"use client";

import { Note } from "@/lib/types/note";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, FileText } from "lucide-react";
import { format } from "date-fns";

interface NoteItemProps {
  note: Note;
}

export function NoteItem({ note }: NoteItemProps) {
  const formatDateTime = (date: Date) => {
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-4">
        <p className="text-foreground whitespace-pre-wrap">{note.content}</p>

        <div className="mt-3 flex items-center text-xs text-muted-foreground">
          {note.type === "audio" ? (
            <div className="flex items-center">
              <Mic className="mr-1 h-3 w-3" />
              <span>Voice Note</span>
            </div>
          ) : (
            <div className="flex items-center">
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
  );
}
