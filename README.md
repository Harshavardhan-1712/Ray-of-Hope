# 🌿 Ray of Hope — Full-Stack Mental Wellness Platform

A production-ready MERN stack mental wellness app with AI chat, articles, videos, podcasts, expert booking, mood tracking, and journaling.

---

## 🏗 Project Structure

```
ray-of-hope/
├── src/                        ← React frontend
│   ├── components/
│   │   ├── Navbar.jsx          ← Sticky nav with auth
│   │   ├── AuthModal.jsx       ← Login / Register modal
│   │   └── ui/Spinner.jsx      ← Loading spinner
│   ├── context/
│   │   ├── AuthContext.js      ← Global auth state (JWT)
│   │   └── ToastContext.js     ← Toast notifications
│   ├── hooks/
│   │   └── useApi.js           ← Generic data-fetching hook
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ChatPage.jsx        ← Sage AI (API + local fallback)
│   │   ├── ArticlesPage.jsx    ← API + search + filter
│   │   ├── VideosPage.jsx      ← API + YouTube modal
│   │   ├── PodcastsPage.jsx    ← API + search + filter
│   │   ├── ExpertsPage.jsx     ← API + appointment booking
│   │   └── DashboardPage.jsx   ← Moods, journals, appointments
│   ├── services/
│   │   └── api.js              ← Axios instance + all API functions
│   └── data/
│       └── mockData.js         ← Fallback data (used if backend offline)
│
└── backend/
    ├── server.js               ← Express entry point
    ├── seed.js                 ← DB seed script
    ├── config/db.js            ← MongoDB Atlas connection
    ├── models/                 ← Mongoose schemas
    │   ├── User.js
    │   ├── Article.js
    │   ├── Video.js
    │   ├── Podcast.js
    │   ├── Expert.js
    │   ├── Mood.js
    │   ├── Journal.js
    │   └── Appointment.js
    ├── controllers/            ← Business logic
    ├── routes/                 ← Express routers
    ├── middleware/
    │   ├── auth.js             ← JWT protect + adminOnly
    │   └── errorHandler.js     ← Global error handler
    └── utils/generateToken.js
```

---

## 🚀 Quick Start

### 1. Clone & set up environment

```bash
git clone <your-repo>
cd ray-of-hope
```

**Frontend** — create `.env.local` in root:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Backend** — create `.env` in `backend/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ray-of-hope
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:3000
```

### 2. Install dependencies

```bash
# Frontend
npm install

# Backend
cd backend && npm install
```

### 3. Seed the database

```bash
cd backend
node seed.js
```

### 4. Run in development

```bash
# Terminal 1 – backend
cd backend && npm run dev

# Terminal 2 – frontend
npm start
```

Open http://localhost:3000

---

## 📡 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login, get JWT |
| GET | `/api/auth/profile` | 🔒 | Get profile |
| GET | `/api/articles` | — | List articles (filter, search, paginate) |
| GET | `/api/videos` | — | List videos |
| GET | `/api/podcasts` | — | List podcasts |
| GET | `/api/experts` | — | List experts |
| POST | `/api/chat` | — | Sage AI response |
| POST | `/api/moods` | 🔒 | Log mood |
| GET | `/api/moods` | 🔒 | Get mood history |
| POST | `/api/journals` | 🔒 | Create journal |
| GET | `/api/journals` | 🔒 | List journals |
| PUT | `/api/journals/:id` | 🔒 | Update journal |
| DELETE | `/api/journals/:id` | 🔒 | Delete journal |
| POST | `/api/appointments` | 🔒 | Book appointment |
| GET | `/api/appointments` | 🔒 | List appointments |
| PUT | `/api/appointments/:id/cancel` | 🔒 | Cancel appointment |

---

## 🌐 Deployment

### Frontend → Vercel

```bash
npm run build
# Push to GitHub → Import in Vercel
# Set env var: REACT_APP_API_URL=https://your-backend.onrender.com/api
```

### Backend → Render

1. Create new **Web Service** on render.com
2. Connect your GitHub repo, set root to `backend/`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `.env`

---

## 🔌 AI Integration

The chat endpoint (`POST /api/chat`) is plug-and-play:

**OpenAI** — uncomment the OpenAI block in `backend/controllers/chatController.js`:
```bash
cd backend && npm install openai
# Add to .env: OPENAI_API_KEY=sk-...
```

**Gemini** — uncomment the Gemini block:
```bash
cd backend && npm install @google/generative-ai
# Add to .env: GEMINI_API_KEY=AI...
```

---

## ✨ Features

- 🔐 JWT Authentication (register, login, protected routes)
- 💬 Sage AI Chat (backend API + local keyword fallback)
- 📊 Mood Tracker with history
- 📔 Private Journal (CRUD)
- 📅 Expert Appointment Booking
- 📖 Articles with real-time search + category filter
- 🎥 YouTube Video Library with modal player
- 🎧 Podcast section with search + filter
- 🌙 Dark/light mode (persisted)
- 📱 Fully responsive
- ⚡ Lazy-loaded pages (code splitting)
- 🛡 Helmet, CORS, input validation, JWT middleware
