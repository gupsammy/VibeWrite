import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { Note } from "@/lib/types/thread";

// Initialize Firebase Admin SDK
if (!getApps().length) {
  console.log("Initializing Firebase Admin SDK");
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    throw error;
  }
}

const adminDb = getFirestore();

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
      "Firebase Project ID:",
      process.env.FIREBASE_PROJECT_ID ? "Present" : "Missing"
    );
    console.log(
      "Firebase Client Email:",
      process.env.FIREBASE_CLIENT_EMAIL ? "Present" : "Missing"
    );
    console.log(
      "Firebase Private Key:",
      process.env.FIREBASE_PRIVATE_KEY ? "Present" : "Missing"
    );

    // Fetch all notes for the thread using Admin SDK
    const notesRef = adminDb.collection("notes");
    const q = notesRef
      .where("threadId", "==", threadId)
      .orderBy("createdAt", "asc");

    console.log("Executing Firestore query...");
    const snapshot = await q.get();
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

Always only return a structured JSON object, with no additional text and no markdown formatting:

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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    console.log("Gemini model selected");

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resultText = response.text();

    // Before parsing, clean up the response to remove markdown formatting
    const cleanResponse = resultText.replace(/```json\n?|\n?```/g, "").trim();

    try {
      const parsedResponse = JSON.parse(cleanResponse);
      // Update the thread in Firestore
      const threadsCollection = adminDb.collection("threads");
      const threadRef = threadsCollection.doc(threadId);
      await threadRef.update({
        title: parsedResponse.title,
        description: parsedResponse.description,
        tags: parsedResponse.tags,
        leadingQuestions: parsedResponse.questions,
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Store questions as a note with isPrompt flag
      const promptNote = {
        threadId,
        content: parsedResponse.questions.join("\n"),
        type: "text",
        isPrompt: true,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await adminDb.collection("notes").add(promptNote);

      return NextResponse.json({ success: true, metadata: parsedResponse });
    } catch (error) {
      console.error("Error parsing LLM response:", error);
      console.error("Raw response:", cleanResponse);
      return NextResponse.json(
        { error: "Failed to parse LLM response" },
        { status: 500 }
      );
    }
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
