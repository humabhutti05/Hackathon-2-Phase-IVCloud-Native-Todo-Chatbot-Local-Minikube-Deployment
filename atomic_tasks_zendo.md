# Atomic AI-Executable Tasks: Zendo

## Task 1: Dockerfile - Frontend
- **Type**: Generation
- **tool**: Gordon
- **Prompt**: `docker ai "Create a production multi-stage Dockerfile for a Next.js application located in ./frontend. Use Node 18 alpine, npm ci, standalone output, expose port 3000, optimized for Kubernetes."`
- **Output**: `frontend/Dockerfile`

## Task 2: Dockerfile - Backend
- **Type**: Generation
- **tool**: Gordon
- **Prompt**: `docker ai "Create a production Dockerfile for a FastAPI Python 3.11 application in ./backend. Install requirements.txt, use uvicorn on port 8000, run as non-root, optimized for containers."`
- **Output**: `backend/Dockerfile`

## Task 3: Build & Tag
- **Type**: Execution
- **tool**: Terminal
- **Command**: 
  ```bash
  docker build -t zendo-frontend:latest ./frontend
  docker build -t zendo-backend:latest ./backend
  ```

## Task 4: Helm Chart Generation
- **Type**: Generation
- **Tool**: Claude Code
- **Goal**: Generate `charts/zendo_generated` with 3 services (Front/Back/DB).
- **Output**: Directory structure with `Chart.yaml`, `values.yaml`, `templates/*.yaml`.

## Task 5: Minikube Deployment
- **Type**: Execution
- **Tool**: kubectl-ai
- **Prompt**: `kubectl-ai "deploy the zendo helm chart to minikube with all services and verify pods become ready"`
- **Command**: `helm install zendo ./charts/zendo`

## Task 6: Health Analysis
- **Type**: Analysis
- **Tool**: kagent
- **Prompt**: `kagent "analyze cluster health for zendo deployment and report risks"`
