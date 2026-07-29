# 📊 Real-Time Analytics Dashboard

<div align="center">

**An enterprise-grade, full-stack real-time analytics platform with Role-Based Access Control (RBAC) built using NestJS, Socket.io, Next.js & Supabase**

⚡ Continuous Live Data Simulator • 📈 Real-Time Charts • 👑 Admin vs Viewer RBAC • 🔒 JWT Auth • 🐳 Docker Containerized • 🗄️ Supabase PostgreSQL

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/razazaheer12/Real-Time-Analytics-Dashboard)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

</div>

---

## 🌟 Overview

**Real-Time Analytics Dashboard** is a high-performance telemetry and data visualization platform engineered to broadcast, stream, and visualize live system metrics and user analytics in real-time. The application features an automated background simulation engine (`DataSimulatorService`) that pushes live analytics updates every 4 seconds over persistent WebSockets, providing an instant visual overview of active metrics, conversion rates, and server stats without manual page refreshes.

Built as a clean monorepo architecture, it combines a robust **NestJS** microservice-style backend, **Socket.io** event engine, **Supabase PostgreSQL** data storage, fine-grained **Role-Based Access Control (Admin & Viewer roles)**, and a modern **Next.js / React** frontend styled with **Tailwind CSS**.

---

## 🔐 User Roles & Authorization (RBAC)

The platform implements granular multi-role authentication to ensure secure data access and system management:

| Role | Access Level | Permissions & Capabilities |
|---|---|---|
| 👑 **Admin** | Read & Write / Full Control | • Full access to live telemetry graphs and historical database logs<br>• Can trigger, start, pause, or reconfigure the `DataSimulatorService`<br>• Manage platform settings, user permissions, and API key management |
| 👁️ **Viewer** | Read-Only | • Subscribes to live WebSocket telemetry updates (`analyticsUpdate`)<br>• Access to personal interactive dashboard widgets & trend charts<br>• Restricted from accessing simulator control endpoints or admin configurations |

---

## 🎯 Features

| Feature | Description |
|---|---|
| ⚡ **Live Data Engine** | Automated `DataSimulatorService` pushing real-time metrics & telemetry every 4 seconds via WebSockets |
| 👥 **Role-Based Security** | Explicit **Admin** (System controls & settings) and **Viewer** (Read-only analytics) access layers |
| 📈 **Interactive Visualizations** | Dynamic analytics charts, trend cards, and live widgets powered by Recharts & Tailwind CSS |
| 🔄 **Low-Latency Streaming** | Bidirectional real-time state synchronization using Socket.io client & server layers |
| 🔐 **Authentication & Security** | JWT-based auth guard with password hashing, RBAC guards, protected routes, and session persistence |
| 🗄️ **Database Integration** | Persistent historical metrics storage powered by Supabase PostgreSQL DB |
| 🐳 **Docker Containerized** | Multi-stage Docker build setup (`Dockerfile` & `.dockerignore`) for continuous cloud deployment |
| 📁 **Clean Monorepo Setup** | Unified repository housing both backend and frontend codebases with clear isolation |
| 📱 **Responsive Dark UI** | Sleek, modern dashboard interface designed for mobile, tablet, and desktop viewports |

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **Next.js / React** — Reactive SSR & CSR client framework
- 🎨 **Tailwind CSS** — Modern utility-first styling & dark mode UI
- 📊 **Recharts / Chart.js** — Interactive data visualization & real-time metric graphs
- 🔌 **Socket.io-client** — WebSocket client listener for instant metric streaming
- 🧭 **Axios & Hooks** — Efficient API data fetching & state management

### Backend
- 🦁 **NestJS** — Progressive Node.js framework for scalable server-side code
- 🔌 **Socket.io** — Low-latency WebSocket gateway for real-time data broadcasting
- 🗄️ **Supabase (PostgreSQL)** — Managed cloud database & relational data persistence
- 🔑 **JWT & Passport + Roles Guard** — Stateless token authentication with Admin/Viewer RBAC enforcement
- ⚙️ **TypeScript** — End-to-end static typing across models and gateways

### Deployment & DevOps
| Layer | Infrastructure / Platform |
|---|---|
| **Architecture** | Monorepo (`frontend/` + `backend/`) |
| **Containerization** | Docker (`Dockerfile` & `.dockerignore` included) |
| **Database** | Supabase PostgreSQL Cloud |
| **Local Environment** | Node.js (v18+) & Localhost setup |

---

## ⚡ System Architecture Representation Diagram (ARD)

