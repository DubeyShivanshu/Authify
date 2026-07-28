# Authify

A MERN app demonstrating signup, login, and a protected dashboard using
a short-lived **access token** + long-lived **refresh token** pattern.

## Architecture

**Flow:**
1. User signs up / logs in → backend creates an **access token** (15 min, JWT) and a
   **refresh token** (7 days, JWT).
2. Access token is returned in the JSON response and stored in the frontend's
   `localStorage`, then attached to every API request as `Authorization: Bearer <token>`.
3. Refresh token is set as an **httpOnly, secure, sameSite=strict cookie** — never
   exposed to JavaScript, which protects it from XSS attacks. The browser sends it
   automatically on requests to the backend.
4. When an access token expires, the frontend's axios interceptor automatically calls
   `POST /api/auth/refresh` (which reads the cookie), gets a new access token, and
   retries the original request — the user never notices.
5. On logout, the specific refresh token is removed from the user's record in MongoDB
   (so it can no longer be used) and the cookie is cleared.

**Why this split?**
- Access token in memory/localStorage = usable by JS, but short-lived, so theft has a
  small blast radius.
- Refresh token in httpOnly cookie = invisible to JS (XSS-safe), but only usable to
  mint new access tokens, not to call protected routes directly.

**Stack:**
- Frontend: React (Vite) + React Router + Axios
- Backend: Node.js + Express + JWT + bcryptjs
- Database: MongoDB (Atlas)

**Suggested deployment:**
- Frontend → Vercel (fast, free, great for Vite/React static builds)
- Backend → Render (free tier supports long-running Node servers, unlike serverless
  platforms which complicate cookie-based auth)
- Database → MongoDB Atlas free cluster (managed, no server maintenance)

## Local Setup

### Backend
```bash
cd backend
cp .env.example 
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example 
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Deploying

1. **MongoDB Atlas**: create a free cluster → get connection string → add to backend `.env` as `MONGO_URI`.
2. **Backend on Render**: New Web Service → connect repo → root dir `backend` → build command `npm install` → start command `npm start` → add the same env vars from `.env.example` (use your live frontend URL for `CLIENT_URL`).
3. **Frontend on Vercel**: New Project → root dir `frontend` → add `VITE_API_URL` env var pointing to your Render backend URL + `/api/auth`.
4. Redeploy backend once you have the final frontend URL, since `CLIENT_URL` must match exactly for cookies/CORS to work.

## API Routes

| Method | Route | Auth required | Purpose |
|---|---|---|---|
| POST | /api/auth/signup | No | Create account, returns access token + sets refresh cookie |
| POST | /api/auth/login | No | Log in, returns access token + sets refresh cookie |
| POST | /api/auth/refresh | Cookie | Issues a new access token |
| POST | /api/auth/logout | Cookie | Revokes refresh token, clears cookie |
| GET | /api/auth/dashboard | Bearer token | Example protected route |
