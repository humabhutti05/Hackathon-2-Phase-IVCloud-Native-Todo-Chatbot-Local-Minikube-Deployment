from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from contextlib import asynccontextmanager
from sqlmodel import Session, select

from database import create_db_and_tables, engine
from models import Conversation, Task
from agent import AgentRunner

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="Zendo AI Chatbot", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Zendo AI Chatbot API", "status": "Running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

# REST CRUD Endpoints
@app.get("/api/{user_id}/tasks", response_model=List[Task])
async def get_tasks(user_id: str):
    with Session(engine) as session:
        statement = select(Task).where(Task.user_id == user_id)
        results = session.exec(statement).all()
        return results

@app.post("/api/{user_id}/tasks", response_model=Task)
async def create_task(user_id: str, task: Task):
    with Session(engine) as session:
        task.user_id = user_id
        session.add(task)
        session.commit()
        session.refresh(task)
        return task

@app.patch("/api/{user_id}/tasks/{task_id}", response_model=Task)
async def update_task_endpoint(user_id: str, task_id: int, task_update: Dict[str, Any]):
    with Session(engine) as session:
        db_task = session.get(Task, task_id)
        if not db_task or db_task.user_id != user_id:
            raise HTTPException(status_code=404, detail="Task not found")
        
        for key, value in task_update.items():
            if hasattr(db_task, key):
                setattr(db_task, key, value)
        
        session.add(db_task)
        session.commit()
        session.refresh(db_task)
        return db_task

@app.delete("/api/{user_id}/tasks/{task_id}")
async def delete_task_endpoint(user_id: str, task_id: int):
    with Session(engine) as session:
        db_task = session.get(Task, task_id)
        if not db_task or db_task.user_id != user_id:
            raise HTTPException(status_code=404, detail="Task not found")
        session.delete(db_task)
        session.commit()
        return {"message": "Task deleted"}

# Chat Endpoints
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: List[Dict[str, Any]] = []

@app.post("/api/{user_id}/chat", response_model=ChatResponse)
async def chat_endpoint(user_id: str, request: ChatRequest):
    conversation_id = request.conversation_id
    
    with Session(engine) as session:
        # Create conversation if not exists
        if not conversation_id:
            conv = Conversation(user_id=user_id)
            session.add(conv)
            session.commit()
            session.refresh(conv)
            conversation_id = conv.id
        else:
            # Verify exists
            conv = session.get(Conversation, conversation_id)
            if not conv:
                conv = Conversation(user_id=user_id)
                session.add(conv)
                session.commit()
                session.refresh(conv)
                conversation_id = conv.id

    # Run Agent
    from dotenv import load_dotenv
    load_dotenv(override=True)
    runner = AgentRunner(user_id=user_id, conversation_id=conversation_id)
    result = runner.run(request.message)
    
    return ChatResponse(
        conversation_id=conversation_id,
        response=result["response"],
        tool_calls=result.get("tool_calls", [])
    )
