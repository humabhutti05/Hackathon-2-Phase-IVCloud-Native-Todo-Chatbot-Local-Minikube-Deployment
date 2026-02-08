# Validation Plan: Zendo on Minikube
## Cloud Native Todo Chatbot

This validation plan ensures the "zendo" Helm release is functioning correctly on the local Minikube cluster.

### 1. Cluster & Deployment Health (kagent / kubectl-ai)
**Objective**: Verify pods are `Running` and services are creating endpoints.

*   **Command**: `kubectl get all`
    *   *Expectation*: 
        *   `deployment.apps/zendo-frontend` (2/2 READY)
        *   `deployment.apps/zendo-backend` (2/2 READY)
        *   `service/zendo-frontend` (ClusterIP/NodePort)
        *   `service/zendo-backend` (ClusterIP)
*   **Command**: `kubectl get pods -l app.kubernetes.io/instance=zendo`
    *   *Expectation*: Status `Running`, Restarts `0`.

### 2. Service Access (Minikube Tunnel)
**Objective**: Verify the Frontend can be accessed from the host browser.

*   **Command**: `minikube service zendo-frontend --url`
    *   *Action*: Open the returned URL in a browser.
    *   *Expectation*: The Zendo Chatbot UI loads successfully.
*   **Command**: `kubectl port-forward svc/zendo-backend 8000:8000`
    *   *Action*: Curl `http://localhost:8000/health`
    *   *Expectation*: JSON response `{"status": "ok"}`.

### 3. Application Logs & Logic
**Objective**: Verify Frontend can talk to Backend.

*   **Command**: `kubectl logs -l app.kubernetes.io/name=backend --tail=20 -f`
    *   *Action*: Send a chat message in the UI.
    *   *Expectation*: Backend logs show `POST /api/chat 200 OK`.
*   **Command**: `kubectl logs -l app.kubernetes.io/name=frontend --tail=20`
    *   *Expectation*: No "Connection refused" errors or Next.js build errors.

### 4. Scaling Verification (kubectl-ai)
**Objective**: Confirm the cluster scales as requested.

*   **Command**: `kubectl scale deployment zendo-backend --replicas=3`
*   **Command**: `kubectl get deployment zendo-backend`
    *   *Expectation*: `READY 3/3`, `AVAILABLE 3`.

### 5. Resource Optimization (kagent)
**Objective**: Check if AI resource suggestions are valid.

*   **Command**: `kubectl top pods` (Requires metrics-server enabled in Minikube)
    *   *Expectation*: CPU/Memory usage is within the limits defined (if any) or low for idle state.
*   **Action**: Run `kagent "analyze resource allocation"` (simulated).
    *   *Expectation*: Agent suggests adding `resources.requests` and `limits` to valid YAML if missing.

---
**Troubleshooting**:
- If `ImagePullBackOff` -> Run `minikube image load todo-frontend:latest` (and backend).
- If `CrashLoopBackOff` -> Check logs (`kubectl logs <pod>`).
