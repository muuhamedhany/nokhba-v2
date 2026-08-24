# Nokhba Academy (منصة نُـخبة التعليمية)

A modern, full-stack educational platform and learning management system (LMS) built with **Next.js 16 (App Router & React 19)**, **Prisma ORM**, **Neon Serverless PostgreSQL**, **Cloudflare R2 Object Storage**, and **Motion (Framer Motion)**.

---

## 🌟 Executive Overview

**Nokhba Academy** is an agency-grade educational web application designed for high school curricula (Thanaweya Amma). It offers an integrated multi-persona experience for **Students**, **Teachers**, and **Parents**, featuring video lessons, interactive quizzes, access code redemption, course authoring, and a Master Admin Studio.

---

## 🏗️ Architecture & Tech Stack

```
                                  +-------------------------------------------------------+
                                  |              Next.js 16 App Router Frontend           |
                                  |  (React 19, Motion, Tailwind CSS, Double-Bezel UI)   |
                                  +-------------------------------------------------------+
                                                              |
                                                    [Edge Middleware]
                                                    (JWT Verification)
                                                              |
                               +------------------------------+------------------------------+
                               |                                                             |
                 +---------------------------+                                 +---------------------------+
                 |    Serverless REST API    |                                 |   Direct File Uploads     |
                 |  (Next.js Route Handlers) |                                 |     (Cloudflare R2)       |
                 +---------------------------+                                 +---------------------------+
                               |                                                             |
                 +---------------------------+                                 +---------------------------+
                 |    Prisma ORM Client      |                                 |   Public Media Delivery   |
                 +---------------------------+                                 |    (Cloudflare CDN)       |
                               |                                                             |
                 +---------------------------+                                               |
                 |  Neon Serverless Postgres |                                               |
                 +---------------------------+                                               +
```

### Core Technologies:
- **Framework:** Next.js 16 (App Router, Turbopack, React Server Components & Client Leaves)
- **Language:** TypeScript 5 (Strict mode)
- **Styling & Design System:** Tailwind CSS, Double-Bezel Architecture, Custom Cairo & Geist typography
- **Animations:** Motion (`motion/react`) with spring physics, masked-word staggers, and cubic-bezier curves
- **Database & ORM:** Neon Serverless PostgreSQL with Prisma ORM (automatic auto-seeding & connection pooling)
- **Object Storage:** Cloudflare R2 (S3-compatible bucket) for course covers and media uploads
- **Authentication:** Custom JWT sessions (Jose) stored in secure `httpOnly` cookies with `bcryptjs` password hashing
- **Iconography:** Phosphor Icons (`@phosphor-icons/react`)

---

## 🔒 Security Architecture

- **Role-Based Access Control (RBAC):** Strict separation of privileges across Teachers, Students, and Parents.
- **IDOR Protection:** All course, section, item, quiz, code, and submission mutations strictly verify parent ownership before executing.
- **Password Security:** Salted `bcrypt` hashing for all registered user credentials.
- **Admin Studio Gate:** Server-validated `x-admin-key` authentication on all `/api/admin/*` management and database wipe endpoints.
- **Transport Security Headers:** Configured with `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
- **Upload Safety:** Multi-point MIME type inspection and 10MB payload size limits on file uploads to Cloudflare R2.

---

## ✨ Core Features & Personas

### 1. Student Experience (`/student/*`)
- **Interactive Classroom (`/student/course/[id]`):** Video player with chapter progression tracking and completed item persistence.
- **Quiz Engine (`/student/course/[id]/quiz/[quizId]`):** Timed multiple-choice assessments with instant grading, question-by-question review, and performance analytics.
- **Access Code Redemption:** Modal-driven code activation to unlock paid teacher courses.
- **Student Dashboard:** Enrolled courses overview, progress tracking, and quiz scores.

### 2. Teacher Experience (`/teacher/*`)
- **Curriculum Authoring Studio (`/teacher/courses/new`, `/teacher/courses/[id]`):** Drag-and-drop course creator with cover photo uploads to Cloudflare R2, chapter sectioning, video lessons, and quiz question builders.
- **Batch Access Code Generator (`/teacher/codes`)**: Automated creation and status tracking of unique course redemption codes.
- **Student Submissions Hub (`/teacher/submissions`)**: Real-time grading telemetry and score breakdowns across all student submissions.
- **Public Teacher Profile (`/teachers/[id]`)**: Showcase page featuring teacher biography, subject specialties, and published courses.

### 3. Parent Telemetry (`/parent/*`)
- **Dedicated Progress Hub (`/parent/dashboard`)**: Auto-linked parent accounts providing visibility into attendance, completed lessons, and quiz scores for their student.

### 4. Public & Marketing Pages
- **Cinematic Hero (`/`)**: Reference-matched vector SVG harmonic waves, organic contours, and interactive stats counter.
- **Lessons Library (`/lessons`)**: Search, grade-level filtering, and subject categorization.
- **Course Landing Pages (`/courses/[id]`)**: Comprehensive course syllabus preview and enrollment CTA.

### 5. Master Admin Studio (`/admin`)
- Real-time entity management (Users, Courses, Sections, Lessons, Codes, Submissions) with telemetry counters and one-click database re-seed capability.

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/nokhba-academy.git
cd nokhba-academy
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:

```env
# Database (Neon Serverless PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"

# JWT Authentication Secret
JWT_SECRET="your-super-secret-jwt-key"

# Master Admin Passcode
ADMIN_SECRET="nokhba-admin-2026"

# Cloudflare R2 Object Storage
AWS_ACCESS_KEY_ID="your-r2-access-key-id"
AWS_SECRET_ACCESS_KEY="your-r2-secret-access-key"
AWS_ENDPOINT_URL_S3="https://<account_id>.r2.cloudflarestorage.com"
AWS_REGION="auto"
NEON_STORAGE_BUCKET="nokhba"
PUBLIC_STORAGE_URL="https://pub-<id>.r2.dev"
```

### 3. Initialize Database & Run
```bash
# Push database schema
npx prisma db push

# Run development server
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📄 License
MIT License. Built with high craft for portfolio demonstration and production education deployment.
