# Validation Checklist: Zendo on Minikube

## 1. Deploy & Pod Health
- [ ] **Command**: `helm install zendo ./charts/zendo`
- [ ] **Command**: `kubectl get pods`
    - [ ] 2/2 zendo-frontend pods are `Running`
    - [ ] 2/2 zendo-backend pods are `Running`
    - [ ] 1/1 zendo-db pod is `Running`

## 2. Service Exposure
- [ ] **Command**: `kubectl get svc`
    - [ ] `zendo-frontend` has TYPE `NodePort` (30000)
    - [ ] `zendo-backend` has TYPE `NodePort` (30001)
    - [ ] `zendo-db` has TYPE `ClusterIP` (5432)

## 3. Storage
- [ ] **Command**: `kubectl get pvc`
    - [ ] `zendo-db-pvc` status is `Bound`

## 4. Application Connectivity
- [ ] **Backend -> DB Link**:
    - [ ] `kubectl logs deployment/zendo-backend --tail=50`
    - [ ] Validate no "Connection refused" to port 5432.
- [ ] **Frontend -> Backend Link**:
    - [ ] `minikube service zendo-frontend --url`
    - [ ] Open in Browser.
    - [ ] Send message "Hello Zendo".
    - [ ] Verify response appears (confirms Frontend -> Backend -> OpenAI/Logic).

## 5. Scaling
- [ ] **Command**: `kubectl scale deployment zendo-backend --replicas=3`
- [ ] **Check**: `kubectl get deployment zendo-backend` shows `3/3 UP-TO-DATE`.

## 6. Logs & Diagnostics
- [ ] **Command**: `kubectl logs -l app=zendo-backend` checks for application errors.
- [ ] **Command**: `kubectl events` checks for scheduling/pull issues.
