# HR Management App

A modern, full-featured HR management application built with React, TypeScript, and Vite. This application provides comprehensive tools for managing job postings, candidate assessments, and recruitment workflows.

## 🚀 Features

### Job Management
- **Job Postings**: Create, edit, and manage job listings
- **Job Status**: Track active and archived positions
- **Job Organization**: Tag and categorize jobs for easy management
- **Job Statistics**: View analytics and metrics for each position

### Candidate Management
- **Candidate Profiles**: Comprehensive candidate information and contact details
- **Pipeline Tracking**: Visual board view for candidate stages (Applied → Screen → Tech → Offer → Hired/Rejected)
- **Candidate Notes**: Add and manage notes for each candidate
- **Drag & Drop**: Intuitive drag-and-drop interface for moving candidates between stages

### Assessment System
- **Assessment Builder**: Create custom assessments with multiple question types
- **Question Types**: Support for single-choice, multi-choice, short-text, long-text, numeric, and file-upload questions
- **Conditional Logic**: Create dynamic assessments with conditional questions
- **Response Management**: Track and review candidate assessment responses

### User Experience
- **Modern UI**: Clean, responsive design with dark/light theme support
- **Real-time Updates**: Live data synchronization across the application
- **Toast Notifications**: User-friendly feedback for all actions
- **Loading States**: Skeleton loaders for better perceived performance

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation

### Database & Storage
- **Dexie** - IndexedDB wrapper for client-side storage
- **Dexie React Hooks** - React integration for Dexie

### UI & Interactions
- **@dnd-kit** - Drag and drop functionality
- **CSS Modules** - Scoped styling
- **Custom Components** - Reusable UI components

### Development Tools
- **ESLint** - Code linting and formatting
- **MSW (Mock Service Worker)** - API mocking for development
- **Faker.js** - Generate realistic test data

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HR-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CandidateNotes.tsx
│   ├── JobCard.tsx
│   ├── JobEditorModal.tsx
│   ├── JobsList.tsx
│   ├── QuestionEditor.tsx
│   └── ...
├── pages/              # Application pages/routes
│   ├── JobsPage.tsx
│   ├── CandidatesPage.tsx
│   ├── AssessmentBuilderPage.tsx
│   └── ...
├── db/                 # Database configuration
│   ├── db.ts
│   └── seed.ts
├── hooks/              # Custom React hooks
│   └── useToast.ts
├── types/              # TypeScript type definitions
│   └── assessment.ts
├── mocks/              # API mocking setup
│   ├── browser.ts
│   └── handlers.ts
└── assets/             # Static assets
```

## 🎯 Key Features Explained

### Assessment Builder
Create comprehensive assessments with:
- **Multiple Question Types**: Single choice, multiple choice, text, numeric, and file upload
- **Conditional Logic**: Questions that appear based on previous answers
- **Validation**: Required fields, length limits, and custom validation rules
- **File Uploads**: Support for document and image uploads

### Candidate Pipeline
Visualize the recruitment process with:
- **Stage Management**: Applied → Screen → Tech → Offer → Hired/Rejected
- **Drag & Drop**: Move candidates between stages intuitively
- **Notes System**: Add contextual notes for each candidate
- **Board View**: Kanban-style interface for pipeline management

### Job Management
Comprehensive job posting system with:
- **Job Creation**: Detailed job posting forms
- **Status Tracking**: Active and archived job management
- **Tagging System**: Categorize jobs for better organization
- **Assessment Integration**: Link assessments to specific jobs

## 🔧 Configuration

### Database
The application uses IndexedDB via Dexie for client-side storage. The database schema includes:
- **Jobs**: Job postings and metadata
- **Candidates**: Candidate information and pipeline status
- **Assessments**: Assessment questions and configuration
- **Assessment Responses**: Candidate answers and submissions

### Mocking
MSW (Mock Service Worker) is configured for development, providing realistic API responses without a backend server.

## 🎨 Theming

The application supports both light and dark themes with a toggle in the UI. Theme preferences are persisted across sessions.

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
