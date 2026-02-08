# Phase IV: Local Kubernetes Deployment Execution Plan
## Cloud Native Todo Chatbot (Zendo) on Minikube

This execution plan outlines the spec-driven deployment of the Zendo application using AI agents (Gordon, kubectl-ai, kagent) and Helm charts on a local Minikube cluster.

### Phase 1: Containerization (AI-Assisted Docker)
**Objective**: Build optimized Docker images for Frontend and Backend using Gordon (Docker AI).

| Task ID | Description | AI Agent | Prompt to Run | Validation | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1.1** | Generate Backend Dockerfile | Gordon / Claude Code | `Generate a multi-stage Dockerfile for a FastAPI application in ./backend. Use python:3.11-slim. Install dependencies from requirements.txt. Expose port 8000. Use a non-root user for security.` | `docker build -t zendo-backend:latest ./backend` returns success. | `Dockerfile` content, Build logs |
| **1.2** | Generate Frontend Dockerfile | Gordon / Claude Code | `Generate a multi-stage Dockerfile for a Next.js 16 application in ./frontend. Use node:18-alpine. Run 'npm cip' before build. Expose port 3000. Use a non-root user.` | `docker build -t zendo-frontend:latest ./frontend` returns success. | `Dockerfile` content, Build logs |
| **1.3** | Verify Application Running Locally | Docker CLI | `docker-compose up` (Generate if needed) or `docker run` commands. | Access `localhost:3000` and `localhost:8000/docs`. | Screenshot of running app |

### Phase 2: Kubernetes Manifest Generation
**Objective**: Create initial Kubernetes manifests using `kubectl-ai`.

| Task ID | Description | AI Agent | Prompt to Run | Validation | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **2.1** | Define Database Manifests | kubectl-ai | `Create a Kubernetes deployment for a PostgreSQL 15 database. Use a PersistentVolumeClaim of 1GB. Expose port 5432 via ClusterIP service 'zendo-db'. Include a Secret for POSTGRES_PASSWORD.` | `kubectl apply --dry-run=client -f db.yaml` | `db-deployment.yaml`, `db-service.yaml`, `db-pvc.yaml` |
| **2.2** | Define Backend Manifests | kubectl-ai | `Create a Kubernetes deployment for 'zendo-backend' with 2 replicas. Image: zendo-backend:latest. Env vars: DATABASE_URL (valueFrom secret zendo-db-secret), OPENAI_API_KEY (from secret). Service: ClusterIP on port 8000.` | `kubectl apply --dry-run=client -f backend.yaml` | `backend-deployment.yaml`, `backend-service.yaml` |
| **2.3** | Define Frontend Manifests | kubectl-ai | `Create a Kubernetes deployment for 'zendo-frontend' with 2 replicas. Image: zendo-frontend:latest. Env var: NEXT_PUBLIC_API_URL (point to backend service). Service: NodePort exposed on port 30000.` | `kubectl apply --dry-run=client -f frontend.yaml` | `frontend-deployment.yaml`, `frontend-service.yaml` |

### Phase 3: Helm Chart Packaging
**Objective**: Standardize deployment using Helm.

| Task ID | Description | AI Agent | Prompt to Run | Validation | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **3.1** | Create Helm Chart Structure | Claude Code | `Convert the generated Kubernetes manifests into a Helm Chart named 'zendo'. Place them in ./charts/zendo. Create values.yaml with image tags, replica counts, and service ports.` | `helm lint ./charts/zendo` returns no errors. | Directory structure of `charts/zendo` |
| **3.2** | Templatize Manifests | Claude Code | `Update deployment.yaml and service.yaml in the Helm chart to use {{ .Values... }} for image, tag, replicas, and ports.` | `helm template ./charts/zendo` shows valid YAML with values substituted. | `values.yaml` content |

### Phase 4: Deployment & AI Ops
**Objective**: Deploy to Minikube and monitor using `kagent`.

| Task ID | Description | AI Agent | Prompt to Run | Validation | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **4.1** | Start Minikube & Load Images | Minikube CLI | `minikube start`; `minikube image load zendo-backend:latest`; `minikube image load zendo-frontend:latest` | `minikube status`; `minikube image ls` | Terminal output showing cluster UP and images loaded |
| **4.2** | Deploy Helm Chart | Helm CLI | `helm install zendo ./charts/zendo --set backend.openaiApiKey=$OPENAI_API_KEY` | `kubectl get pods` shows all pods Running. | Output of `helm list` and `kubectl get all` |
| **4.3** | Analyze Deployment Health | kagent | `kagent "analyze the status of the zendo release. Are all pods running and ready? Check for restarts."` | Agent confirmation of healthy status. | Agent output log |
| **4.4** | Test Application | Browser / Curl | Access `minikube service zendo-frontend --url` | Functional chat interface connecting to backend. | Screenshot of UI |
| **4.5** | Optimize Resources | kagent | `kagent "analyze resource usage of zendo-backend pods and suggest CPU/memory limits."` | Suggestion or applied patch for resource limits. | Agent recommendation text |

### Phase 5: Verification & Handover
**Objective**: Final sign-off.

| Task ID | Description | AI Agent | Prompt to Run | Validation | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **5.1** | Spec Compliance Check | Claude Code | `Verify the deployed resources match the initial infrastructure spec (replicas, ports, services).` | Verification report. | Comparison checklist |

---
**Tools Required**:
- Docker Desktop (with Gordon enabled if possible)
- Minikube
- Helm
- kubectl
- kubectl-ai (optional, simulated via prompt if not installed)
- kagent (optional, simulated via prompt if not installed)
