# VibeWrite

This is a full-stack template project for Software Composers to create applications with AI.

## Getting started

To create a new project, you go to `/paths`, choose from our list of Paths, and then use Cursor's Composer feature to quickly scaffold your project!

You can also edit the Path's prompt template to be whatever you like!

## Local Development Setup

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd VibeWrite
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   - Copy the `.env.local` file and fill in your API keys and configuration values
   - You'll need API keys for:
     - Firebase (if using authentication, storage, or database)
     - OpenAI (if using the OpenAI API)
     - Anthropic (if using the Anthropic API)
     - Replicate (if using image generation)
     - Deepgram (if using audio transcription)

4. Run the development server

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Technologies used

This project uses the following technologies:

- React with Next.js 14 App Router
- TailwindCSS
- Firebase Auth, Storage, and Database
- Multiple AI endpoints including OpenAI, Anthropic, and Replicate using Vercel's AI SDK
