# Quartermaster 🛠️

**Intelligent Work Order Resolution for the Modern Technician.**

Quartermaster is a full-stack platform that transforms unstructured technician communications into validated, conflict-free database entries. Built with a **Minimalist Notion-meets-Linear** aesthetic, it prioritizes speed, type safety, and real-time operational awareness in a clean, distraction-free environment.

---

## 🚀 The Pipeline

1.  **Intelligent Ingestion**: Technicians provide raw updates via text (e.g., *"Heading to Ghent to fix the blue boiler, need a 15mm valve"*).
2.  **Contextual Extraction**: A Node.js backend powered by **Groq (Llama 3.3)** parses the text into structured entities (Location, Equipment, Parts, Time).
3.  **Operational Validation**: The system perform real-time relational checks against **Supabase (PostgreSQL)** to detect inventory shortages or scheduling conflicts.
4.  **Resolution Engine**: If a conflict is detected, the UI suggests 1-tap alternatives (e.g., matching a similar part in stock).
5.  **Systemic Persistence**: Upon confirmation, the resolved state is committed to the relational schema, updating work orders and tracking part usage.

---

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion (Animations), Lucide (Icons).
*   **Backend**: Node.js, Express, TypeScript, Groq SDK.
*   **Database**: Supabase / PostgreSQL (Relational schema with RLS).
*   **AI**: Llama 3.3 (Groq) for high-speed, high-accuracy entity extraction.

---

## 📦 Getting Started

### 1. Database Setup
Run the SQL found in `database/schema.sql` in your Supabase SQL Editor to initialize the tables and seed data.

### 2. Backend Configuration
Navigate to `/server`, create a `.env` file, and add your keys:
```env
PORT=3001
GROQ_API_KEY=your_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```
Run `npm install` and `npm run dev`.

### 3. Frontend Configuration
Navigate to `/client`, create a `.env.local` file:
```env
VITE_API_URL=http://localhost:3001
```
Run `npm install` and `npm run dev`.

---

## 🎨 Design Philosophy
Quartermaster uses a **Notion-inspired Light Aesthetic**:
*   **Canvas-White Base**: Clean, high-contrast workspace that feels like a professional document.
*   **Sophisticated Borders**: Subtle `1px` grays to separate components without visual clutter.
*   **Typography**: Relies on **Inter** for that crisp, functional information-density found in pro-tools like Notion or Linear.
*   **Micro-animations**: Tactile feedback during AI parsing and successful database commits.

---

## 🛡️ Security & Scalability
*   **Strictly Typed**: TypeScript-first architecture avoids scripting limitations.
*   **Relational Core**: Complex schemas ensure data integrity across technicians and equipment.
*   **Conflict-Aware**: Prevents double-bookings and phantom inventory usage at the database level.
