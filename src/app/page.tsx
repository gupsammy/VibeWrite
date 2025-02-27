"use client";

import { useState, useEffect } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import NotesList from "@/components/NotesList";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Record Your Thoughts
            </h2>
            <p className="text-gray-600">
              Capture ideas, reminders, and notes with your voice
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <VoiceRecorder />
          </div>

          <NotesList />
        </div>
      </main>

      <footer className="bg-white py-4 border-t">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} VibeWrite - Voice Notes App
        </div>
      </footer>
    </div>
  );
}
