# VibeWrite Development Guide

## Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Run ESLint

## Code Style & Conventions

- **Components**: Use named exports with arrow function syntax and TypeScript interfaces for props
- **Client components**: Mark with "use client" directive at the top of the file
- **File structure**: Follow `/components`, `/lib`, `/contexts`, `/hooks` organization
- **Styling**: Use Tailwind CSS utility classes
- **Types**: Use TypeScript with strict mode; create interfaces in `/lib/types`
- **State Management**: Use React hooks pattern
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Imports**: Group imports by external libraries, then internal modules
- **Error Handling**: Use try/catch for async operations, provide user-friendly fallbacks
- **Firebase**: Use utility functions from `/lib/firebase` for database operations

Always maintain the existing patterns when adding new code or features.
