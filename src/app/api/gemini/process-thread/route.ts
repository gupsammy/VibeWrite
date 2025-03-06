import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebase/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { Note } from "@/lib/types/thread";

export async function POST(req: Request) {
  console.log("=== Starting API request processing ===");

  try {
    const body = await req.text(); // First get the raw body
    console.log("Raw request body:", body);

    const parsedBody = JSON.parse(body); // Then parse it
    console.log("Parsed request body:", parsedBody);

    const { threadId } = parsedBody;
    console.log("ThreadId received:", threadId);

    // Log environment variable status
    console.log("Environment check:");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log(
      "API Key status:",
      process.env.GOOGLE_API_KEY ? "Present" : "Missing"
    );
    console.log("API Key length:", process.env.GOOGLE_API_KEY?.length || 0);

    // Fetch all notes for the thread
    const notesCollection = collection(db, "notes");
    const q = query(
      notesCollection,
      where("threadId", "==", threadId),
      orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(q);
    console.log("Firestore query completed, documents found:", !snapshot.empty);

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "No notes found in thread" },
        { status: 400 }
      );
    }

    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Note[];

    // Filter out prompt notes
    const contentNotes = notes.filter((note) => !note.isPrompt);
    console.log("Content notes found:", contentNotes.length);

    if (contentNotes.length === 0) {
      return NextResponse.json(
        { error: "No content notes found in thread" },
        { status: 400 }
      );
    }

    // Construct the prompt
    const prompt = `
You are an AI assistant helping users organize their thoughts in a note-taking app. Analyze the following notes in a thread and generate:

1. A concise thread title (max 50 characters)
2. A brief description (1-2 lines, max 150 characters)
3. 3-5 contextual tags
4. 3 leading exploratory questions based on the most recent note

Return the response in this exact JSON format, with no additional text:

{
"title": "Thread Title",
"description": "Thread description",
"tags": ["tag1", "tag2", "tag3"],
"questions": ["Question 1?", "Question 2?", "Question 3?"]
}

Notes in chronological order:
${contentNotes
  .map((note, index) => `${index + 1}. ${note.content}`)
  .join("\n\n")}

Generate the title, description, and tags based on all notes. Generate the three questions based on the most recent note (note ${
      contentNotes.length
    }).
`;

    // Initialize the Google Generative AI with API key
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
    console.log("Gemini client initialized");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Gemini model selected");

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resultText = response.text();

    // Parse the response as JSON
    let metadata;
    try {
      metadata = JSON.parse(resultText);
    } catch (error) {
      console.error("Error parsing LLM response:", error);
      return NextResponse.json(
        { error: "Failed to parse LLM response", responseText: resultText },
        { status: 500 }
      );
    }

    // Update the thread in Firestore
    const threadsCollection = collection(db, "threads");
    const threadRef = doc(threadsCollection, threadId);
    await updateDoc(threadRef, {
      title: metadata.title,
      description: metadata.description,
      tags: metadata.tags,
      leadingQuestions: metadata.questions,
      updatedAt: Timestamp.now(),
    });

    // Store questions as a note with isPrompt flag
    const promptNote = {
      threadId,
      content: metadata.questions.join("\n"),
      type: "text",
      isPrompt: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await addDoc(collection(db, "notes"), promptNote);

    return NextResponse.json({ success: true, metadata });
  } catch (error: any) {
    // Type assertion to fix linter errors
    console.error("=== Detailed Error Information ===");
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Non-Error object thrown:", error);
    }
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error?.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
