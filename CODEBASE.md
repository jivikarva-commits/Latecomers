# Latecomers AI - Full Codebase Context

> **Read this file first** to understand the entire project before making any changes.

## What is this?

**Latecomers AI** (latecomers.in) is an India-focused career guidance SaaS platform for BPO workers, confused graduates, career switchers, and late starters. Users take a quiz, get AI-powered career matches, follow roadmaps, search institutes, practice mock interviews, and chat with an AI career advisor.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + Tailwind CSS + craco (NOT plain react-scripts) |
| Backend | Python FastAPI + Motor (async MongoDB) |
| Database | MongoDB Atlas (shared between local & production) |
| AI/LLM | AWS Bedrock (Claude 3.5 Sonnet), Emergent LLM fallback |
| Auth | Google OAuth 2.0 |
| College Search | Google Places API + Geocode API |
| Frontend Deploy | Vercel (auto-deploy from main) |
| Backend Deploy | AWS EC2 (manual via Session Manager) |
| Domain | latecomers.in |

---

## Directory Structure

```
Carrier Guidence ai/
├── backend/
│   ├── server.py                # FastAPI app, MongoDB connect, startup seed, cache worker
│   ├── auth_routes.py           # Google OAuth login/logout, session tokens, current_user
│   ├── ai_routes.py             # AI features: onboarding analysis, career test scoring,
│   │                            #   roadmap generation, AI chat, mock interviews, scholarships
│   ├── data_routes.py           # CRUD: careers, colleges, scholarships, profile save
│   ├── llm_client.py            # AWS Bedrock + Emergent LLM wrapper (ask_claude, extract_json)
│   ├── career_catalog.py        # FIELD_CAREERS dict, FIELD_META, TITLE_OVERRIDES,
│   │                            #   ALLOWED_CAREER_SLUGS, build_dynamic_careers() → DYNAMIC_CAREERS
│   ├── seed_data.py             # Seed DB on startup: careers + colleges + scholarships + quiz questions
│   │                            #   Auto-cleanup: deletes careers not in current catalog
│   ├── sync_career_catalog.py   # Utility to sync catalog
│   ├── requirements.txt         # fastapi, motor, boto3, pydantic, python-jose, etc.
│   └── .env                     # MONGO_URI, GOOGLE_CLIENT_ID/SECRET, AWS keys, EMERGENT_KEY
│
├── frontend/
│   ├── public/
│   │   ├── brand/               # latecomers-logo.png, hero-roadmap-illustration.png,
│   │   │                        #   latecomers-logo-cropped.png
│   │   ├── robots.txt, sitemap.xml
│   │   └── index.html
│   ├── src/
│   │   ├── pages/               # All page components (see Routes section below)
│   │   ├── components/
│   │   │   ├── PublicShell.jsx   # Public page wrapper: PublicNav + PublicFooter
│   │   │   ├── Logo.jsx         # Brand logo component (uses latecomers-logo.png)
│   │   │   ├── SEO.jsx          # Meta tags + OG tags
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx    # Authenticated app shell (sidebar + main + bottom tabs)
│   │   │   │   ├── Sidebar.jsx      # Desktop sidebar navigation
│   │   │   │   └── BottomTabBar.jsx # Mobile bottom navigation
│   │   │   └── ui/              # 24+ shadcn/ui components (button, card, dialog, etc.)
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # User auth state, login/logout, auto-refresh
│   │   ├── lib/
│   │   │   ├── api.js           # Axios instance (baseURL from env, withCredentials)
│   │   │   ├── seoSchemas.js    # JSON-LD structured data
│   │   │   └── utils.js         # cn() classname merger
│   │   ├── data/
│   │   │   └── blogPosts.js     # Static blog post data (BLOG_POSTS array)
│   │   ├── hooks/use-toast.js
│   │   ├── services/googleMaps.js
│   │   ├── App.js               # React Router setup
│   │   └── index.js             # Entry point
│   ├── vercel.json              # buildCommand: "CI=false npm run build", rewrites, redirects
│   ├── tailwind.config.js       # Custom theme: brand colors, fonts
│   ├── craco.config.js          # CRA override for Tailwind + @/ path alias
│   ├── jsconfig.json            # @/ → src/ path alias
│   └── package.json             # @craco/craco MUST be in dependencies (not devDeps) for Vercel
```

---

## Frontend Routes

