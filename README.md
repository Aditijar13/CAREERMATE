#  CareerMate – AI Resume Analyzer & Career Planner

🔗 **Live Demo:** *(https://careermate-tr3v.onrender.com)*

CareerMate is a **full-stack MERN application** that analyzes resumes using AI, identifies skill gaps, and provides personalized career guidance including job matches, courses, and learning roadmaps.

---

##  Project Overview

This project combines **AI + Full Stack Development** to help users:

* Analyze resumes using ATS-based scoring
* Identify missing and trending skills
* Get personalized career recommendations
* Track progress through structured roadmaps

It demonstrates real-world integration of **AI APIs with MERN stack applications**.

---

##  Features

*  **Resume Upload**

  * Upload PDF/TXT resumes with parsing

*  **AI Resume Analysis**

  * ATS score breakdown (keywords, formatting, readability)

*  **Skill Gap Detection**

  * Compare existing vs required vs trending skills

*  **Course Recommendations**

  * Personalized learning suggestions

*  **Job Role Matching**

  * Role suggestions with match scores

*  **Career Roadmap**

  * Step-by-step structured learning path

*  **Authentication**

  * Secure login/register using JWT & bcrypt

*  **Dashboard**

  * Resume history and insights

---

##  Tech Stack

### Frontend

* React.js (Vite)
* React Router
* Axios
* React Dropzone
* React Hot Toast
* Lucide Icons

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### AI & Tools

* Groq API (LLaMA-based models)
* Multer (File Uploads)
* pdf-parse (Resume Parsing)
* JWT & bcrypt (Authentication)

---

##  Folder Structure

```
CareerMate/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   └── public/
│
├── package.json
└── README.md
```

---

##  API Routes

### Authentication

| Method | Route              | Description      |
| ------ | ------------------ | ---------------- |
| POST   | /api/auth/register | Register user    |
| POST   | /api/auth/login    | Login user       |
| GET    | /api/auth/me       | Get current user |

### Resume

| Method | Route              | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | /api/resume/upload | Upload & analyze resume |
| GET    | /api/resume        | Get all resumes         |
| GET    | /api/resume/:id    | Get resume details      |
| DELETE | /api/resume/:id    | Delete resume           |

### Career

| Method | Route               | Description      |
| ------ | ------------------- | ---------------- |
| POST   | /api/career/roadmap | Generate roadmap |
| POST   | /api/career/jobs    | Get job matches  |

---

##  Installation & Setup

###  Clone the repository

```bash
git clone https://github.com/Aditijar13/CAREERMATE.git
cd CAREERMATE
```

###  Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_api_key
CLIENT_URL=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

---

###  Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

###  Open in browser

```
http://localhost:5173
```

---

##  Key Learnings

* Integrated **AI APIs with MERN stack**
* Built a **real-world resume analyzer system**
* Implemented **JWT authentication & protected routes**
* Handled **file uploads and parsing**
* Designed **scalable backend architecture**
* Created **interactive frontend UI**

---

##  Future Improvements

* Real-time resume editing suggestions
* AI-powered interview preparation
* Resume templates builder
* Advanced analytics dashboard

---

##  Author

**Aditi Jar**

* GitHub: https://github.com/Aditijar13

---

##  License

This project is licensed under the **MIT License**.
