# The Knowledge Exchange — P2P Academic Library

A decentralized peer-to-peer academic resource-sharing platform built with **Go** (backend) and **Next.js** (frontend). Implements an automated reputation-based governance mechanism.

## Architecture

```
┌─────────────────────┐          ┌─────────────────────┐
│   Next.js Frontend  │  ←→ API  │    Go Backend        │
│   (Port 3000)       │          │    (Port 8080)       │
│                     │          │                      │
│  • Dashboard        │          │  • User Service      │
│  • Library          │          │  • Library Service    │
│  • Search           │          │  • Reputation Service │
│  • Peers            │          │  • Search Service     │
│  • Analytics        │          │  • In-Memory Store    │
│  • Leaderboard      │          │                      │
│  • Learn Go         │          │  API: /api/*          │
└─────────────────────┘          └─────────────────────┘
```

## Go Concepts Demonstrated

| # | Concept | Files |
|---|---------|-------|
| 1 | Variables, Values & Types | `models/types.go` |
| 2 | Looping & Control Flow | `services/search_service.go` |
| 3 | Arrays & Slices | `models/resource.go`, `models/peer.go` |
| 4 | Maps & Structs | `store/memory.go`, `models/user.go` |
| 5 | Functions & Error Handling | `errors/errors.go`, `services/user_service.go` |
| 6 | Interfaces | `interfaces/storage.go`, `store/memory.go` |
| 7 | Pointers & Call Semantics | `services/user_service.go` |
| 8 | JSON & Unit Tests | `handlers/api_handler.go`, `services/*_test.go` |

## Quick Start

### Prerequisites
- Go 1.21+
- Node.js 18+
- npm

### Run Backend
```bash
cd p2p-library
go mod download
go run main.go
# Server starts at http://localhost:8080
```

### Run Frontend
```bash
cd p2p-library/frontend
npm install
npm run dev
# Frontend starts at http://localhost:3000
```

### Run Tests
```bash
cd p2p-library
go test ./...
```

## Docker Deployment

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with username |
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| GET | `/api/resources` | List all resources |
| POST | `/api/resources` | Upload resource |
| GET | `/api/resources/popular` | Popular resources |
| GET | `/api/resources/recent` | Recent resources |
| POST | `/api/resources/:id/download` | Download resource |
| POST | `/api/resources/:id/rate` | Rate resource |
| GET | `/api/search?q=...` | Search resources |
| GET | `/api/leaderboard` | Get leaderboard |
| GET | `/api/stats` | Network statistics |
| GET | `/api/library/stats` | Library statistics |
| GET | `/api/peers` | Connected peers |

## Reputation System

```
Score = (Uploads × 2) - Downloads + (AvgRating × 10)
```

| Classification | Score | Download Speed |
|---|---|---|
| ⭐ Contributor | > 50 | 100% |
| 🔶 Neutral | 0 – 50 | 70% |
| ⚠️ Leecher | < 0 | 30% |