| Route | Component | Auth? | Purpose |
|-------|-----------|-------|---------|
| `/` | Landing.jsx | No | Marketing homepage with hero, journey card, audiences |
| `/about` | About.jsx | No | About page |
| `/careers-explore` | CareersExplore.jsx | No | Browse careers grid with search |
| `/careers/:slug` | CareerDetail.jsx | No | Career detail with AI-generated content |
| `/pricing` | Pricing.jsx | No | Plans: Basic ₹9, Standard ₹99, Premium ₹299 |
| `/blog` | Blog.jsx | No | Blog listing |
| `/blog/:slug` | BlogDetail.jsx | No | Blog article |
| `/contact` | Contact.jsx | No | Contact form |
| `/for-institutes` | ForInstitutes.jsx | No | B2B page for institutes |
| `/signin` | SignIn.jsx | No | Google OAuth login |
| `/dashboard` | Dashboard.jsx | Yes | User hub: results, saved careers, roadmap progress |
| `/onboarding` | Onboarding.jsx | Yes | 15-question adaptive career quiz |
| `/career-test` | CareerTest*.jsx | Yes | 60-question test (4 categories x 15) |
| `/roadmap` | Roadmap.jsx | Yes | AI-generated career roadmap (search + accordion UI) |
| `/ai-chat` | AIChat.jsx | Yes | Conversational AI career advisor |
| `/mock-interview` | MockInterview.jsx | Yes | Practice interviews with AI evaluation |
| `/colleges` | Colleges.jsx | Yes | Institute search (course + location) |
| `/scholarships` | Scholarships.jsx | Yes | Scholarship finder |
| `/profile` | Profile.jsx | Yes | User profile + saved items |

---

## Backend API Routes

### Auth (`auth_routes.py`)
- `POST /api/auth/google` — Verify Google ID token, create/update user, return session
- `GET /api/auth/me` — Get current user from session token
- `POST /api/auth/logout` — Invalidate session

### Data (`data_routes.py`)
- `GET /api/careers` — List careers (with field/search filters, pagination)
- `GET /api/careers/{slug}` — Career detail (auto-generates AI content if cache stale >90 days)
- `POST /api/careers/generate` — Generate career details on demand
- `POST /api/colleges/search` — Search institutes by course + location (Google Places)
- `GET /api/scholarships` — List scholarships
- `POST /api/profile/save` — Save career/college/scholarship to user profile
- `POST /api/me/mock-subscribe` — Mock subscription activation

### AI (`ai_routes.py`)
- `POST /api/ai/onboarding/analyze` — Analyze 15 quiz answers → 8 career matches + 5-dimension scores
- `POST /api/ai/career-test/score` — Score 60-question test → results + recommendations
- `POST /api/ai/roadmap/generate` — Generate 4-stage roadmap (4 stages x 3 sections x 3 items)
- `POST /api/ai/chat` — AI career chat (with conversation history)
- `POST /api/ai/mock-interview/*` — Mock interview start/answer/evaluate
- `POST /api/ai/scholarships/match` — Match profile to scholarships

---

## Database (MongoDB Atlas)

**Connection:** See `backend/.env` for MongoDB Atlas connection string

| Collection | Key Fields | Purpose |
|-----------|-----------|---------|
| `users` | user_id, email, name, picture, onboarded, profile, top_career_matches[], onboarding_answers[] | User profiles & quiz results |
| `careers` | slug, title, field, tags[], avgSalary, demand, skills[], aiGeneratedDetails, detailsCachedAt | Career catalog (seeded from career_catalog.py) |
| `colleges` | college_id, name, location, courses[], rating, category[] | Educational institutions |
| `scholarships` | scholarship_id, name, eligibility, amount, deadline | Scholarship data |
| `test_questions` | question_id, category, question, options[] | 60 career test questions |
| `test_results` | result_id, user_id, answers[], scores{}, topMatches[] | Career test scores |
| `user_sessions` | session_token, user_id, expires_at | Auth sessions |

---

## Career Data Flow

```
career_catalog.py          →  seed_data.py         →  MongoDB careers    →  API /careers
(FIELD_CAREERS dict)           (runs on startup)       (240+ careers)        (frontend fetches)
(TITLE_OVERRIDES)              (bulk_write upsert)     (AI details cached)
(ALLOWED_CAREER_SLUGS)         (auto-cleanup stale)
```

