"use client";

import { Thread } from "@/lib/types/thread";
import { formatDate } from "@/lib/utils";
import { MessageSquare, CalendarDays } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ThreadCardProps {
  thread: Thread;
}

export const ThreadCard = ({ thread }: ThreadCardProps) => {
  return (
    <Link href={`/thread/${thread.id}`} className="block">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="line-clamp-1">{thread.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {thread.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            {thread.tags && thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {thread.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="mr-1 h-3 w-3" />
              <span>{formatDate(thread.updatedAt.toDate())}</span>
            </div>
            <div className="ml-auto flex items-center">
              <MessageSquare className="mr-1 h-3 w-3" />
              <span>
                {thread.noteCount} {thread.noteCount === 1 ? "note" : "notes"}
              </span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
};
