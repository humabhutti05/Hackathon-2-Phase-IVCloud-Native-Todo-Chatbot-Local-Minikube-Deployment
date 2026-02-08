# 🗂️ Phase IV Submission Pack — Zendo Cloud Native Todo Chatbot

**Environment:** Local Minikube
**Application:** Zendo Todo Chatbot (Frontend: Next.js, Backend: FastAPI, Database: PostgreSQL)
**Workflow:** Spec-Driven, AI-Assisted (Gordon, kubectl-ai, kagent, Helm)

---

## 1️⃣ Locked Infrastructure Specification

**File:** `specs/zendo_spec_locked.md`

**Summary:**

* **Frontend (zendo-frontend)**
  * Next.js SPA, 2 replicas
  * Container port: 3000, NodePort: 30000
  * Env: `NEXT_PUBLIC_API_URL` → backend service
  * Health check: `/` HTTP 200

* **Backend (zendo-backend)**
  * FastAPI Python 3.11, 2 replicas
  * Container port: 8000, NodePort: 30001
  * Env: `DATABASE_URL`, `OPENAI_API_KEY`
  * Dependencies: `requirements.txt` (`psycopg2-binary` included)

* **Database (zendo-db)**
  * Postgres 15-alpine, 1 replica, ClusterIP only
  * PVC: 1Gi for persistence
  * Secrets: DB credentials

* **Networking:**
  * Frontend → Browser via NodePort
  * Backend → NodePort for API
  * Backend → DB via Cluster DNS

* **AI Agents:**
  * Gordon (Docker AI)
  * kubectl-ai (K8s manifest & deployment)
  * kagent (cluster analysis & optimization)

---

## 2️⃣ Execution Plan

**File:** `execution_plan_zendo.md`

| Phase | Task                   | AI Tool        | Prompt / Command                                                                                                                                                                      | Validation                                                                  |
| ----- | ---------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1     | Generate Dockerfiles   | Gordon         | `docker ai "Create a multi-stage Dockerfile for Next.js ./frontend ..."`<br>`docker ai "Create a Dockerfile for FastAPI ./backend ..."`                                               | Dockerfile exists, syntax valid                                             |
| 1     | Build Images           | Docker         | `docker build -t zendo-frontend:latest ./frontend`<br>`docker build -t zendo-backend:latest ./backend`<br>`minikube image load zendo-frontend`<br>`minikube image load zendo-backend` | Images build successfully, `docker images` shows tags                       |
| 2     | Generate K8s Manifests | kubectl-ai     | `kubectl-ai "Create deployments & services: zendo-frontend 2 replicas NodePort 30000, zendo-backend 2 replicas NodePort 30001, zendo-db PVC 1Gi ClusterIP with secrets"`              | `kubectl apply --dry-run=client` passes                                     |
| 3     | Package Helm Chart     | Claude Code    | `Generate Helm chart charts/zendo with parameterized values.yaml, templates for deployments, services, PVC, secrets, NodePorts, ClusterIP`                                            | `helm lint charts/zendo` passes                                             |
| 4     | Deploy Helm Chart      | Helm           | `helm install zendo ./charts/zendo`                                                                                                                                                   | `kubectl get pods` shows all pods Running/Ready                             |
| 4     | Verify Deployment      | kagent/kubectl | `kubectl get pods`<br>`kubectl get svc`<br>`kubectl logs <pod>`<br>`kagent "analyze cluster health"`                                                                                  | Frontend accessible via Minikube NodePort, backend responding, DB connected |
| 5     | Scaling                | kubectl-ai     | `kubectl-ai "scale zendo-backend to 3 replicas"`                                                                                                                                      | `kubectl get pods` shows 3 backend pods running                             |
| 6     | Optimization           | kagent         | `kagent "optimize CPU/memory allocation for zendo services"`                                                                                                                          | Resource allocation verified via `kubectl top pods`                         |

---

## 3️⃣ Atomic Task Plan

**File:** `atomic_tasks_zendo.md`

* Each task includes: Task ID, AI Tool, Exact Prompt, Expected Output, Validation Step, Evidence to Collect
* Examples:

**Task 1.1**
* **Goal:** Generate Frontend Dockerfile
* **AI Tool:** Gordon
* **Prompt:**
```
docker ai "Create a multi-stage Dockerfile for Next.js 16 application in ./frontend using Node 18-alpine, npm ci, expose port 3000"
```
* **Validation:** File `frontend/Dockerfile` exists
* **Evidence:** Screenshot/log of Docker AI output

**Task 1.2**
* Backend Dockerfile (same structure, Python 3.11, uvicorn)

**Task 1.3**
* Build images & load into Minikube (see Execution Plan)

**Task 2.x**
* Generate manifests via kubectl-ai (prompt + dry-run validation)

**Task 3.x**
* Helm chart packaging and lint validation

**Task 4.x**
* Deployment and verification using Helm & kagent

**Task 5.x**
* Scaling & optimization

**Task 6.x**
* Validation steps (see Validation Plan)

---

## 4️⃣ Validation Plan

**File:** `zendo_validation.md`

Steps to verify the deployment:

1. **Pods & Services**
```bash
kubectl get pods
kubectl get svc
```

2. **PVC Check**
```bash
kubectl get pvc
```

3. **Backend Logs**
```bash
kubectl logs <backend-pod>
```

4. **Frontend Access**
```bash
minikube service zendo-frontend
# Browser should load Todo Chatbot UI
```

5. **Scaling Verification**
```bash
kubectl get pods
```

6. **kagent Health Check**
```bash
kagent "analyze zendo deployment health"
```

7. **Resource Optimization**
```bash
kagent "optimize CPU/memory for zendo services"
```

---

## 5️⃣ Helm Chart Structure (charts/zendo)

```
charts/zendo/
├── Chart.yaml
├── values.yaml
├── templates/
│   ├── deployment-frontend.yaml
│   ├── service-frontend.yaml
│   ├── deployment-backend.yaml
│   ├── service-backend.yaml
│   ├── deployment-db.yaml
│   ├── service-db.yaml
│   ├── pvc-db.yaml
│   └── secrets.yaml
└── _helpers.tpl
```

* All ports, replicas, image tags parameterized in values.yaml

---

## 6️⃣ Spec-Driven AI Workflow Documentation

**File:** `spec_driven_dev_explanation.md`

* Workflow: Spec → Plan → Atomic Tasks → AI Execution → Validation
* AI Agents used: Gordon, kubectl-ai, kagent, Claude Code
* Benefits:
  * Repeatable, declarative deployment
  * No manual coding
  * Easy scaling and optimization
  * Full local testing with Minikube

---

## 7️⃣ Demo Instructions (Grader-Friendly)

1. Start Minikube
```bash
minikube start
```

2. Build Docker Images & Load into Minikube
```bash
docker build -t zendo-frontend:latest ./frontend
docker build -t zendo-backend:latest ./backend
minikube image load zendo-frontend
minikube image load zendo-backend
```

3. Deploy Helm Chart
```bash
helm install zendo ./charts/zendo
```

4. Verify Pods & Services
```bash
kubectl get pods
kubectl get svc
```

5. Access Frontend
```bash
minikube service zendo-frontend
```

6. Run kagent Analysis & Optimization
```bash
kagent "analyze zendo deployment health"
kagent "optimize CPU/memory for zendo services"
```

7. Test Todo Chatbot functionality (create, read, update, delete todos)
