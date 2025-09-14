# Smart Student Hub

## Project Overview
Smart Student Hub is a comprehensive digital platform designed for Higher Education Institutions (HEIs) to centrally manage and track student achievements, activities, and portfolios. This project addresses Smart India Hackathon 2025 Problem Statement #25093.

## Problem Statement
**Title:** Centralised Digital Platform for Comprehensive Student Activity Record in HEIs

**Background:** Despite increasing digitization in education, student achievements ranging from academic excellence to participation in curricular and extracurricular activities remain scattered across various departments or lost in paper-based records. There is no centralized digital platform that enables institutions to document, track, and showcase a student's complete profile.

## Key Features

### For Students
- **Dynamic Dashboard:** Real-time overview of academic performance and activities
- **Achievement Tracker:** Upload and manage academic and extracurricular achievements
- **Digital Portfolio:** Auto-generated downloadable portfolio in PDF format
- **Activity Management:** Track conferences, workshops, certifications, and competitions
- **Progress Monitoring:** View approval status and achievement history

### For Teachers/Faculty
- **Approval Panel:** Review and approve student-submitted achievements
- **Student Oversight:** Monitor mentored students' progress
- **Bulk Operations:** Efficiently manage multiple approvals
- **Verification System:** Maintain credibility through systematic validation
- **Reporting Tools:** Generate student progress reports

### For Administrators
- **System Analytics:** Comprehensive institutional data analysis
- **User Management:** Manage students, faculty, and system users
- **NAAC Compliance:** Generate reports for accreditation processes
- **Institutional Reports:** Data for AICTE, NIRF, and internal evaluations
- **Dashboard Overview:** System-wide statistics and insights

## Technology Stack
- **Frontend:** React + Vite
- **Build Tool:** Vite with HMR and ESLint rules
- **Plugins:** 
  - [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
  - [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
