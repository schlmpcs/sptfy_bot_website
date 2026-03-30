# Spotify Family — Website

Marketing and dashboard website for the Spotify Family subscription service.
Built with **React + Vite** (frontend) and **FastAPI** (backend).

## Structure

```
website_spotify/
├── frontend/   React + Vite app (port 5173)
├── backend/    FastAPI REST API (port 8000)
└── README.md
```

---

## Backend Setup

The backend connects to the **same PostgreSQL database** as the Telegram bot.

```bash
cd backend

# 1. Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env — set DB_HOST, DB_PASSWORD, DB_DATABASE to match your bot's .env

# 4. Run the server
uvicorn main:app --reload --port 8000
```

API docs available at http://localhost:8000/docs

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/plans` | All subscription plans (static, from env prices) |
| `GET` | `/api/user/{telegram_id}` | User subscription status from DB |
| `POST` | `/api/user/subscribe` | Validate request + return Telegram bot URL |
| `GET` | `/health` | Liveness probe |

---

## Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
```

App runs at http://localhost:5173. API calls to `/api/*` are proxied to `localhost:8000`.

```bash
# Production build
npm run build
npm run preview
```

### Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, features, how it works |
| `/pricing` | Plan cards for KZ and RU regions |
| `/faq` | Accordion FAQ |
| `/dashboard` | Look up subscription status by Telegram ID |

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in your values.
All price variables (`BOT_DEFAULT_PAYMENT_PRICE`, etc.) must match the Telegram bot's `.env`
so that the website always displays the correct prices.
