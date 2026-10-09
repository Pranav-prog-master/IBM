# AI Tutor — SDG 4 Quality Education

An adaptive AI tutor for rural students (grades 6–10) that personalises learning using Bayesian Knowledge Tracing, RAG over NCERT curriculum, and multilingual support for Indian regional languages.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React 18 + Vite 5 (PWA, offline-first) |
| Backend | Python 3.11 + FastAPI |
| LLM | Gemini 1.5 Flash via LangChain (`langchain-google-genai`) |
| RAG / Vector store | ChromaDB + Google Generative AI Embeddings |
| Personalisation | Bayesian Knowledge Tracing (BKT) — custom implementation |
| Translation | `deep-translator` (Google Translate / MyMemory, no API key needed) |
| Speech-to-Text | `faster-whisper` small model (local, CPU, int8) |
| Text-to-Speech | gTTS |
| Database | MongoDB 7 via PyMongo |
| Cache | Redis 7 |
| Auth | JWT — `python-jose` + `passlib[bcrypt]` |
| PII Scrubbing | Microsoft Presidio (Analyzer + Anonymizer) |
| Offline sync | IndexedDB via `idb` (answer queue, auto-flush on reconnect) |
| CI/CD | GitHub Actions (lint + test backend, build frontend) |
| Deployment | Docker Compose |

---

## Features

### Student-facing
- **Task Dashboard** — typography-driven, neumorphic design with a 12-column responsive grid. Shows today's tasks, progress ring, learning-gap card, weekly streak, and points.
- **AI Chat Tutor** — text and voice (WebM audio → Whisper STT) questions answered by Gemini 1.5 Flash, grounded in NCERT curriculum via RAG.
- **Adaptive Quiz** — BKT-driven difficulty (easy / medium / hard). Answers submitted online or queued offline and synced automatically.
- **Progress Page** — per-topic mastery bars and a Recharts radar chart.
- **Multilingual UI** — English, Hindi (Devanagari), Gujarati. Language persisted in `localStorage`. Font swap via `:lang()` CSS selector (Noto Sans Devanagari / Gujarati).
- **PWA / Offline** — Vite PWA plugin with Workbox. API responses cached with `NetworkFirst`. Offline banner shown automatically.

### Teacher-facing
- Weak-topics dashboard (aggregated mastery < 0.5, filterable by grade).
- Per-student report (mastery scores + recent quiz attempts).

---

## Project Structure

```
IBM/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS, router registration
│   │   ├── config.py            # Pydantic settings from .env
│   │   ├── api/
│   │   │   ├── auth.py          # /auth/register, /auth/token
│   │   │   ├── tutor.py         # /tutor/ask (text + audio)
│   │   │   ├── quiz.py          # /quiz/generate, /quiz/submit
│   │   │   ├── progress.py      # /progress/mastery, /progress/history
│   │   │   ├── translation.py   # /translate
│   │   │   └── teacher.py       # /teacher/register, /teacher/token,
│   │   │                        # /teacher/dashboard/weak-topics,
│   │   │                        # /teacher/dashboard/student/{id}
│   │   ├── ai/
│   │   │   ├── bkt.py           # Bayesian Knowledge Tracing (L0/T/G/S params)
│   │   │   ├── rag_chain.py     # LangChain RAG — Gemini LLM + ChromaDB retriever
│   │   │   ├── quiz_chain.py    # LLM-generated MCQ with BKT difficulty routing
│   │   │   └── guardrails.py    # Presidio PII scrubbing before LLM call
│   │   ├── db/
│   │   │   ├── session.py       # MongoDB client, index creation on startup
│   │   │   ├── models.py        # Document factory functions (student, mastery, attempt, teacher)
│   │   │   └── auth.py          # JWT encode/decode, bcrypt, OAuth2 dependency
│   │   └── services/
│   │       ├── bhashini.py      # Translation via deep-translator
│   │       ├── whisper_stt.py   # faster-whisper transcription (CPU, int8)
│   │       └── tts.py           # gTTS text-to-speech → MP3 bytes
│   ├── scripts/
│   │   └── ingest_content.py    # One-time PDF → ChromaDB ingestion
│   ├── .env.example
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Task dashboard (main landing after login)
│   │   │   ├── Login.jsx        # Login / Register form
│   │   │   ├── Home.jsx         # AI chat tutor with subject/topic selector
│   │   │   ├── Quiz.jsx         # Quiz flow (topic select → questions → done)
│   │   │   └── Progress.jsx     # Mastery radar chart + per-topic bars
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx   # Chat UI with voice recording (MediaRecorder)
│   │   │   ├── QuizCard.jsx     # Single MCQ card with offline fallback
│   │   │   └── MasteryBar.jsx   # Colour-coded progress bar per topic
│   │   ├── hooks/
│   │   │   └── useOfflineSync.js # IndexedDB queue + auto-flush on reconnect
│   │   ├── styles/
│   │   │   ├── tokens.css       # CSS custom properties (palette, type scale, shadows, spacing)
│   │   │   └── dashboard.css    # Dashboard layout, neumorphic cards, floating nav, FAB
│   │   ├── i18n/
│   │   │   ├── en.json          # English strings
│   │   │   ├── hi.json          # Hindi strings
│   │   │   ├── gu.json          # Gujarati strings
│   │   │   └── index.js         # i18next initialisation
│   │   ├── api.js               # Axios instance with JWT interceptor + all API calls
│   │   └── main.jsx             # React Router routes
│   ├── index.html
│   ├── vite.config.js           # Vite + PWA plugin + /api proxy to :8000
│   └── package.json
├── data/
│   └── raw/                     # Place NCERT PDFs here before ingestion
├── docker-compose.yml           # mongo + redis + backend + frontend
└── .github/workflows/ci.yml     # Lint (ruff) + pytest + npm build
```

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a student (`username`, `password`, `grade`, `language`) |
| POST | `/auth/token` | Login — returns `access_token` (JWT, 8 h expiry) |

