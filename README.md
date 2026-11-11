# IEM Admission System (SWE Project)

## 📖 Project Overview
A full‑stack web application that allows applicants to submit admission forms, upload supporting documents, and manage their applications. Admin users can review and approve applicants, while approved applicants can proceed to payment and slot booking.

The project consists of:
- **Backend** – Node.js + Express REST API, MongoDB, Cloudinary for document storage.
- **Frontend** – Angular (Angular CLI) UI with a professional light‑ocean‑green theme.
- **Deployment** – Backend hosted on Render, frontend hosted on any static site host (e.g., Netlify, Vercel).

## ✨ Features
- User registration / login (JWT‑based authentication).
- Applicant dashboard to view and edit personal details.
- Document upload (PDF/JPEG/PNG) stored in Cloudinary.
- Admin panel to approve/reject applications.
- Payment flow – once approved, a **Proceed to Payment** button appears.
- Health check endpoint (`/health`).
- Swagger UI (`/api-docs`).

## 🛠️ Tech Stack
| Layer | Technology |
|-------|------------|
| Backend | Node.js (v24), Express, Mongoose, Cloudinary, Multer |
| Frontend | Angular 18, TypeScript, RxJS |
| Database | MongoDB Atlas |
| CI/CD | Render (backend) – auto‑build on push |
| Docs | Swagger (OpenAPI) |

---

## 📂 Repository Structure
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
│   └─ angular.json       # Build config (fileReplacements for prod)
├─ README.md               # **You are reading it**
└─ .gitignore
```
---

## ⚙️ Setup Instructions
### Prerequisites
- **Node.js** (v24 recommended) – https://nodejs.org/
- **npm** (comes with Node) or **pnpm**
- **Angular CLI** (`npm i -g @angular/cli`)
- A **MongoDB Atlas** cluster (free tier works)
- A **Cloudinary** account (for document storage)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Supriyo-Giri/IEM-Admission-System-SWE-Project
cd SWE_Project
```

### 2️⃣ Backend Setup
```bash
cd backend
# Install dependencies
npm install   # or pnpm install

# Create a .env file based on the example
cp .env.example .env
```
Edit `.env` and provide the following values:
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
npm run dev   # uses nodemon, hot‑restarts on changes
```
The API will be available at `http://localhost:5000`.

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install   # or pnpm install
```
Create environment files (they already exist):
- `src/environments/environment.development.ts` – points to `http://localhost:5000/api`
- `src/environments/environment.prod.ts` – points to the Render URL `https://iem-admission-system-swe-project.onrender.com/api`
#### Run locally (development mode)
```bash
ng serve
```
Open `http://localhost:4200` in a browser.

### 4️⃣ Build for Production (frontend)
```bash
ng build --prod   # outputs to dist/
```
Deploy the generated `dist/` folder to any static‑host (e.g., Netlify, Vercel) **or** serve it via a simple static file server.

---

## 🚀 Deploying the Backend to Render
1. Sign in to Render and create a **New Web Service**.
2. Connect the GitHub repo (or push a new commit to trigger a rebuild).
3. Set the **Build Command** to `npm install` (the default).
4. Set the **Start Command** to `node src/server.js`.
5. Add the same environment variables from your local `.env` into Render's **Environment** settings.
6. Save and let Render build & deploy. The health endpoint will be reachable at `https://<your‑service>.onrender.com/health`.

The frontend can be deployed separately; just make sure the production environment file points to the Render URL.

---

## 📚 API Documentation
The Swagger UI is available at:
```
GET /api-docs
```
It describes all routes, request bodies, and response schemas.

Key endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/applications/` – submit admission form
- `GET /api/applications/my-application` – fetch logged‑in applicant data
- `POST /api/applications/upload?docType=ID%20Proof` – upload a document (multipart/form‑data)
- `GET /api/admin/applications` – admin list of applications
- `PATCH /api/admin/applications/:id/approve` – approve an applicant (adds payment button on UI)

---

## 🧪 Testing
Backend tests can be added with **Jest** or **Mocha**; a simple example using **supertest** is already in the repo under `backend/tests/` (if present). Run:
```bash
npm test   # configure a test script in package.json if not present
```
Frontend tests use the Angular CLI default (`ng test`).

---

## 🤝 Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome‑feature`).
3. Commit your changes with clear messages.
4. Open a Pull Request targeting `main`.
5. Ensure linting passes (`npm run lint` if configured) and all tests succeed.

---

## 📄 License
This project is licensed under the MIT License – see the `LICENSE` file for details.

---

## 🙋‍♂️ Contact
Maintainer: **Supriyo Giri** – `supriyogiri372@gmail.com`

Feel free to open an issue for bugs or feature requests!

