# Locked Infrastructure Specification: Zendo Cloud Native

## Project Identity
- **Name**: Zendo Cloud Native Todo Chatbot
- **Environment**: Local Minikube Kubernetes Cluster
- **Packaging**: Helm Chart (`zendo`)
- **Containerization**: Docker (managed by AI Agent Gordon)
- **AI Ops**: kubectl-ai, kagent

## Architecture Overview
Microservices architecture consisting of three core components:
1.  **Likely Stateless Frontend** (Next.js)
2.  **Stateless Backend** (FastAPI)
3.  **Stateful Database** (PostgreSQL)

## Component Specifications

### 1. Frontend Service
- **Technology**: Next.js (React)
- **Replicas**: 2
- **Service Type**: NodePort
- **Port**: 3000 (Container) -> 30000 (NodePort)
- **Configuration**: Connects to Backend via `NEXT_PUBLIC_API_URL`
- **Container**: Multi-stage, non-root, optimized

### 2. Backend Service
- **Technology**: FastAPI (Python)
- **Replicas**: 2
- **Service Type**: NodePort
- **Port**: 8000 (Container) -> 30001 (NodePort)
- **Configuration**: Connects to Database via `DATABASE_URL` service DNS
- **Container**: Non-root, uvicorn, optimized

### 3. Database Service
- **Technology**: PostgreSQL
- **Replicas**: 1
- **Service Type**: ClusterIP (Internal only)
- **Storage**: PersistentVolumeClaim (PVC) 1Gi
- **Port**: 5432
- **Secrets**: Database credentials

## Deployment Workflow
- **Spec**: Locked (this document)
- **Plan**: AI-generated atomic tasks
- **Build**: Docker AI (Gordon)
- **Deploy**: Helm + kubectl-ai
- **Verify**: kagent
