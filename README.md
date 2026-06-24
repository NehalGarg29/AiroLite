# AIRO Lite — AI Resource Optimization for Logistics

Built to mirror the mission of KW International's **AI Resource Optimization (AIRO)** team.
AIRO Lite demonstrates how AI can optimize resource decisions across logistics operations —
driver assignment, route planning, and reverse logistics management.

---

## Modules

### 1. Driver Assignment
AI recommends the best available driver for each shipment based on vehicle type, location,
and experience. Mirrors KW's FTL, LTL, and Milk Run operations.

### 2. Route Optimizer
Input delivery stops and AI reorders them for minimum distance and time.
Designed around KW's real delivery network across the LA/Carson area.

### 3. Return Tracker
Kanban board for managing Samsung and LG product returns across four stages:
Received → Inspecting → Repair / Resell. AI recommends disposition based on condition.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| AI Layer | Claude API (Anthropic) — mock mode during development |
| Version Control | Git, GitHub |

---

## Project Structure

airo-lite/

├── backend/              # Node.js / Express API

│   ├── src/

│   │   ├── routes/       # shipments, drivers, returns, routes

│   │   ├── ai/           # Claude API integration layer

│   │   └── lib/          # Prisma client singleton

│   └── prisma/           # Schema + migrations + seed

└── frontend/             # Next.js 14 app

└── src/

├── app/          # Dashboard, Drivers, Routes, Returns pages

├── components/   # Sidebar

└── lib/          # Axios API client

---

## Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Backend

```bash
cd backend
npm install
# Add DATABASE_URL and ANTHROPIC_API_KEY to .env
npx prisma migrate dev
npm run seed
npm run dev
# Runs on http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## API Endpoints

GET    /api/drivers

GET    /api/shipments

POST   /api/shipments/:id/assign       # AI driver recommendation

GET    /api/returns

POST   /api/returns/:id/disposition    # AI disposition recommendation

POST   /api/routes/optimize            # AI route optimization

---

## About

Built by **Nehal Garg** as part of interview preparation for the Software Engineer
role on KW International's AIRO team. The project is designed to reflect a real
understanding of KW's logistics operations — including their work with Samsung,
LG, and Amazon's SEND program.

