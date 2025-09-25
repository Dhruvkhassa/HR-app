# HR Management App

A contemporary, fully-featured HR management application developed using React, TypeScript, and Vite.
 This application offers a wide range of tools to help manage job listings, candidate evaluations, and recruitment processes.

## 🚀 Features

### Job Management
- **Job Postings**: The ability to create, edit, and manage job listings
- **Job Status**: Ability to track active and archived job positions
- **Job Organization**: Ability to tag and classify jobs for better management
- **Job Statistics**: View performance metrics and analytics for each job

### Candidate Management
- **Candidate Profiles**: Comprehensive information and contact details for each candidate
- **Pipeline Tracking**: A visual board that displays the stages of a candidate (Applied → Screen → Tech → Offer → Hired/Rejected)
- **Candidate Notes**: Add and manage notes for each candidate
- **Drag & Drop**: Intuitive drag-and-drop interface to move candidates between stages

### Assessment System
- **Assessment Builder**: Create custom assessments with various question types
- **Question Types**: Includes options for single-choice, multiple-choice, short-text, long-text, numeric, and file-upload questions
- **Conditional Logic**: Allows for dynamic assessments with questions that appear based on previous responses
- **Response Management**: Track and review candidate assessments

### User Experience
- **Modern UI**: Clean and responsive design with support for both dark and light themes
- **Real-time Updates**: Live data updates across the entire application
- **Toast Notifications**: Friendly feedback messages for user actions
- **Loading States**: Skeleton loaders to enhance perceived performance

## 🛠️ Tech Stack

### Frontend
- **React 19**: A modern version of React with the latest features
- **TypeScript**: Ensures type safety during development
- **Vite**: A fast development tool and build system
- **React Router DOM**: For client-side routing
- **React Hook Form**: For managing forms along with validation
- **Zod**: For schema validation

### Database & Storage
- **Dexie**: A wrapper for IndexedDB for client-side data storage
- **Dexie React Hooks**: Integration of Dexie with React for easier data handling

### UI & Interactions
- **@dnd-kit**: Provides drag and drop functionality
- **CSS Modules**: For scoped and reusable styles
- **Custom Components**: Reusable UI elements created specifically for the application

### Development Tools
- **ESLint**: For code linting and formatting
- **MSW (Mock Service Worker)**: For simulating API calls during development
- **Faker.js**: For generating realistic test data

## 📦 Installation

1. **
Clone the repository**
 ```bash
 git clone 
 cd HR-app
 ```

2. **
Install dependencies**
 ```bash
 npm install
 ```

3. **
Start the development server**
 ```bash
 npm run dev
 ```

4. **
Open your browser**
 Visit `https://hr-app-lkpc-jw9xdg62e-dhruvkhassas-projects.vercel.app/` to view the application

## 🚀 Available Scripts

- `npm run dev` - Initialize the development server
- `npm run build` - Generate the production build
- `npm run preview` - View the production build in a local server
- `npm run lint` - Run code linting

## 📁 Project Structure

```
src/
├── components/ # Reusable UI components
│ ├── CandidateNotes.tsx
│ ├── JobCard.tsx
│ ├── JobEditorModal.tsx
│ ├── JobsList.tsx
│ ├── QuestionEditor.tsx
│ └── ...
├── pages/ # Application pages/routes
│ ├── JobsPage.tsx
│ ├── CandidatesPage.tsx
│ ├── AssessmentBuilderPage.tsx
│ └── ...
├── db/ # Database setup
│ ├── db.ts
│ └── seed.ts
├── hooks/ # Custom React hooks
│ └── useToast.ts
├── types/ # TypeScript interfaces
│ └── assessment.ts
├── mocks/ # Mock API setup
│ ├── browser.ts
│ └── handlers.ts
└── assets/ # Static files
```

## 🎯 Key Features Explained

### Assessment Builder
Create detailed assessments that include:
- **Multiple Question Types**: Options such as single choice, multiple choice, text input, numeric input, and file uploads
- **Conditional Logic**: Display questions based on the answers to previous ones
- **Validation**: Enforce required fields, set limits on text input, and apply custom validation rules
- **File Uploads**: Support for uploading documents and images

### Candidate Pipeline
Visualize the candidate selection process with:
- **Stage Management**: Journey from Applied → Screen → Tech → Offer → Hired/Rejected
- **Drag & Drop**: Move candidates between stages using drag and drop
- **Notes System**: Add meaningful notes for each candidate
- **Board View**: A kanban-style layout for managing the recruitment pipeline

### Job Management
Manage job postings with detailed tools such as:
- **Job Creation**: Detailed forms for creating job listings
- **Status Tracking**: Track the status of active and archived jobs
- **Tagging System**: Categorize jobs for easier organization
- **Assessment Integration**: Link assessments to specific jobs

## 🔧 Configuration

### Database
The app uses IndexedDB via Dexie for client-side storage. The da
tabase includes:
- **Jobs**: Information and metadata for job postings
- **Candidates**: Information and pipeline status for each candidate
- **Assessments**: Configuration and question data
- **Assessment Responses**: Submissions and answers from candidates

### Mocking
MSW (Mock Service Worker) is set up for development, allowing for realistic API responses without a backend

## 🎨 Theming

The application supports both light and dark themes with a toggle in the UI. The use
r's preferred theme is remembered between sessions.


## 📱 Responsive Design

The application is fully responsive and works well on:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the 
repository
2. Create a 
new branch for your feature (`git checkout -b feature/amazing-feature`)
3. Make your
 changes and commit them (`git commit -m 'Add some amazing feature'`)
4. Push your
 changes to the branch (`git push origin feature/amazing-feature`)
5. Submit a 
Pull Request

## 📄 License

This project is released under the MIT License - please see the LICENSE file for more details

## 🆘 Support

If you face any issues or have questions, please:
1. Check exist
ing issues
2. Create a ne
w issue with detailed information
3. Include ste
ps to reproduce any bugs

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
