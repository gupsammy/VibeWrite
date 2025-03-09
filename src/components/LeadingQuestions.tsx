"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LeadingQuestionsProps {
  questions: string[];
}

export function LeadingQuestions({ questions }: LeadingQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Cycle through questions every 2 seconds
  useEffect(() => {
    if (questions.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentQuestionIndex((prevIndex) =>
        prevIndex === questions.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [questions]);

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex === questions.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex === 0 ? questions.length - 1 : prevIndex - 1
    );
  };

  if (!questions || questions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <Card className="overflow-hidden border border-secondary-100">
        <div className="p-3 bg-secondary-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="flex items-center text-xs font-medium text-secondary-700">
              <HelpCircle className="mr-1.5 h-3.5 w-3.5" />
              Explore Further
            </h3>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full p-0 text-secondary-700 hover:bg-secondary-200 hover:text-secondary-900"
                onClick={goToPreviousQuestion}
              >
                <ChevronLeft className="h-3 w-3" />
                <span className="sr-only">Previous question</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full p-0 text-secondary-700 hover:bg-secondary-200 hover:text-secondary-900"
                onClick={goToNextQuestion}
              >
                <ChevronRight className="h-3 w-3" />
                <span className="sr-only">Next question</span>
              </Button>
            </div>
          </div>

          <div className="relative min-h-[42px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentQuestionIndex}
                className="text-secondary-700 text-sm absolute w-full"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {questions[currentQuestionIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-secondary-100 px-3 py-1.5 flex justify-end items-center">
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <button
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === currentQuestionIndex
                    ? "bg-secondary-600"
                    : "bg-secondary-300"
                }`}
                onClick={() => setCurrentQuestionIndex(i)}
                aria-label={`Go to question ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