### Tutor
| Method | Endpoint | Description |
|---|---|---|
| POST | `/tutor/ask` | Ask a question (form-data: `question`, `topic`, `subject`, optional `audio` file, optional `include_audio_response`) |

### Quiz
| Method | Endpoint | Description |
|---|---|---|
| GET | `/quiz/generate?topic=X&subject=Y&count=5` | Generate adaptive MCQs (difficulty from BKT mastery score) |
| POST | `/quiz/submit` | Submit answer, update BKT mastery, record attempt |

### Progress
| Method | Endpoint | Description |
|---|---|---|
| GET | `/progress/mastery` | All topic mastery scores for the current student |
| GET | `/progress/history?topic=X&limit=50` | Quiz attempt history |

### Translation
| Method | Endpoint | Description |
|---|---|---|
| POST | `/translate` | Translate text (`text`, `source_lang`, `target_lang`) |

### Teacher
| Method | Endpoint | Description |
|---|---|---|
| POST | `/teacher/register` | Register a teacher account |
| POST | `/teacher/token` | Teacher login |
| GET | `/teacher/dashboard/weak-topics?grade=7` | Topics with avg mastery < 0.5 across students |
| GET | `/teacher/dashboard/student/{student_id}` | Individual student mastery + recent attempts |

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Returns `{"status": "ok"}` |

---

## Quick Start

### Prerequisites
- Docker Desktop
- Git

### 1. Clone and configure
```bash
git clone <your-repo-url>
cd IBM
cp backend/.env.example backend/.env
# Edit backend/.env — set GOOGLE_API_KEY
```

### 2. Add curriculum PDFs
```
data/raw/
  math_grade7.pdf
  science_grade8.pdf
  ...
```
Download free NCERT PDFs from https://ncert.nic.in/textbook.php

### 3. Start all services
```bash
docker-compose up --build
```

### 4. Ingest curriculum content (run once)
```bash
docker-compose exec backend python scripts/ingest_content.py --pdf_dir data/raw/
```

### 5. Open the app
- Student dashboard: http://localhost:5173
- API docs (Swagger): http://localhost:8000/docs

