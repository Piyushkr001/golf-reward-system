# Playlance

Playlance is a full-stack Next.js web application built with the App Router. It serves as a modern charity and rewards platform where users can subscribe, participate in monthly draws tied to their charitable contributions, and manage their reward lifecycle intuitively.

## 🚀 Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Database**: PostgreSQL (via [Neon Database Serverless](https://neon.tech/))
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: Custom JWT Middleware (Edge-compatible)
- **Styling**: Tailwind CSS + `shadcn/ui`
- **Components**: `lucide-react`, `@base-ui`

---

## 🛠️ Implemented Modules

### 1. Authentication & Onboarding
- JWT-based authentication with strict middleware protection for admin and user routes.
- Multi-step onboarding flows explicitly separating user setup and administrator setup.

### 2. Subscriptions & Charities
- Manages subscription statuses and tracking for monthly/yearly intervals.
- Charity catalog allowing users to select and direct a percentage of their participation towards specific partners.

### 3. Golf Engine 
- Score tracking allowing users to securely log and view historical scores.

### 4. Draw Lifecycle Simulator
- Automated monthly structured draws mapping matching algorithms against user entries.
- Distributes the prize pool into logical tiers (5-match, 4-match, 3-match).

### 5. Winner Processing & Payout Queue
- Verifies external proofs securely and tracks distinct payout phases (*Submitted* -> *Approved* -> *Paid*).

### 6. Reports & Analytics
- Administrative dashboard surfacing high-level statistics dynamically (Registered Users, Active Subscriptions, Total Charities, Distributed Prize Pools).

---

## 🏗️ Getting Started

### 1. Environment Variables
To run Playlance locally, copy the `.env.example` file to `.env` or create a new `.env` file containing the following keys:

```env
# Database
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require

# Authentication
JWT_SECRET=your_secure_jwt_secret

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_SECRET=your_google_secret

# SMTP (Mailing)
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# Standard Configurations
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Installation & Setup
Install all dependencies using `bun`.

```bash
bun install
```

### 3. Database Sync & Studio
Apply the schema design to your Neon PostgreSQL instance:

```bash
bunx drizzle-kit push
```

To boot the local Drizzle Studio database viewer:

```bash
bunx drizzle-kit studio
```

### 4. Boot Dev Environment
Start the Next.js development server:

```bash
bun run dev
```

Your app will be available at `http://localhost:3000`.

---

## 📡 Route Overview

### User Facing
- `/auth/sign-in` , `/auth/sign-up` - Authentication
- `/onboarding` - Role-based setup
- `/dashboard` - Summary of winnings, score counts, and subscription status.
- `/dashboard/billing` - Subscription and billing management.
- `/dashboard/scores` - Interactive personal score history.
- `/dashboard/draws` - View monthly draw results.
- `/dashboard/winnings` - Secure portal for submitting proof to claim prizes.

### Administrator Shell
- `/admin` - Deep validation aggregates configuring internal bounds.
- `/admin/charities` - Catalog management for charity partners.
- `/admin/draws` - Execute monthly draws and preview simulated results.
- `/admin/winners` - Review winners, approve proofs, and mark final payouts.
- `/admin/reports` - Real-time business KPI overview.

---

## 🔮 Known Future Improvements
- Refinements to payout provider integration (e.g. Stripe payouts).
- Complete automated mailing sequences notifying users of state changes.
- Complex analytics charting.
