# 🚀 CareerAI — Intelligent Resume & Career Planner

A full-stack MERN application powered by Groq AI (FREE) that helps users improve their resumes, analyze skill gaps, and plan personalized career paths.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **Resume Upload** | Drag & drop PDF/TXT upload with real-time parsing |
| 🤖 **ATS Score Analysis** | Detailed ATS breakdown: formatting, keywords, sections, readability |
| 🎯 **Skill Gap Detection** | Extracted skills vs missing skills vs trending skills |
| 📚 **Course Recommendations** | 6 personalized courses from Coursera, Udemy, edX, LinkedIn Learning |
| 💼 **Job Role Matching** | 5+ job matches with match score, salary, apply links |
| 🗺️ **Career Roadmap** | 4-phase interactive roadmap with status tracking |
| 🔐 **Authentication** | JWT-based login/register with secure bcrypt hashing |
| 📊 **Dashboard** | Stats, resume history, skill overview |

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** — REST API server
- **MongoDB** + **Mongoose** — Database & ODM
- **Groq API** — FREE AI analysis (llama-3.3-70b-versatile)
- **Multer** — File upload handling
- **pdf-parse** — PDF text extraction
- **JWT** + **bcryptjs** — Authentication & password hashing

### Frontend
- **React 18** + **Vite** — UI framework & build tool
- **React Router v6** — Client-side routing
- **Axios** — HTTP client with interceptors
- **react-dropzone** — Drag & drop file upload
- **react-hot-toast** — Toast notifications
- **lucide-react** — Icon library

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB running locally or MongoDB Atlas URI
- Groq API Key (FREE) — get one at https://console.groq.com

### 1. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see below)
npm run dev
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Open http://localhost:5173

---

## 🔑 Environment Variables (backend/.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/career-ai
JWT_SECRET=your_random_secret_key
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Getting your GROQ_API_KEY:**
1. Go to https://console.groq.com
2. Sign up for free
3. Go to API Keys → Create API Key
4. Copy the key (starts with gsk_...)

**Groq Free Tier Limits:**
- 14,400 requests/day
- 6,000 tokens/minute
- Completely FREE, no credit card needed

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/resume/upload | Upload & analyze resume |
| GET | /api/resume | List all resumes |
| GET | /api/resume/:id | Get resume + analysis |
| DELETE | /api/resume/:id | Delete resume |
| PUT | /api/resume/:id/roadmap/:phase | Update roadmap phase |

### Career
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/career/roadmap | Generate roadmap |
| POST | /api/career/jobs | AI job search |
| GET | /api/career/stats | Dashboard stats |

---

Built with ⚡ MERN + Groq AI (llama-3.3-70b-versatile)
