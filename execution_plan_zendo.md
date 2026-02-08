# Phase IV Execution Plan: Zendo Deployment

## Phase 1: Containerization (Agent: Gordon)
**Tasks**:
1.  **Frontend Build**: Generate multi-stage Dockerfile for Next.js. Build & Tag `zendo-frontend:latest`.
    *   *Prompt*: `docker ai "Create a production multi-stage Dockerfile for a Next.js application..."`
    *   *Validation*: `docker run -p 3000:3000 zendo-frontend:latest`
2.  **Backend Build**: Generate production Dockerfile for FastAPI. Build & Tag `zendo-backend:latest`.
    *   *Prompt*: `docker ai "Create a production Dockerfile for a FastAPI Python 3.11 application..."`
    *   *Validation*: `docker run -p 8000:8000 zendo-backend:latest`

## Phase 2: Helm Packaging (Agent: Claude Code)
**Tasks**:
1.  **Chart Scaffold**: Create `zendo` chart structure.
2.  **Database Component**: Define Postgres Deployment, Service (ClusterIP), PVC, and Secret templates.
3.  **Backend Component**: Define FastAPI Deployment, Service (NodePort 30001), and Env Vars (DB connection).
4.  **Frontend Component**: Define Next.js Deployment, Service (NodePort 30000), and Env Vars (API URL).
5.  **Configuration**: Centralize all image tags, ports, and replica counts in `values.yaml`.

## Phase 3: Deployment (Agent: kubectl-ai)
**Tasks**:
1.  **Cluster Start**: `minikube start`
2.  **Load Images**: `minikube image load zendo-frontend:latest zendo-backend:latest`
3.  **Install Chart**: `helm install zendo ./charts/zendo`
    *   *Prompt*: `kubectl-ai "deploy the zendo helm chart to minikube..."`
4.  **Verification**: Verify all pods `Running` and Services have Endpoints.

## Phase 4: AIOps & Validation (Agent: kagent)
**Tasks**:
1.  **Health Check**: Analyze cluster status.
    *   *Prompt*: `kagent "analyze cluster health..."`
2.  **Scaling Test**: Scale backend to 3 replicas.
    *   *Prompt*: `kubectl-ai "scale zendo-backend to 3..."`
3.  **Optimization**: Check resource usage.
    *   *Prompt*: `kagent "optimize CPU and memory..."`
