# HumanStories.app

### *Real Stories. Real People. Backend-First Integrity.*

**HumanStories** is a storytelling ecosystem designed to reclaim digital intimacy. Built with a "Human-First" philosophy, this API serves as the **Single Source of Truth** for the entire platform, ensuring that even in a decentralized poly-repo environment, the data remains pristine and type-safe.

---

## 📑 Table of Contents

1. [The "Why": Mission & Humanity](#-the-why-mission--humanity)
2. [The Evolution: The Bootstrap Lessons of BazarBhai](#️-the-evolution-the-bootstrap-lessons-of-bazarbhai)
3. [The Solution: Backend-Led Integrity](#-the-solution-backend-led-integrity)
4. [Technical Stack](#-technical-stack)
5. [API Documentation](#-api-documentation)
6. [Installation & Detailed Setup](#️-installation--detailed-setup)

---

## 🌍 The "Why": Mission & Humanity

In 2026, the internet is flooded with AI noise. **HumanStories** provides a space for raw, authentic human experiences. Our engineering philosophy is simple: **Technology should be invisible.** It should work so perfectly that the user only feels the connection, not the code.

---

## ⚠️ The Evolution: The Bootstrap Lessons of BazarBhai

Before this, I founded **BazarBhai**, a startup connecting village vendors with local buyers.

* **The Grind:** I operated BazarBhai for months with **zero funding**, keeping the platform alive through sheer persistence and late-night coding sessions. While the business validated a real need, the lack of capital to scale operations made it impossible to sustain the growth.
* **The Technical Debt:** In the rush to build while bootstrapping, I managed four disconnected repositories (Backend, Client, Admin, Seller) in pure JavaScript.
* **The Realization:** "Type-Drift" and silent crashes across the apps were the biggest enemies of my productivity. I learned that when resources are low, **architecture must be high.**

HumanStories is the "Senior-First" evolution. It’s built to be so robust that even if the Web and Mobile apps are in different repositories, they are forced to align with the Backend's strict Zod schemas and OpenAPI contracts.

---

## 🚀 The Solution: Backend-Led Integrity

In this Poly-repo architecture, the **HumanStories API** prevents "Type-Drift" through:

* **Strict Zod Contracts:** Every request and response is validated. If it's not in the schema, it doesn't get in the DB.
* **OpenAPI/Swagger Source of Truth:** The API documentation is the master blueprint used to generate types for our mobile and web apps.
* **Modular Clean Architecture:** Separating domain logic from infrastructure to ensure the system can evolve without breaking.

---

## 🛠 Technical Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Language** | `TypeScript` | Strict type-safety across the domain |
| **Backend** | `Node.js` + `Express` | Modular, service-oriented API |
| **Database** | `PostgreSQL` + `Drizzle ORM` | High-performance relational mapping |
| **Validation** | `Zod` | End-to-end runtime type safety |
| **Email** | `Nodemailer` | Branded OTP & Story interactions |

---

## 📖 API Documentation

The API is fully documented and interactive. You can explore the modules for **Auth**, **Stories**, and **Reactions** live.

* **Live Docs:** [api.humanstories.app/docs](https://api.humanstories.app/docs)
<!-- * **Visual Guide:** Screenshots of the interactive UI are available in the `/assets` directory. -->

---

## ⚙️ Installation & Detailed Setup

Follow these steps to get your local development environment running.

### 1. Clone the Repository

```bash
git clone https://github.com/saifulalomdev/humanstories-api.git
cd humanstories-api

```

### 2. Install Dependencies

We use `pnpm` for fast, efficient package management.

```bash
pnpm install

```

### 3. Environment Configuration

Copy the example environment file and update it with your local credentials (DB string, SMTP settings, etc.).

```bash
# Create your local .env file
cp .env.example .env

# Now open .env and add your secrets:
# nano .env OR code .env

```

### 4. Database Setup

Ensure your PostgreSQL instance is running, then sync the schema.

```bash
# Generate migrations based on Drizzle schemas
pnpm db:generate

# Push the schema changes to your database
pnpm db:push

```

### 5. Start Development Server

```bash
# Runs the server with nodemon for auto-reloads
pnpm dev

```

The server will start on **`http://localhost:5000`**. You can access the API docs at **`http://localhost:5000/docs`**.

---

## 🏛 Directory Structure

```text
├── src
│   ├── app/                # App initialization & middleware
│   ├── config/             # Zod-validated Environment & Mail configs
│   ├── core/               # Shared Error handling & Utilities
│   ├── infrastructure/     # DB Schemas (Drizzle), Repositories, & Validators
│   ├── modules/            # Domain Logic (Auth, Story, Reaction)
│   └── types/              # Global Express & TS definitions

```

---

### **Final Word from Saiful:**

BazarBhai taught me how to survive as a founder. HumanStories is me showing how I build as an engineer.