1. `career_catalog.py` defines all careers in `FIELD_CAREERS` dict (13 fields: Science, Commerce, Tech, etc.)
2. `TITLE_OVERRIDES` adds custom salary/icon/tags for specific careers
3. `build_dynamic_careers()` generates full career objects → `DYNAMIC_CAREERS`
4. `seed_data.py` upserts all careers into MongoDB on startup + deletes stale ones not in catalog
5. Frontend fetches via `GET /api/careers` and `GET /api/careers/{slug}`
6. Career details are AI-generated on first view and cached for 90 days

---

## Key Patterns

### Mobile-First Responsive Design
All public pages follow this pattern:
- Headings: `text-2xl sm:text-4xl` (NOT text-4xl+ on mobile)
- Body: `text-xs sm:text-sm` or `text-sm sm:text-base`
- Cards: `p-3 sm:p-4`, `rounded-xl sm:rounded-2xl`
- Grids: `grid-cols-2` on mobile, `lg:grid-cols-3` on desktop
- Icons: Smaller on mobile using conditional classes

### Auth Flow
Google Sign-In → backend verifies token → creates MongoDB user + session → httpOnly cookie + Bearer token → AuthContext polls `/api/auth/me`

### AI Features (all use Claude via AWS Bedrock)
- Onboarding: 15 adaptive questions → career match analysis
- Career Test: 60 static questions → dimensional scoring
- Roadmap: career search → AI generates 4-stage plan (max_tokens=4000)
- AI Chat: conversational with history
- Mock Interview: AI conducts + evaluates practice interviews
- JSON repair: `_repair_truncated_json()` handles truncated LLM responses

### Build System
- **Frontend:** `craco` (NOT react-scripts directly). Build: `CI=false npx craco build`
- **Path alias:** `@/` → `src/` via jsconfig.json + craco.config.js
- **Vercel:** `CI=false` in vercel.json prevents eslint warnings from failing builds

---

## Deployment

### Frontend (Vercel - automatic)
- Auto-deploys on push to `main`
- Domain: latecomers.in / www.latecomers.in
- Config in `frontend/vercel.json`

### Backend (EC2 - manual)
- **Instance:** `i-0b6e2ae48cdbade2c`, IP: `3.82.107.79`
- **User:** `ec2-user`, App dir: `/home/ec2-user/app`
- **Access:** AWS Session Manager (no SSH key)
- **Deploy commands:**
  ```bash
  sudo su - ec2-user
  cd /home/ec2-user/app
  git pull origin main
  sudo systemctl restart latecomers
  ```
- If permission errors: `sudo chown -R ec2-user:ec2-user /home/ec2-user/app`

---

## Brand Colors (current)

| Token | Value | Usage |
|-------|-------|-------|
| brand | `#0B9BD4` | Primary brand color (buttons, links, accents) |
| brand-800 | `#061B4F` | Dark variant (gradients, nav bg) |
| ink | Dark text color | Headings, body text |
| muted2 | Gray text | Secondary text |
| line | Border color | Card borders, dividers |
| brand-50 | Light tint | Card backgrounds, icon backgrounds |

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Vercel build fails on warnings | `CI=false` in vercel.json buildCommand |
| `@craco/craco` not found on Vercel | Must be in `dependencies`, not `devDependencies` |
| Roadmap JSON truncation | Simplified prompt (4x3x3 items, 80 char limit) + max_tokens=4000 + JSON repair |
| Stale careers in DB | seed_data.py auto-cleanup deletes careers not in ALLOWED_CAREER_SLUGS |
| Logo white background | Use .png with transparency (not .jpeg) |
| EC2 permission errors | `sudo chown -R ec2-user:ec2-user /home/ec2-user/app` |
| Backend won't start | Check Python syntax in ai_routes.py string literals (bracket matching) |

---

## Environment Variables

### Backend (.env)
```
MONGO_URI=<mongodb-atlas-connection-string>
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-secret>
GOOGLE_MAPS_API_KEY=<google-maps-key>
AWS_ACCESS_KEY_ID=<aws-key>
AWS_SECRET_ACCESS_KEY=<aws-secret>
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
EMERGENT_API_KEY=<emergent-key>
```

### Frontend (.env)
```
REACT_APP_API_URL=<backend-url>
REACT_APP_GOOGLE_CLIENT_ID=<google-oauth-client-id>
REACT_APP_GOOGLE_MAPS_API_KEY=<google-maps-key>
```