```text
                       ┌─────────────────────────────────────────┐
                       │           React / Next.js UI            │
                       │   (Admin / Viewer Dashboards & Auth)    │
                       └───────────────────┬─────────────────────┘
                                           │
                           HTTP REST APIs  │  Socket.io WebSockets
                           (JWT Auth/RBAC) │  (Live 4s Pushes)
                                           ▼
                       ┌─────────────────────────────────────────┐
                       │             NestJS Backend              │
                       │ ┌─────────────────────────────────────┐ │
                       │ │        Roles Guard (RBAC)           │ │
                       │ │  [Admin Control / Viewer Read-Only] │ │
                       │ └──────────────────┬──────────────────┘ │
                       │ ┌──────────────────┴──────────────────┐ │
                       │ │        DataSimulatorService         │ │
                       │ │   (Generates Telemetry Every 4s)    │ │
                       │ └─────────────────────────────────────┘ │
                       └───────────────────┬─────────────────────┘
                                           │
                                  PostgreSQL Connection
                                           ▼
                       ┌─────────────────────────────────────────┐
                       │          Supabase Cloud Database        │
                       └─────────────────────────────────────────┘
```
                       
---

## Workflow

Users authenticate via NestJS JWT endpoint and receive a token containing their designated role (Admin or Viewer). Upon login, the Next.js dashboard establishes a WebSocket connection with the Socket.io Gateway. The backend DataSimulatorService automatically computes real-time analytics (CPU, active users, transactions, response times) every 4 seconds. Telemetry updates are broadcasted to all authenticated clients while administrative actions (e.g. simulator controls) are restricted exclusively to Admin role tokens. Telemetry data is persisted in Supabase PostgreSQL for historical analysis.

---

## 📂 Project Structure

```
Real-Time-Analytics-Dashboard/
│
├── backend/
│   ├── src/
│   │   ├── auth/            # JWT authentication, RBAC roles guards & strategies
│   │   ├── analytics/       # Data simulator, telemetry logic & services
│   │   ├── events/          # Socket.io gateways & WebSocket event handlers
│   │   ├── database/        # Supabase PostgreSQL client & schemas
│   │   └── main.ts          # NestJS application bootstrap
│   ├── Dockerfile           # Backend containerization setup
│   ├── .dockerignore        # Docker build exclusion rules
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/             # Next.js App Router pages (Login, Admin, Viewer Dashboard)
    │   ├── components/      # Dynamic charts, metric widgets & layout UI
    │   ├── hooks/           # Custom useSocket & useAnalytics hooks
    │   └── lib/             # Socket.io client & API helpers
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v18+
- **npm** or **yarn**
- **Supabase account** (Free tier)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/razazaheer12/Real-Time-Analytics-Dashboard.git
cd Real-Time-Analytics-Dashboard
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
CLIENT_URL=http://localhost:3000
```

Start the backend development server:

```bash
npm run start:dev
```

The backend will start running on **http://localhost:5000** with WebSocket support enabled.

### 3️⃣ Frontend Setup

In a new terminal window, navigate to the `frontend/` directory:

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The dashboard will be available at **http://localhost:3000** 🎉

---

## 🔌 WebSocket & Event API Reference

| Event Name | Direction | Allowed Role | Description |
|---|---|---|---|
| `connection` | Client → Server | Admin / Viewer | Client establishes WebSocket connection |
| `subscribeToAnalytics` | Client → Server | Admin / Viewer | Subscribes client to real-time telemetry stream |
| `analyticsUpdate` | Server → Client | Admin / Viewer | Emits updated metrics data every 4 seconds |
| `triggerSimulatorAction` | Client → Server | 👑 Admin Only | Modifies or triggers the DataSimulatorService |
| `getHistoricalMetrics` | Client → Server | Admin / Viewer | Requests historical data range from Supabase |
| `metricsHistory` | Server → Client | Admin / Viewer | Returns historical analytics payload |
| `disconnect` | Client → Server | Admin / Viewer | Client closes persistent WebSocket channel |

---

## 📸 Dashboard Preview

> 💡 Sleek dark-themed analytics dashboard interface showcasing live telemetry graphs and dynamic metric cards.

```
+-----------------------------------------------------------------------+
|  📊 Real-Time Analytics Dashboard           [Role: Admin] 🟢 Live     |
+-----------------------------------------------------------------------+
|  [ ⚡ CPU Usage: 42% ]  [ 👥 Active Users: 1,284 ]  [ 🚀 RPS: 340 ]   |
+-----------------------------------------------------------------------+
|  📈 LIVE TELEMETRY STREAM (Updated every 4s)                          |
|                                                                       |
|      /\      /\                                                       |
|     /  \    /  \    /\                                                |
|    /    \__/    \__/  \                                               |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## 👤 Author

**Raza Zaheer**

- 🌐 **Portfolio:** [raza-zaheer-portfolio-web-developer.vercel.app](https://raza-zaheer-portfolio-web-developer.vercel.app)
- 💼 **GitHub:** [@razazaheer12](https://github.com/razazaheer12)

---

## 📄 License

This project is open-source and available under the **MIT License**.

---

⭐ If you found this repository helpful, consider giving it a star!  
Made with 💜, NestJS & Next.js
