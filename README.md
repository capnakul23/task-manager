# TaskFlow – Team Task Manager

A full-stack team task management app built with React + Vite (frontend) and FastAPI + PostgreSQL (backend).

## Features
- JWT Authentication (Signup / Login)
- Project creation with Admin/Member roles
- Kanban-style task board (To Do / In Progress / Done)
- Task assignment, priority, due dates
- Dashboard with stats and charts
- Role-based access control

---

## Project Structure

```
team-task-manager/
├── backend/
│   ├── main.py          # FastAPI app entrypoint
│   ├── database.py      # SQLAlchemy setup
│   ├── models.py        # DB models
│   ├── schemas.py       # Pydantic schemas
│   ├── auth_utils.py    # JWT + password hashing
│   ├── Procfile         # Railway start command
│   ├── requirements.txt
│   └── routers/
│       ├── auth.py
│       ├── projects.py
│       ├── tasks.py
│       └── dashboard.py
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env.example
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── context/AuthContext.jsx
        ├── utils/api.js
        ├── components/Layout.jsx
        └── pages/
            ├── Login.jsx
            ├── Signup.jsx
            ├── Dashboard.jsx
            ├── Projects.jsx
            └── ProjectDetail.jsx
```

---

## Deploy Backend on Railway

### Step 1 – Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git
git push -u origin main
```

### Step 2 – Create Railway Project
1. Go to [railway.app](https://railway.app) → **New Project**
2. Click **Deploy from GitHub repo** → select your repo
3. Railway will auto-detect Python

### Step 3 – Add PostgreSQL Database
1. In your Railway project, click **+ New** → **Database** → **PostgreSQL**
2. Railway auto-sets `DATABASE_URL` in your environment ✅

### Step 4 – Set Backend Environment Variables
In Railway → your backend service → **Variables** tab, add:
```
SECRET_KEY=some-long-random-string-here
```
> `DATABASE_URL` is already injected automatically by Railway PostgreSQL.

### Step 5 – Set Root Directory
In Railway → Settings → **Root Directory** → set to `backend`

### Step 6 – Deploy
Railway will build and deploy automatically. Copy your backend URL (e.g. `https://xxx.railway.app`).

---

## Deploy Frontend on Vercel

### Step 1 – Import Project
1. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo

### Step 2 – Configure Build Settings
| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### Step 3 – Add Environment Variable
```
VITE_API_URL = https://your-backend-url.railway.app
```
(Use the Railway backend URL from Step 6 above)

### Step 4 – Deploy
Click **Deploy**. Done! ✅

---

## Run Locally (no local PostgreSQL needed)

You can use a free PostgreSQL from [neon.tech](https://neon.tech) or Railway itself.

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo "DATABASE_URL=your_postgres_url_here" > .env
echo "SECRET_KEY=localsecret123" >> .env

uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install

# Create .env.local
echo "VITE_API_URL=http://localhost:8000" > .env.local

npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | /api/auth/signup | Register |
| POST | /api/auth/login | Login |
| GET | /api/projects | List my projects |
| POST | /api/projects | Create project |
| POST | /api/projects/:id/members | Add member |
| DELETE | /api/projects/:id/members/:uid | Remove member |
| GET | /api/tasks/:project_id | List tasks |
| POST | /api/tasks/:project_id | Create task |
| PATCH | /api/tasks/:task_id | Update task |
| DELETE | /api/tasks/:task_id | Delete task |
| GET | /api/dashboard | Dashboard stats |

---

## Tech Stack
- **Frontend**: React 18, Vite, React Router, Axios
- **Backend**: FastAPI, SQLAlchemy, Pydantic v2
- **Database**: PostgreSQL
- **Auth**: JWT (python-jose) + bcrypt
- **Deploy**: Vercel (frontend) + Railway (backend + DB)
# task-manager
