# Configuration & Build Files — Explained

This document explains the purpose of every configuration, build, and dependency file in the P2P Academic Library project.

---

## 1. `Dockerfile` (Backend — Go)

**Location:** `p2p-library/Dockerfile`  
**Purpose:** Instructions to package the Go backend into a Docker container image.

```dockerfile
# STAGE 1: Build — uses full Go SDK to compile the code
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./       # Copy dependency files first (for caching)
RUN go mod download          # Download dependencies
COPY . .                     # Copy all source code
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o p2p-library .
#   ^^^^^^^^^^^ Disable C bindings        ^^^^^^^^^^^^^^^^ Output binary name

# STAGE 2: Run — uses tiny Alpine Linux (no Go SDK needed)
FROM alpine:latest
RUN apk --no-cache add ca-certificates   # SSL certificates for HTTPS
COPY --from=builder /app/p2p-library .   # Copy ONLY the compiled binary
EXPOSE 8080                               # Declare the port
CMD ["./p2p-library"]                     # Start the server
```

**Key concept — Multi-stage build:**  
Stage 1 compiles the code (~800MB image with Go SDK). Stage 2 copies just the tiny binary into a minimal Alpine image (~15MB). This keeps the final image small and secure.

---

## 2. `Dockerfile` (Frontend — Next.js)

**Location:** `p2p-library/frontend/Dockerfile`  
**Purpose:** Instructions to package the Next.js frontend into a Docker container image.

```dockerfile
# STAGE 1: Build — uses Node.js to compile Next.js
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./        # Copy package.json and package-lock.json
RUN npm ci                   # Install exact dependency versions (faster than npm install)
COPY . .                     # Copy all frontend source code
ENV NEXT_TELEMETRY_DISABLED=1  # Disable Next.js analytics
RUN npm run build            # Build the production bundle

# STAGE 2: Run — only the built output, no source code
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public           # Static assets
COPY --from=builder /app/.next/standalone ./        # Server code
COPY --from=builder /app/.next/static ./.next/static  # CSS/JS bundles
EXPOSE 3000
CMD ["node", "server.js"]    # Start the Next.js production server
```

**Key concept — Standalone output:**  
Next.js `standalone` mode creates a self-contained `server.js` that doesn't need `node_modules`, making the image much smaller.

---

## 3. `docker-compose.yml`

**Location:** `p2p-library/docker-compose.yml`  
**Purpose:** Orchestrates both containers (backend + frontend) so you can start the entire application with **one command**: `docker compose up`.

```yaml
services:
  backend:                    # Service 1: Go API server
    build:
      context: .              # Build from root directory
      dockerfile: Dockerfile  # Using the backend Dockerfile
    ports:
      - "8080:8080"           # Map container port 8080 → host port 8080
    environment:
      - PORT=8080
    restart: unless-stopped   # Auto-restart if it crashes

  frontend:                   # Service 2: Next.js web UI
    build:
      context: ./frontend     # Build from frontend/ directory
      dockerfile: Dockerfile
    ports:
      - "3000:3000"           # Map container port 3000 → host port 3000
    depends_on:
      - backend               # ← Start backend FIRST, then frontend
    restart: unless-stopped
```

**How to use:**
```bash
docker compose up --build    # Build and start both services
docker compose down          # Stop everything
```

---

## 4. `go.mod`

**Location:** `p2p-library/go.mod`  
**Purpose:** Go's **module definition file** — equivalent to `package.json` in Node.js. It declares:

```go
module p2p-library            // Module name (used in import paths)

go 1.21                       // Minimum Go version required

require (
    github.com/google/uuid v1.6.0   // UUID generation for user IDs
    github.com/gorilla/mux v1.8.1   // HTTP router for REST API endpoints
    github.com/rs/cors v1.10.1      // CORS middleware for cross-origin requests
)
```

| Dependency | What it does |
|---|---|
| `google/uuid` | Generates unique IDs like `30fe367b-9d55-...` for each user |
| `gorilla/mux` | Routes HTTP requests to handlers (`/api/users → GetUsers()`) |
| `rs/cors` | Allows the frontend on port 3000 to call the API on port 8080 |

**How to use:**
```bash
go mod download    # Download all dependencies
go mod tidy        # Clean up unused dependencies
```

---

## 5. `go.sum`

**Location:** `p2p-library/go.sum`  
**Purpose:** Go's **dependency lock file** — equivalent to `package-lock.json` in Node.js.

```
github.com/google/uuid v1.6.0 h1:NIvaJDMOsjHA8n1jAhLSgzrAzy1Hgr+hNrb57e+94F0=
github.com/google/uuid v1.6.0/go.mod h1:TIyPZe4MgqvfeYDBFedMoGGpEw/LqOeaOT+nhxU+yHo=
github.com/gorilla/mux v1.8.1 h1:TuBL49tXwgrFYWhqrNgrUNEY92u81SPhu7sTdzQEiWY=
...
```

Each line contains:
- **Module path** and **version** (`github.com/google/uuid v1.6.0`)
- **Cryptographic hash** (`h1:NIvaJDM...`) — ensures the exact same code is downloaded every time

**Key points:**
- You **never edit this file manually** — Go generates it automatically
- It prevents "works on my machine" problems by locking exact versions
- It's committed to Git so everyone on the team uses identical dependencies

---

## Summary Table

| File | Analogy (Node.js) | Purpose |
|------|-------------------|---------|
| `Dockerfile` (backend) | — | Package Go server into a container |
| `Dockerfile` (frontend) | — | Package Next.js app into a container |
| `docker-compose.yml` | — | Start both containers with one command |
| `go.mod` | `package.json` | Declare module name, Go version, and dependencies |
| `go.sum` | `package-lock.json` | Lock exact dependency versions with checksums |
