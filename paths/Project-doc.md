# VibeWrite Project Documentation

## Tech Stack

### Core Technologies

- **Next.js 14** (App Router): For server-side rendering, routing, and API routes
- **TypeScript**: For type-safe code development
- **React 18+**: For building user interfaces
- **Tailwind CSS**: For utility-first styling
- **shadcn/ui**: For pre-built accessible UI components

### AI & Data Processing

- **Vercel AI SDK**: For handling AI interactions and streaming responses
- **OpenAI API**: For AI text generation capabilities
- **Anthropic API**: For alternative AI model access
- **Replicate API**: For image generation (Stable Diffusion)
- **Deepgram API**: For real-time audio transcription

### Backend & Authentication

- **Firebase**:
  - Firestore Database: For data storage
  - Firebase Authentication: For user management
  - Firebase Storage: For file storage
- **Serverless Functions**: Via Next.js API routes

## Project Structure

```
src/
├── app/                  # Next.js App Router structure
│   ├── api/              # API routes (serverless functions)
│   │   ├── anthropic/    # Anthropic API endpoints
│   │   ├── deepgram/     # Deepgram API endpoints
│   │   ├── openai/       # OpenAI API endpoints
│   │   └── replicate/    # Replicate API endpoints
│   ├── components/       # React components
│   ├── lib/              # Utility functions, hooks, and contexts
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page component
├── lib/
│   ├── contexts/         # React contexts
│   │   ├── AuthContext.tsx     # Firebase authentication context
│   │   └── DeepgramContext.tsx # Deepgram API context
│   ├── firebase/         # Firebase configuration
│   │   ├── firebase.ts         # Firebase initialization
│   │   └── firebaseUtils.ts    # Firebase utility functions
│   └── hooks/            # Custom React hooks
│       └── useAuth.ts          # Authentication hook
```

## Best Practices

### Next.js App Router

1. **Routing**:

   - Use the file-system based routing provided by the App Router
   - Implement dynamic routes with `[param]` folder naming
   - Use route groups with `(groupName)` for logical organization without affecting URL structure

2. **Data Fetching**:

   - Use React Server Components (RSC) for data fetching where possible
   - Implement proper caching strategies using `fetch` with `next: { revalidate }` options
   - Use React Suspense for loading states

3. **Rendering**:
   - Default to Server Components for improved performance
   - Use `"use client"` directive only when client-side interactivity is needed
   - Implement streaming with Suspense boundaries for progressive loading

### Vercel AI SDK

1. **Streaming Responses**:

   - Use the streaming pattern for AI responses to improve perceived performance
   - Implement proper error handling for AI API calls
   - Use the `useChat` hook for client-side chat interactions

2. **API Routes**:
   - Keep AI model configuration in the API routes
   - Implement proper rate limiting and error handling
   - Use environment variables for API keys

### TypeScript

1. **Type Safety**:

   - Define interfaces and types for all data structures
   - Use proper type annotations for function parameters and return values
   - Avoid using `any` type; prefer `unknown` when type is uncertain

2. **Component Props**:
   - Define explicit prop interfaces for all components
   - Use discriminated unions for components with multiple states

### Firebase

1. **Authentication**:

   - Use the provided AuthContext for user management
   - Implement proper route protection for authenticated routes
   - Follow the principle of least privilege for Firebase security rules

2. **Firestore**:

   - Structure data in a denormalized way for efficient querying
   - Use batch operations for related updates
   - Implement proper indexing for complex queries

3. **Storage**:
   - Use content-type validation for uploaded files
   - Implement proper access control for stored files
   - Consider using signed URLs for temporary access

### Serverless Architecture

1. **API Routes**:

   - Keep functions small and focused on a single responsibility
   - Implement proper error handling and status codes
   - Be mindful of cold starts and execution time limits

2. **Edge Functions** (when applicable):
   - Use Edge Functions for globally distributed, low-latency operations
   - Be aware of the runtime limitations compared to Node.js

### Performance Optimization

1. **Code Splitting**:

   - Use dynamic imports for large components or libraries
   - Implement proper loading states for dynamically imported components

2. **Image Optimization**:

   - Use Next.js Image component for automatic optimization
   - Specify proper sizes and priority attributes

3. **Font Optimization**:

   - Use Next.js Font system for optimized font loading
   - Implement font subsetting when possible

4. **Bundle Size**:
   - Regularly analyze bundle size with tools like `@next/bundle-analyzer`
   - Be mindful of large dependencies

### UI Development

1. **Tailwind CSS**:

   - Follow utility-first approach
   - Use consistent spacing and color tokens
   - Implement responsive design using Tailwind's breakpoint system

2. **shadcn/ui**:
   - Customize components through the provided configuration options
   - Maintain consistency in component usage
   - Extend components when needed rather than creating new ones

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install` or `yarn install`
3. Set up environment variables (see `.env.example`)
4. Run the development server with `npm run dev` or `yarn dev`

## Environment Variables

Create a `.env.local` file with the following variables:

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# OpenAI
OPENAI_API_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Replicate
REPLICATE_API_TOKEN=

# Deepgram
DEEPGRAM_API_KEY=
```

## Deployment

This project is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy with the default settings

For other platforms, ensure they support Next.js App Router and serverless functions.
