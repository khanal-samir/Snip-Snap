# Snip-Snap

A modern code snippet sharing platform built with Next.js, TypeScript, and Prisma. Share, manage, and collaborate on code snippets with ease.

## Features

- 🔐 **Authentication System**

  - Secure user authentication
  - Email verification
  - Password recovery

- 📝 **Code Snippet Management**

  - Create and edit code snippets
  - Syntax highlighting
  - Multiple language support
  - Monaco Editor integration

- 🎨 **Modern UI/UX**

  - Responsive design
  - Dark/Light mode
  - Beautiful animations
  - Tailwind CSS styling

- 🔍 **Search and Organization**

  - Search snippets
  - Categorize snippets
  - Tag-based organization

- 🤝 **Collaboration**
  - Share snippets with others
  - Public/Private visibility options
  - User profiles

## Tech Stack

- **Frontend:**

  - Next.js 15
  - React 18
  - TypeScript
  - Tailwind CSS
  - Radix UI Components
  - Monaco Editor
  - TanStack Query

- **Backend:**

  - Next.js API Routes
  - Prisma ORM
  - NextAuth.js
  - Google AI Integration

- **Database:**
  - Prisma with PostgreSQL

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/snip-snap.git
cd snip-snap
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="your-postgresql-url"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── actions/     # Server actions
├── app/         # Next.js app router pages
├── components/  # Reusable UI components
├── hooks/       # Custom React hooks
├── lib/         # Utility functions and configurations
├── providers/   # React context providers
├── schema/      # Zod validation schemas
└── middleware.ts # Next.js middleware
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


