# VibeWrite Threads Feature Implementation Plan

## Overview

This document outlines the implementation plan for the Threads feature in VibeWrite. Threads allow users to create collections of notes (audio recordings or text entries) that are thematically related and enhanced with AI-generated metadata.

## Database Schema

### Thread Schema

```typescript
interface Thread {
  id: string; // Unique identifier (auto-generated)
  title: string; // LLM-generated title
  description: string; // LLM-generated one-line description
  tags: string[]; // LLM-generated contextual tags (3-5)
  createdAt: Timestamp; // When the thread was created
  updatedAt: Timestamp; // When the thread was last updated
  noteCount: number; // Count of notes in this thread
}
```

### Note Schema

```typescript
interface Note {
  id: string; // Unique identifier (auto-generated)
  threadId: string; // Reference to parent thread
  content: string; // Transcribed text or user-written text
  type: "audio" | "text"; // Type of note
  createdAt: Timestamp; // When the note was created
  updatedAt: Timestamp; // When the note was last updated
}
```

## LLM Output Structure

The Google Gemini model will generate the following structured output for each thread:

```typescript
interface GeminiOutput {
  title: string; // Title for the thread
  description: string; // One-line description of the thread content
  tags: string[]; // 3-5 contextual tags for categorization
  leadingQuestions: string[]; // 3 exploratory questions for the user
}
```

## API Integration

### Google Gemini API via Vercel AI SDK

We'll create a new API route to process notes and generate thread metadata using Google Gemini 2.0 Flash model:

```typescript
// src/app/api/gemini/process-thread/route.ts
export async function POST(req: Request) {
  const { notes } = await req.json();

  // Use Vercel AI SDK to generate and stream response from Gemini
  const response = await streamText({
    model: "gemini-2.0-flash",
    messages: [
      {
        role: "system",
        content: systemPrompt, // Instructions for generating thread metadata
      },
      {
        role: "user",
        content: formatNotesForLLM(notes), // Format notes in structured way
      },
    ],
    temperature: 0.3,
  });

  return response;
}
```

## Firestore Implementation

We'll leverage Firestore's real-time capabilities for immediate updates to the UI when thread or note data changes:

```typescript
// Real-time listener for threads
const unsubscribeThreads = db
  .collection("threads")
  .orderBy("updatedAt", "desc")
  .onSnapshot((snapshot) => {
    // Update threads in the UI when changes occur
    const threads = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setThreads(threads);
  });

// Real-time listener for notes within a thread
const unsubscribeNotes = db
  .collection("notes")
  .where("threadId", "==", threadId)
  .orderBy("createdAt", "asc")
  .onSnapshot((snapshot) => {
    // Update notes in the UI when changes occur
    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNotes(notes);
  });
```

## Implementation Phases

### Phase 1: Database and UI Foundations

- **Tasks:**

  - Set up Firestore collections for threads and notes
  - Create basic UI components for home screen with thread cards
  - Create thread detail screen with note cards
  - Implement navigation between screens
  - Add placeholder for floating dock with record/write buttons

- **Milestones:**
  - ✅ Firestore collections can be read/written
  - ✅ Basic UI renders correctly on both screens
  - ✅ Navigation between screens works as expected

### Phase 2: Audio Recording and Text Input

- **Tasks:**

  - Implement audio recording using the existing Deepgram integration
  - Create text input modal for written notes
  - Set up real-time transcription of audio
  - Store transcriptions in Firestore
  - Implement thread and note creation flows

- **Milestones:**
  - ✅ Audio recording and transcription work correctly
  - ✅ Text input modal appears and captures text
  - ✅ New threads are created when recording/writing on home screen
  - ✅ New notes are added to threads when recording/writing in thread view

### Phase 3: Google Gemini Integration

- **Tasks:**

  - Create API route for Google Gemini using Vercel AI SDK
  - Craft system prompt for generating thread metadata
  - Implement function to format notes for LLM processing
  - Set up API call trigger when new note is added
  - Parse and store LLM response in Firestore

- **Milestones:**
  - ✅ API route successfully calls Google Gemini model
  - ✅ LLM generates expected structured output
  - ✅ Thread metadata is updated with LLM output
  - ✅ Process completes within acceptable time

### Phase 4: UI Enhancement and Leading Questions

- **Tasks:**

  - Update thread cards with title, description, and tags
  - Implement loading states during LLM processing
  - Create cycling questions component for thread detail view
  - Refine animations for transitions between screens
  - Implement infinite scrolling for threads and notes

- **Milestones:**
  - ✅ Thread cards display correct metadata
  - ✅ Leading questions appear and cycle correctly
  - ✅ UI provides feedback during processing
  - ✅ Scrolling works correctly for many threads/notes

### Phase 5: Polish and Optimization

- **Tasks:**

  - Optimize Firestore queries for performance
  - Implement caching strategies for thread data
  - Add error handling for API calls and Firestore operations
  - Refine animations and transitions
  - Add loading skeletons for better UX

- **Milestones:**
  - ✅ Application performs well with many threads/notes
  - ✅ Error states are handled gracefully
  - ✅ UI feels smooth and responsive

## Component Structure

### Home Screen Components

- `ThreadList`: Main container for displaying thread cards
- `ThreadCard`: Card component for displaying thread metadata
- `FloatingDock`: Bottom dock with record and write buttons
- `WriteModal`: Modal for text input

### Thread Detail Components

- `ThreadHeader`: Displays thread title, description, and tags
- `NoteList`: Container for displaying note cards
- `NoteCard`: Card component for displaying note content
- `LeadingQuestions`: Component for displaying and cycling through questions
- `FloatingDock`: Same component as home screen with context awareness

## Google Gemini System Prompt

```
You are an AI assistant helping users organize their thoughts in a note-taking app.
Your task is to analyze a collection of notes within a thread and generate:

1. A concise, descriptive title for the thread (max 50 characters)
2. A one-line description that captures the essence of the thread (max 100 characters)
3. 3-5 contextual tags that categorize the content
4. 3 thought-provoking questions that could help the user explore this topic further

Your response must be in the following JSON format without any additional text:
{
  "title": "Concise Thread Title",
  "description": "One-line description of the thread content",
  "tags": ["tag1", "tag2", "tag3"],
  "leadingQuestions": [
    "First exploratory question?",
    "Second exploratory question?",
    "Third exploratory question?"
  ]
}
```

## Testing Strategy Between Phases

After each phase, conduct the following tests to ensure quality:

1. **Unit Tests:**

   - Test individual components and functions
   - Verify Firestore read/write operations
   - Test API route functionality

2. **Integration Tests:**

   - Test the flow between components
   - Verify real-time updates work correctly
   - Test LLM integration and response handling

3. **User Flow Tests:**
   - Record a note and verify thread creation
   - Add multiple notes to a thread
   - Verify metadata updates after LLM processing
   - Test navigation between screens

By following this phased approach with clear milestones and testing between phases, we can ensure a smooth implementation of the Threads feature with minimal regression issues.
