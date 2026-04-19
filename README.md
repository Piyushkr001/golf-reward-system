# PlayLance

PlayLance is a robust, full-stack Next.js web application built with the App Router. It is designed to act as a hybrid charity contribution tracking and game-reward engine. Users can subscribe, participate in simulated monthly draws automatically tied to their charitable footprints, and manage their reward lifecycle intuitively.

## 🚀 Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Database**: PostgreSQL (via [Neon Database Serverless](https://neon.tech/))
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: Custom JWT Middleware (Edge-compatible verification)
- **Styling**: Tailwind CSS + `shadcn/ui` + `framer-motion` for fluid component layouts
- **Components**: `lucide-react`, `@radix-ui` generic models

---

## 🛠️ Core Modules Implemented

### 1. Authentication & Onboarding
- JWT-based explicit authentication spanning strict middleware protections (e.g. users cannot access `/admin`).
- Multi-step onboarding logic strictly separating standard users and administrators across roles.

### 2. Subscriptions & Billing Engine
- Modular plan tracking capturing user monthly/yearly intervals organically formatting internal invoices seamlessly.
- Allows admins to effectively track total system scale mapped natively.

### 3. Golf/Score Engine
- Seamlessly allows users to log their internal scoring metrics across valid configurations dynamically formatting their validation histories securely.

### 4. Draw Lifecycle Simulator
- Administrators can deploy automated simulated "Draws" containing matching algorithms parsing matching bounds against user entries.
- Distributes internal arrays into logical pools allocating structural constraints explicitly formatting `5-match`, `4-match`, and `3-match` variables cleanly!

### 5. Winner Processing & Payout Queue
- Seamlessly handles dynamic database aggregations natively verifying external proofs securely tracking payout phases (e.g., *Submitted* $\rightarrow$ *Approved* $\rightarrow$ *Paid*).

### 6. Admin Analytics
- Deep metrics visibility traversing Drizzle PostgreSQL dynamically serving realtime constraints (Active subs, Distributed Pools, Published Outcomes).

---

## 🏗️ Getting Started

### 1. Environment Variables
Create a standard `.env` mapping the following internal boundaries natively:

```env
# Database
DRIZZLE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require

# Authentication
JWT_SECRET=your_secure_randomly_generated_string

# Standard Configurations
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Installation & Setup
Make sure you have `bun` or `npm` strictly formatting local packages natively. 

```bash
bun install
```

### 3. Database Sync & Studio
Apply the schema natively formatting external neon instances:

```bash
bunx drizzle-kit push
```

And to boot the local database viewer explicitly tracking iterations:

```bash
bunx drizzle-kit studio
```

### 4. Boot Dev Environment
Start the NextJS hot-reloading parameters correctly generating routes locally:

```bash
bun run dev
```

The system maps explicitly across `http://localhost:3000`.

---

## 📡 Route Overview

### Universal Constraints
- `/` - Marketing Landing Page securely framing generic platform hooks.
- `/auth/sign-in` , `/auth/sign-up` - Explicit authentication sequences.
- `/onboarding` - Gateway logic formatting DB hooks capturing roles seamlessly.

### User Dashboard Shell 
- `/dashboard` - Aggregate Summary (Winning aggregates, score histories).
- `/dashboard/billing` - Subscription configuration loops.
- `/dashboard/scores` - Interactive list formatting personal limits.
- `/dashboard/draws` - Read-only view isolating monthly draw interactions.
- `/dashboard/winnings` - Submission portal linking Verification validations manually!

### Administrator Shell
- `/admin` - Deep validation aggregates configuring internal bounds.
- `/admin/charities` - Logic maintaining partner endpoints.
- `/admin/draws` - Execution gateway simulating Draw outcomes and Prize loops!
- `/admin/winners` - Review engine parsing Verification proofs structurally mapping paid logic safely.
- `/admin/reports` - Real-time statistics capturing platform KPI integrity implicitly!

---

## 🔮 Future Improvements / Next Steps
- Real-time provider webhooks hooking `Stripe` or external gateway providers.
- Automated mailing limits tracking email notifications across active states.
- System analytics parsing graph mapping trends natively over extensive loops explicitly. 
