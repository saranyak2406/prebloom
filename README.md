# PrepBloom 🌷
> **Tagline:** Learn. Grow. Succeed.  
> **Purpose:** One unified, modern, cute and aesthetic SaaS platform for all Indian Government Examination Preparation.

---

## 🌸 Overview

**PrepBloom** is an educational SaaS platform crafted for government job aspirants across India. It provides centralized preparation for Central and State recruitment examinations including **UPSC, SSC, Railways (RRB), State PSCs (APPSC Group 1-4, TSPSC, etc.), Banking (IBPS, SBI, RBI), Defence (NDA, CDS, AFCAT), Police (SI & Constable), and Other examinations (Teaching CTET, Postal, Insurance, Courts)**.

Designed with a cute, friendly, aesthetic and professional educational SaaS design featuring pastel green, soft pink, lavender, and white accents, rounded cards, soft glows, study streak habit builders, and confetti celebrations.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Canvas-Confetti
- **Backend:** Node.js, Express.js, CORS, Multer
- **Database:** PostgreSQL (with integrated persistent storage via PGlite WebAssembly PostgreSQL engine + external `DATABASE_URL` pool support)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs password hashing

---

## 🚀 Key Modules Built & Verified

### 1. 🏠 Landing Page
- PrepBloom logo and brand identity: *"Your Government Job Journey Starts Here"*.
- Start Preparing & Explore Exams CTAs.
- Popular government exam category cards.
- Verified features & benefits overview.
- Real ranker testimonials (APPSC Group 2, SSC CGL Inspector, UPSC Prelims).
- Comprehensive educational footer.

### 2. 📊 Student Dashboard
- Personalized welcome: *"Welcome back, Saranya! 🌷"*.
- Active daily study streak tracker (`🔥 14 Days Streak`).
- Enrolled examinations with progress bars and live status.
- Interactive daily study goals checklist.
- Weekly study analytics visualization (31.7+ Hours).
- Recent quiz scores and continue learning recommendations.
- Live notification alerts.

### 3. 🎯 Exam Explorer
Full coverage of all major Indian government examinations:
- **UPSC:** Civil Services (IAS/IPS/IFS), NDA, CDS, CAPF
- **SSC:** CGL, CHSL, MTS, CPO, GD, JE
- **RAILWAY:** RRB NTPC, Group D, ALP, Technician, JE
- **STATE PSC:** APPSC Group 1, Group 2, Group 3, Group 4 & other State PSCs
- **BANKING:** IBPS PO, IBPS Clerk, SBI PO, SBI Clerk, RBI Grade B
- **DEFENCE:** Army, Navy, Air Force, AFCAT, Agniveer
- **POLICE:** AP Police SI, Constable, SSC CPO
- **OTHER EXAMS:** Teaching (CTET/TET), Insurance (LIC), Postal, Court recruitment

Each examination profile contains:
- Overview & recruiting authority
- Age limits & category relaxations
- Educational qualifications & degree requirements
- Stage-by-stage selection process
- Detailed exam pattern table with marking schemes & negative penalties
- Detailed section-wise syllabus topics
- Official notification link (e.g., `upsc.gov.in`, `ssc.gov.in`, `psc.ap.gov.in`, `ibps.in`, `rrbcdg.gov.in`)
- Notification status (`active`, `upcoming`, `expired`), application deadlines, and vacancy counts.

### 4. ⭐ My Exams & Multi-Exam Comparison
- Enroll in multiple examinations simultaneously.
- Star favourite examinations.
- **Multi-Exam Syllabus Comparison:** Compare 2 or 3 examinations to identify overlapping common subjects (e.g., Indian Polity, Indian Economy, and Geography shared between UPSC CSE and APPSC Group 2), eliminating duplicate study effort!
- Direct one-click combined study plan creation.

### 5. 📚 Study Materials & Notes Reader
- Subject-wise and chapter-wise structured notes.
- High-yield concept cards and downloadable PDF handbooks.
- Integrated **Lesson Reader Modal** with reading times, executive summaries, key takeaways, and progress tracker (*Mark as Completed*).
- Download counter tracking.

### 6. 📝 Daily Practice & MCQ Streak
- Subject & topic-wise four-option standard MCQs.
- **Instant Answer Verification:** Immediate color-coded feedback (`Correct` in emerald, `Wrong` in rose).
- Real score calculations (+marks, -negative marking deductions).
- Comprehensive conceptual explanations with citations to landmark judgements and constitutional articles.
- Difficulty level filtering (`Easy`, `Medium`, `Hard`).

### 7. ⏱️ Mock Tests Simulator
- Computer-Based Test (CBT) simulator interface.
- Live ticking countdown timer with auto-submit on expiration.
- Question navigation palette with status markers (*Answered*, *Mark for Review*, *Not Visited*, *Skipped*).
- Instant post-test evaluation with confetti celebrations.
- Question-by-question review with official solutions and accuracy percentages.

### 8. 📰 Daily Current Affairs & Schemes
- Daily news filtered by categories: *National*, *State*, *Andhra Pradesh Special*, *Economy & Schemes*, *Awards*, *Sports*, and *Key Appointments*.
- Full-article reader modal with executive takeaways and tags.
- Search and monthly archives.

### 9. 📑 Previous Year Question Papers (PYQs)
- Exam-wise and year-wise question papers (UPSC, SSC CGL, APPSC Group 2, RRB NTPC).
- Official answer keys and worked-out solutions.
- PDF download simulation.

### 10. 📅 Study Planner & Combined Timetable
- Daily timetable and weekly study target checklist.
- Interactive completion tracking for daily routines.
- **Combined Timetable Generator:** Dynamically balances theory, revision, and mock tests across all chosen exams based on your daily commitment (e.g. 4.5 hours/day over 6 months).

### 11. 📈 Performance & Weak Topic Diagnostics
- Overall accuracy percentages and total questions solved.
- Subject-wise accuracy progress bars.
- Diagnostic alerts identifying weak topics with personalized recommendations.
- Historical mock test log with scores and percentiles.

### 12. 🔐 Authentication & Profiles
- Student registration, login, and profile editing.
- Role-based authorization (`student` vs. `admin`).
- Quick demo login buttons for one-click testing.

### 13. 🛡️ Admin Dashboard & CMS
- Central academic console for administrators.
- Student management directory with streaks and test counts.
- Add and publish new examinations with vacancies and deadlines.
- Add MCQs to the centralized question bank.
- Publish daily current affairs articles.
- Broadcast instant notification bell alerts to all registered students.

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **Student** | `student@prepbloom.com` | `student123` |
| **Admin** | `admin@prepbloom.com` | `admin123` |

*(You can also use the one-click **"Student Demo"** and **"Admin Demo"** buttons on the navigation bar or login page for instant access!)*

---

## 🏃 Quick Start Guide

### 1. Start Backend Server (runs on Port 5000)
```powershell
cd server
npm start
```
The backend initializes the PostgreSQL database, seeds verified syllabus data, and begins listening on `http://localhost:5000`. It also automatically serves the frontend application from `client/dist`.

### 2. Run in Development Mode (with Vite Hot-Reloading)
In two separate terminals:
```powershell
# Terminal 1: Backend API
cd server
npm run dev

# Terminal 2: Frontend Client (Vite on Port 5173)
cd client
npm run dev
```

### 3. Run Automated Integration Tests
```powershell
npm test
```
Verifies all 19 endpoints and database operations end-to-end.

---

*PrepBloom 🌷 — Crafted with dedication for India's future public servants.*

