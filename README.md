# IEM Admission System (SWE Project)

## Project Overview
A full‑stack web application that enables applicants to submit admission forms, upload supporting documents, and manage their applications. Administrators can review and approve applicants, after which approved applicants may proceed to payment and slot booking.

The project is composed of:
- **Backend** – Node.js + Express REST API, MongoDB, Cloudinary for document storage.
- **Frontend** – Angular UI with a light‑ocean‑green theme.
- **Deployment** – Backend hosted on Render, frontend hosted on a static site service (e.g., Netlify, Vercel).

## Features
- User registration and login using JWT authentication.
- Applicant dashboard for viewing and editing personal details.
- Document upload (PDF, JPEG, PNG) stored in Cloudinary.
- Admin panel for approving or rejecting applications.
- Payment workflow – a *Proceed to Payment* button appears after approval.
- Health‑check endpoint (`/health`).
- Swagger UI (`/api-docs`).

## Technology Stack
| Layer | Technology |
|-------|------------|
| Backend | Node.js (v24), Express, Mongoose, Cloudinary, Multer |
| Frontend | Angular 18, TypeScript, RxJS |
| Database | MongoDB Atlas |
| CI/CD | Render (backend) – automatic build on push |
| Documentation | Swagger (OpenAPI) |

## Repository Structure
```
SWE_Project/
├─ backend/                # Node/Express API
│   ├─ src/               # Source code
│   │   ├─ config/        # Cloudinary, logger, etc.
│   │   ├─ controllers/   # Business logic (applications, auth)
│   │   ├─ middlewares/   # Auth, validation, upload (Multer)
│   │   ├─ models/        # Mongoose schemas
│   │   ├─ routes/        # Express routers (auth, applications, admin)
│   │   └─ utils/         # ApiError, ApiResponse helpers
│   ├─ .env.example       # Environment variable template
│   └─ package.json       # Dependencies & scripts
├─ frontend/               # Angular UI
│   ├─ src/app/           # Angular modules & components
│   ├─ src/environments/  # environment.ts / environment.prod.ts
│   └─ angular.json       # Build configuration (fileReplacements for prod)
├─ README.md               # Project documentation (this file)
└─ .gitignore
```

## Setup Instructions
### Prerequisites
- **Node.js** (v24 recommended) – https://nodejs.org/
- **npm** (included with Node) or **pnpm**
- **Angular CLI** (`npm i -g @angular/cli`)
- A **MongoDB Atlas** cluster (free tier is sufficient)
- A **Cloudinary** account (for document storage)

### 1. Clone the Repository
```bash
git clone https://github.com/Supriyo-Giri/IEM-Admission-System-SWE-Project
cd SWE_Project
```

### 2. Backend Setup
```bash
cd backend
# Install dependencies
npm install   # or pnpm install

# Create a .env file based on the example
cp .env.example .env
```
Edit the `.env` file and provide the required values:
```
PORT=5000                       # optional – defaults to 5000
MONGODB_URI=<your MongoDB URI>
JWT_SECRET=<your secret>
CLOUDINARY_CLOUD_NAME=<cloud name>
CLOUDINARY_API_KEY=<api key>
CLOUDINARY_API_SECRET=<api secret>
```
#### Run locally
```bash
npm run dev   # uses nodemon for automatic restarts
```
The API will be available at `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install   # or pnpm install
```
The environment files are already present:
- `src/environments/environment.development.ts` – points to `http://localhost:5000/api`
- `src/environments/environment.prod.ts` – points to the Render URL `https://iem-admission-system-swe-project.onrender.com/api`
#### Run locally (development mode)
```bash
ng serve
```
Open `http://localhost:4200` in a browser.

### 4. Build for Production (frontend)
```bash
ng build --prod   # output placed in the dist/ directory
```
Deploy the contents of `dist/` to any static‑hosting provider (e.g., Netlify, Vercel) or serve them via a static file server.

## Deploying the Backend to Render
1. Sign in to Render and create a **New Web Service**.
2. Connect the GitHub repository (or push a new commit to trigger a rebuild).
3. Set the **Build Command** to `npm install` (default).
4. Set the **Start Command** to `node src/server.js`.
5. Add the same environment variables from your local `.env` into Render's **Environment** settings.
6. Save the configuration; Render will build and deploy the service.
The health endpoint will be reachable at `https://<service>.onrender.com/health`.

## API Documentation
Swagger UI is available at:
```
GET /api-docs
```
Key endpoints include:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/applications/` – submit admission form
- `GET /api/applications/my-application` – fetch logged‑in applicant data
- `POST /api/applications/upload?docType=ID%20Proof` – upload a document (multipart/form‑data)
- `GET /api/admin/applications` – list applications for admin review
- `PATCH /api/admin/applications/:id/approve` – approve an applicant (enables payment button on UI)

## Testing
Backend tests can be executed with **Jest** or **Mocha**. If a test script is defined in `package.json`, run:
```bash
npm test
```
Frontend tests use the Angular CLI default (`ng test`).

## Contributing Guidelines
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/description`).
3. Commit changes with clear messages.
4. Open a Pull Request targeting the `main` branch.
5. Ensure linting passes and all tests succeed before merging.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact
Maintainer: Supriyo Giri – `supriyogiri372@gmail.com`

Feel free to open an issue for bug reports or feature requests.