# SkillChecker Frontend

A modern React frontend for the SkillChecker competency tracking application.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **shadcn/ui** for UI components
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Zustand** for state management
- **Axios** for API calls

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api
```

## Project Structure

```
src/
├── components/
│   ├── charts/         # Chart components (Radar, Pie, Progress)
│   ├── common/         # Common components (ProtectedRoute, Skeletons)
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── layouts/            # Layout components (Main, Auth)
├── pages/
│   ├── admin/          # Admin pages
│   ├── auth/           # Login, Register
│   └── student/        # Student pages
├── services/           # API services
├── store/              # Zustand stores
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## Features

### Student Features
- Dashboard with skill radar and progress
- Evidence submission
- Competency tracking
- Profile management

### Admin Features
- Dashboard with analytics
- Student management
- Skill management
- Evaluation system
- Analytics with charts

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```
