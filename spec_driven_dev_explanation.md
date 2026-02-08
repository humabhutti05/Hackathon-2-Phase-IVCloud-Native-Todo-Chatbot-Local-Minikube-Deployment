# SDD in Infrastructure Automation

## The Paradigm Shift
Spec-Driven Development (SDD) transforms infrastructure from a manual scripting task to a **Blueprint-to-Artifact** pipeline managed by AI Agents.

## 1. Blueprints as Source of Truth
Instead of raw YAML, the engineer defines a **Blueprint** (e.g., "Architecture: Microservices, HA, Postgres").
*   **Significance**: This decouples the *Checklist* (What we want) from the *Implementation* (How K8s does it).

## 2. AI Agent Roles & Workflow
*   **Claude Code (The Architect)**:
    *   Reads the Spec.
    *   Generates the *Structure* (Helm Chart scaffolding, folder organization).
    *   Ensures parameters (replicas, names) match the spec.
*   **Gordon (The Builder)**:
    *   Reads the Codebase + Spec.
    *   Generates *Artifacts* (Dockerfiles) that are optimized for the target (K8s/Minikube).
*   **kubectl-ai (The Operator)**:
    *   Executes the deployment actions ("Deploy X", "Scale Y").
    *   Translates intent to specific `kubectl` imperative commands.
*   **kagent (The Auditor)**:
    *   Scans the live environment.
    *   Validates it against the implied safety/performance rules.
    *   Provides "Governance" (e.g., flagging root containers, high memory usage).

## 3. Governance via Specifications
In this model, the **Spec** acts as the Governance Contract. If `kagent` sees a Pod running as root, and the Spec says "Non-root", it flags a violation. This closes the loop between Design (Spec) and Operations (Running Cluster).

## Conclusion
By chaining these agents, we achieve **Automated DevOps**:
Spec -> (Claude) -> Helm Chart -> (Gordon) -> Images -> (kubectl-ai) -> Running App -> (kagent) -> Verified State.