---

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=tutordb
REDIS_URL=redis://localhost:6379/0
GOOGLE_API_KEY=<your-google-ai-studio-key>
CHROMA_DB_PATH=./data/chroma_db
EMBEDDING_MODEL=models/embedding-001
LLM_MODEL=gemini-1.5-flash
SECRET_KEY=<random-secret-min-32-chars>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
TRANSLATION_PROVIDER=google
```

---

## AI / Personalisation Details

### Bayesian Knowledge Tracing (BKT)
Implemented in `backend/app/ai/bkt.py`. Standard four-parameter model:

| Parameter | Value | Meaning |
|---|---|---|
| L0 | 0.30 | Prior probability of knowing the skill |
| T | 0.09 | Probability of learning after one attempt |
| G | 0.20 | Probability of guessing correctly without mastery |
| S | 0.10 | Probability of slipping despite mastery |
| Threshold | 0.75 | Score above which a topic is considered mastered |

After each quiz answer, `update_mastery(p_mastery, correct)` returns the new posterior. The result drives quiz difficulty (`easy` < 0.4, `medium` < 0.75, `hard` ≥ 0.75) and the tutor's explanation depth.

### RAG Pipeline
1. PDFs are chunked (500 tokens, 50 overlap) and embedded with `models/embedding-001`.
2. Embeddings are stored in ChromaDB at `CHROMA_DB_PATH`.
3. On each `/tutor/ask` call, the top-4 relevant chunks are retrieved and injected into the system prompt alongside the student's mastery level.
4. Gemini 1.5 Flash generates a ≤150-word, curriculum-grounded answer.

### PII Scrubbing
All student input passes through `presidio_analyzer` + `presidio_anonymizer` before reaching the LLM. Names, phone numbers, and emails are replaced with `<PERSON>`, `<PHONE_NUMBER>`, etc.

---

## Dashboard Design System

The task dashboard (`Dashboard.jsx`) combines four design styles:

| Style | Role |
|---|---|
| Typography-driven | Fraunces serif for hero headings, Nunito for body. Type scale: 48/32/24/18/16/14 px. |
| 12-column grid | 4-col mobile → 12-col desktop. 8px spacing system, 24px desktop gutters. |
| Neumorphism (restrained) | Soft `#EEF2F0` surface with two-shadow cards. Inset style for progress bars and checked toggles only. |
| Floating UI | Blurred bottom nav (mobile) / side dock (desktop). FAB opens a floating chat panel. 200ms ease-out transitions. `prefers-reduced-motion` respected. |

Design tokens are in `src/styles/tokens.css` as CSS custom properties.

**Palette:**

| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#1F4D3A` | Chalkboard green — primary actions, headings |
| `--color-accent` | `#F4B400` | Pencil yellow — streak, highlights |
| `--color-alert` | `#E4572E` | Apple red — learning gaps, errors |
| `--color-info` | `#3A86C8` | Sky blue — informational badges |
| `--color-surface` | `#EEF2F0` | Soft white — page and card background |
| `--color-ink` | `#1B2B34` | Primary text |

---

## Offline Support

- **PWA:** Vite PWA plugin registers a Workbox service worker. All static assets are precached. `/tutor/*` API responses use `NetworkFirst` with a 5-second timeout.
- **Answer queue:** `useOfflineSync.js` stores quiz answers in IndexedDB (`tutor-offline` / `pending-answers`). On reconnect (`window online` event), the queue is flushed to `/quiz/submit` in order.
- **Offline banner:** The dashboard detects `navigator.onLine` and listens for `online`/`offline` events, showing a persistent banner when disconnected.

---

## Privacy and Safety

- No PII reaches the LLM — Presidio scrubs all input before the RAG call.
- All student data is stored in your own MongoDB instance.
- JWT tokens expire after 8 hours.
- LLM answers are grounded in curriculum content via RAG, reducing hallucination.
- The system prompt enforces age-appropriate, curriculum-only responses (≤150 words, no off-topic content).

---

## Accessibility

- WCAG AA contrast on all text (minimum 4.5:1 on `#EEF2F0` surface).
- Minimum 44×44 px touch targets on all interactive elements.
- `aria-checked` on task toggles, `aria-live="polite"` on toasts and offline banner, `role="progressbar"` with `aria-valuenow` on progress bars.
- `aria-label` on all icon-only buttons.
- Full keyboard navigation with visible 2px focus rings.
- `prefers-reduced-motion` collapses all CSS transitions to 0.01ms.

---

## Content Sources

| Source | License | URL |
|---|---|---|
| NCERT Textbooks | Free for educational use | https://ncert.nic.in |
| Khan Academy | CC BY-NC-SA 4.0 | https://khanacademy.org |
| CK-12 | CC BY | https://ck12.org |
| DIKSHA | CC BY 4.0 | https://diksha.gov.in |

---

## Roadmap

- **MVP (Weeks 1–4):** Core tutor + quiz + BKT + auth + task dashboard ✓
- **Enhancement (Weeks 5–8):** Translation + voice + teacher dashboard ✓
- **Scale-up:** Spaced repetition scheduler, fine-tuned IndicTrans2, federated learning for privacy-preserving model updates

---

## License
MIT — free to use, modify, and distribute for educational purposes.
