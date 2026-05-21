# Latecomers AI

Monorepo with a FastAPI backend and a Create React App (CRACO) frontend.

## Structure
- backend/ — FastAPI API
- frontend/ — CRA + CRACO UI

## Local development
Backend:
1. Create a virtualenv and install deps: `pip install -r backend/requirements.txt`
2. Copy `backend/.env.example` to `backend/.env` and set values.
3. Run: `uvicorn server:app --reload --host 0.0.0.0 --port 8000` (from `backend/`)

Frontend:
1. Copy `frontend/.env.example` to `frontend/.env` and set values.
2. Install deps: `yarn install` (from `frontend/`)
3. Run: `yarn start`

## Deployment
### Backend (AWS EC2)
1. Set environment variables (recommended via systemd or your process manager). Required for production:
   - `MONGO_URL` or `MONGODB_URI`
   - `CORS_ORIGINS` (set to your Vercel domain, comma-separated)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
   - `SECURE_COOKIES=true` (when served over HTTPS)
2. Install deps and run: `uvicorn server:app --host 0.0.0.0 --port 8000`
3. Put a reverse proxy (nginx) in front if needed, and open port 8000 or proxy to it.

### Frontend (Vercel)
1. Set Vercel environment variables:
   - `REACT_APP_BACKEND_URL` (your EC2 API base URL)
   - `REACT_APP_GOOGLE_CLIENT_ID`
   - `REACT_APP_GOOGLE_MAPS_API_KEY` (optional, enables maps features)
2. Deploy. `frontend/vercel.json` enables SPA routing and sets the build output to `build/`.
