# TaskFlow – Team Task Manager

Full-stack app where the **Python backend serves the React frontend**. Deploy as a single Railway service — no env vars needed, no separate frontend service.

## Architecture

```
Railway (1 service)
└── Docker container
    ├── FastAPI backend  →  handles /api/* routes
    └── React (static)  →  handles everything else
```

The single Dockerfile:
1. Builds the React app with Node
2. Copies the `dist/` output into `backend/static/`
3. FastAPI serves `/api/*` as API and everything else as the React app

---

## Deploy on Railway (Simple — just 2 services)

### STEP 1 — Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git
git push -u origin main
```

### STEP 2 — Create Railway Project
Go to [railway.app](https://railway.app) → **New Project → Empty Project**

### STEP 3 — Add PostgreSQL
Click **+ New → Database → PostgreSQL**
Wait for it to provision (~30 seconds)

### STEP 4 — Deploy the App
Click **+ New → GitHub Repo** → select your repo

Railway will find the root `Dockerfile` and build everything automatically.

Go to **Variables tab** and add:
```
DATABASE_URL  →  (copy from the PostgreSQL service's Variables tab)
SECRET_KEY    →  any-random-string-change-this
```

### STEP 5 — Generate a Domain
Settings → Networking → **Generate Domain**

Open the URL — your app is live! ✅

That's it. One service. No frontend/backend URL juggling.

---

## Run Locally

Get a free PostgreSQL from [neon.tech](https://neon.tech) or use the Railway one.

```bash
# Build frontend first
cd frontend
npm install
npm run build
cp -r dist ../backend/static

# Run backend (serves both API + frontend)
cd ../backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set env vars
export DATABASE_URL=your_postgres_url
export SECRET_KEY=localsecret

uvicorn main:app --reload --port 8000
```

Open [http://localhost:8000](http://localhost:8000)

---

## Project Structure

```
team-task-manager/
├── Dockerfile              ← Single build: React + FastAPI
├── frontend/               ← React + Vite (built into backend/static)
│   ├── src/
│   │   ├── pages/          Landing, Login, Signup, Dashboard, Projects, ProjectDetail
│   │   ├── components/     Layout
│   │   ├── context/        AuthContext (JWT)
│   │   └── utils/api.js    Axios — calls /api/* (relative, no URL needed)
│   └── package.json
└── backend/                ← FastAPI
    ├── main.py             Serves API + React static files
    ├── models.py           User, Project, Task, ProjectMember
    ├── schemas.py
    ├── auth_utils.py       JWT + bcrypt
    ├── database.py
    ├── requirements.txt
    └── routers/            auth, projects, tasks, dashboard
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/signup | Register |
| POST | /api/auth/login | Login |
| GET | /api/projects | List my projects |
| POST | /api/projects | Create project |
| POST | /api/projects/:id/members | Add member (admin) |
| DELETE | /api/projects/:id/members/:uid | Remove member (admin) |
| GET | /api/tasks/:project_id | List tasks |
| POST | /api/tasks/:project_id | Create task (admin) |
| PATCH | /api/tasks/:task_id | Update task |
| DELETE | /api/tasks/:task_id | Delete task (admin) |
| GET | /api/dashboard | Stats |
