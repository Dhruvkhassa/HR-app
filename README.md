# HR App - Fixed Version

A modern HR management application built with React, TypeScript, and Vite, deployed on Vercel.

## Features

- **Job Management**: Create, edit, and manage job postings
- **Candidate Tracking**: Track candidates through different stages
- **Assessment Builder**: Create custom assessments for job applications
- **Board View**: Kanban-style candidate management
- **Dark Theme**: Modern, responsive UI

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: CSS Modules
- **Database**: IndexedDB (Dexie) for local development
- **API**: Vercel Serverless Functions for production
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/hr-app-fixed.git
cd hr-app-fixed
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Production Build

```bash
npm run build
npm run preview
```

## API Routes

The application uses the following API endpoints:

- `GET /api/jobs` - List jobs with pagination and filtering
- `GET /api/jobs/:id` - Get specific job details
- `PATCH /api/jobs/:id` - Update job status
- `GET /api/candidates` - List candidates with pagination
- `GET /api/candidates/:id` - Get specific candidate details
- `PATCH /api/candidates/:id` - Update candidate stage/notes

## Development vs Production

- **Development**: Uses MSW (Mock Service Worker) with IndexedDB for data persistence
- **Production**: Uses Vercel serverless functions with mock data

## Deployment

This app is configured for automatic deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically build and deploy on every push to main
3. The API routes will be available at `/api/*`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── db/                 # Database configuration and seeding
├── mocks/              # MSW handlers for development
├── types/              # TypeScript type definitions
└── assets/             # Static assets

api/                    # Vercel serverless functions
├── jobs.js            # Jobs API endpoint
└── candidates.js      # Candidates API endpoint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details