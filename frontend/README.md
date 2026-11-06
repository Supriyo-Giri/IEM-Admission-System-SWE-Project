# IEM Admissions Portal - Frontend

A full-featured Angular application for the **Institute of Engineering & Management (IEM) Admissions Management System**.

## Features & Pages

### 1. Public & Navigation
- **Home (`/`)**: Hero section, programs overview (CSE, CSE AI/ML, CSE IOTCSBT, CSE CyberSecurity), admissions procedure steps, and key statistics.
- **Top Navbar & Footer**: Dynamic navigation links responding to authentication status and user roles, user profile badge, and mobile responsive menu.
- **Floating Toast Alerts**: Real-time notifications for success, errors, warnings, and information.

### 2. Authentication
- **Sign In (`/login`)**: Secure JWT authentication with session persistence, password visibility toggle, error handling, and demo shortcuts for quick testing.
- **Register (`/register`)**: Account creation with first/last name, email, role selection (`applicant` or `admin`), and password confirmation validation.

### 3. Applicant Portal (Role: `applicant`)
- **Admission Application Form (`/apply`)**: Comprehensive form capturing personal details (full name, DOB, phone, address), academic records (10th %, 12th %, WBJEE/JEE ranks), and stream selection with client-side validation.
- **Applicant Dashboard (`/applicant/dashboard` or `/my-application`)**:
  - Live admission status tracker with contextual alerts (`Submitted`, `Under Review`, `Approved`, `Rejected`).
  - Personal profile & academic score cards.
  - **Document Upload Center**: Direct Cloudinary document uploader supporting categories (Class 10/12 marksheets, rank cards, ID proofs) with link previews to inspect uploaded documents.

### 4. Administrator Portal (Role: `admin`)
- **Admin Dashboard (`/admin/dashboard`)**:
  - Admission metrics: Total applicants, Approved count, Pending review, Rejected.
  - Department stream breakdown with visual percentage progress bars.
  - Recent candidate submissions table with instant quick-action approval buttons.
- **Candidate Applications List (`/admin/applications`)**:
  - Search applicants by custom Application ID (e.g. `IEM-2026-1001`).
  - Filter by Admission Status (`Submitted`, `Under Review`, `Approved`, `Rejected`).
  - Filter by Engineering Stream (`CSE`, `CSE AI/ML`, `CSE IOTCSBT`, `CSE CyberSecurity`).
  - Pagination controls and quick decision buttons.
- **Application Detail & Decision View (`/admin/applications/:id`)**:
  - Complete candidate dossier including full personal profile, academic marks, and entrance ranks.
  - Cloudinary document viewer with one-click direct file inspection.
  - Status management control panel: Approve, Put Under Review, Reject, or Reset.

---

## Getting Started

### 1. Start the Backend Server
```bash
cd backend
npm install
npm run dev
# Backend runs on http://localhost:5000
```

### 2. Start the Angular Frontend
```bash
cd frontend
npm install
npm start
# Frontend runs on http://localhost:4200
```

### 3. Production Build & Test
```bash
# Build production bundle
npm run build

# Run unit tests
npm test -- --watch=false
```
