# 🌿 Agentic Health & Wellness AI Platform

Full-stack Health & Wellness platform powered by **Google Gemini 2.5 Flash**, **Firebase Auth & Firestore**, **FastAPI**, **Next.js 14**, and **Model Context Protocol (MCP)** for wearable device integration.

---

## 🌟 Key Features

- **Agentic AI Coach**: Powered by Google GenAI SDK (Gemini 2.5 Flash) with dynamic safety settings, non-diagnostic guardrails, and real-time SSE streaming.
- **Wearable Device Integration**: MCP Server (`mcp_servers/health_wearables_server.py`) exposing HRV, Sleep Stages, Activity, and CGM Glucose metrics tools to the AI agent.
- **Secure Firebase Auth & Firestore**: Firebase ID Token Bearer auth guarding FastAPI endpoints and user-isolated Firestore rules (`request.auth.uid`).
- **Persistent Sessions**: Multi-turn conversation memory auto-saved to Firestore per user.
- **Next.js 14 Dashboard UI**: Modern dark mode aesthetic with emerald glassmorphism, responsive metrics widgets, dynamic goal tags, and live chat drawer.

---

## 🛠️ Architecture Setup

```
health_wellness_app/
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── agents/           # Gemini AI Agent Engine
│   │   ├── core/             # Firebase Admin & Auth dependencies
│   │   ├── db/               # Firestore Session Repository
│   │   ├── mcp/              # MCP Client Connector
│   │   ├── routers/          # FastAPI Routes (SSE streaming)
│   │   └── schemas/          # Pydantic data schemas
│   └── main.py
├── frontend/                 # Next.js 14 Web Application
│   ├── src/
│   │   ├── app/              # Next.js App Router & Layout
│   │   ├── components/       # Dashboard & Chat components
│   │   ├── context/          # React Auth Context
│   │   └── lib/              # Firebase Client SDK
├── mcp_servers/              # Wearable Device MCP Server
│   └── health_wearables_server.py
├── firestore.rules           # Firebase Security Rules
└── firebase.json             # Firebase CLI configuration
```

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp ../.env.example .env
# Add your GEMINI_API_KEY to .env
uvicorn app.main:app --reload --port 8000
```

### 2. MCP Wearables Server Setup
```bash
cd mcp_servers
pip install -r requirements.txt
python health_wearables_server.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp ../.env.example .env.local
# Add your NEXT_PUBLIC_FIREBASE_* keys
npm run dev
```

Visit `http://localhost:3000` to interact with your AI Health Coach!
