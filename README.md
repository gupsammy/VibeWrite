# VibeWrite

VibeWrite is a note-taking application that helps you organize your thoughts through voice and text notes.

## New Feature: AI-Powered Thread Analysis

VibeWrite now integrates with Google's Gemini-2.0-Flash model to analyze your notes and provide intelligent metadata for your threads:

- **Smart Thread Naming**: Automatically generates concise thread titles based on content
- **Contextual Descriptions**: Creates brief descriptions of thread topics
- **Intelligent Tagging**: Adds 3-5 contextual tags based on thread content
- **Leading Questions**: Suggests 3 follow-up questions based on your most recent note to help explore topics further

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file with the following:

   ```
   # Firebase Config
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

   # Deepgram API Key (for speech-to-text)
   NEXT_PUBLIC_DEEPGRAM_API_KEY=your_deepgram_api_key

   # Google Gemini API Key
   GOOGLE_API_KEY=your_google_api_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

## Getting a Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create or sign in to your account
3. Navigate to API keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file as `GOOGLE_API_KEY`

## Features

- Record voice notes with automatic transcription
- Write text notes
- AI-powered thread metadata generation
- Organize notes in threads
- Search and filter notes
- Leading questions to prompt further exploration

## Technical Stack

- Next.js 14 with App Router
- TypeScript
- Firebase (Firestore, Auth)
- Tailwind CSS for styling
- Deepgram for speech-to-text
- Google Gemini for AI-powered analysis
- Vercel AI SDK for model integration
