# Atomic AI-Executable Task Plan

## Phase 1: Containerization (Active Agent: Docker AI / Gordon)

### Task 1.1: Frontend Dockerfile Generation
- **Tool**: Docker AI (Gordon)
- **Prompt**: `docker ai "Generate a production-ready Dockerfile for my Todo Chatbot frontend web application. Detect framework automatically and optimize for small image size, security, and fast startup."`
- **Expected Output**: Multi-stage `frontend/Dockerfile` for Next.js 16.
- **Validation**: `docker build -t todo-frontend ./frontend`
- **Recovery**: `docker ai "Fix the Dockerfile to support Next.js standalone output and ensure node_modules are handled correctly"`

### Task 1.2: Backend Dockerfile Generation
- **Tool**: Docker AI (Gordon)
- **Prompt**: `docker ai "Generate a production-ready Dockerfile for my Todo Chatbot backend API service. Detect language automatically and optimize for container deployment."`
- **Expected Output**: `backend/Dockerfile` for Python/FastAPI.
- **Validation**: `docker build -t todo-backend ./backend`
- **Recovery**: `docker ai "Update Dockerfile to install build-essential for psycopg2 binary dependencies"`

### Task 1.3: Build & Tag
- **Tool**: Docker CLI
- **Prompt**: `docker ai "Build Docker images for frontend and backend and tag them as todo-frontend:latest and todo-backend:latest"`
- **Command**: `docker-compose build` (if compose generated) or individual `docker build` commands.
- **Validation**: `docker images` shows both images.

## Phase 2: Helm Chart Generation (Active Agent: Claude Code)

### Task 2.1: Chart Structure & Values
- **Tool**: Claude Code
- **Prompt**: `Generate a Helm chart for a two-service Todo Chatbot application...` (See full prompt in request)
- **Expected Output**: `charts/todo-chatbot/` directory with `Chart.yaml` and `values.yaml`.
- **Validation**: `helm lint ./charts/todo-chatbot`

### Task 2.2: Template Generation
- **Tool**: Claude Code
- **Prompt**: (Implicit in 2.1) Generate deployment and service yamls.
- **Expected Output**: `templates/deployment-frontend.yaml`, `templates/service-frontend.yaml`, etc.
- **Validation**: `helm template ./charts/todo-chatbot`

## Phase 3: Deployment Operations (Active Agent: kubectl-ai)

### Task 3.1: Initial Deployment
- **Tool**: kubectl-ai
- **Prompt**: `kubectl-ai "deploy my helm chart for todo chatbot to minikube with 2 replicas each service"`
- **Command**: `helm install todo-chatbot ./charts/todo-chatbot --set replicaCount=2`
- **Validation**: `kubectl get pods`

### Task 3.2: Scaling
- **Tool**: kubectl-ai
- **Prompt**: `kubectl-ai "scale todo-frontend to 3 replicas and todo-backend to 2 replicas"`
- **Command**: `kubectl scale deployment todo-chatbot-frontend --replicas=3`
- **Validation**: `kubectl get deployment todo-chatbot-frontend`

### Task 3.3: Analysis & Self-Healing
- **Tool**: kubectl-ai / kagent
- **Prompt**: `kubectl-ai "check why any todo chatbot pods are failing and fix automatically"`
- **Validation**: `kubectl get events`

---
*Files generated relative to workspace root.*
