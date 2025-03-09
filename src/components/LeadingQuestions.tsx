"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

interface LeadingQuestionsProps {
  questions: string[];
}

export function LeadingQuestions({ questions }: LeadingQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Cycle through questions every 8 seconds
  useEffect(() => {
    if (questions.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentQuestionIndex((prevIndex) =>
        prevIndex === questions.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [questions]);

  if (!questions || questions.length === 0) return null;

  return (
    <motion.div
      className="mb-6 overflow-hidden rounded-xl border border-primary-100 bg-primary-50 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      key={currentQuestionIndex}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <h3 className="flex items-center text-sm font-semibold text-primary-700 mb-2">
          <HelpCircle className="mr-2 h-4 w-4" />
          Explore Further
        </h3>
        <p className="text-primary-600">{questions[currentQuestionIndex]}</p>
      </div>
      <div className="bg-primary-100 px-4 py-2 flex justify-between items-center">
        <span className="text-xs text-primary-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i === currentQuestionIndex ? "bg-primary-600" : "bg-primary-300"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
