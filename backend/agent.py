import os
from google import genai
from google.genai import types
from sqlmodel import Session, select
from database import engine
from models import Message
from mcp_server import add_task, list_tasks, complete_task, delete_task, update_task
import json

def run_agent(user_id: str, conversation_id: int, new_message: str):
    # 1. Setup Gemini Client (New SDK)
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return {"conversation_id": conversation_id, "response": "Error: GOOGLE_API_KEY not found", "tool_calls": []}
    
    client = genai.Client(api_key=api_key)
    model_id = 'gemini-2.5-flash'

    # 2. Store User Message
    with Session(engine) as session:
        user_msg = Message(
            user_id=user_id,
            conversation_id=conversation_id,
            role="user",
            content=new_message
        )
        session.add(user_msg)
        session.commit()

        # 3. Fetch History for Context
        statement = select(Message).where(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at.desc()).limit(11) # System prompt + 10 messages
        history_objs = session.exec(statement).all()
        history_objs = history_objs[::-1]

    try:
        # 4. Prepare Tools
        def add_task_wrapper(title: str, description: str = "", status: str = "To Do", priority: str = "Medium", due_date: str = None):
            return add_task(user_id=user_id, title=title, description=description, status=status, priority=priority, due_date=due_date)
        
        def list_tasks_wrapper(status: str = "all"):
            return list_tasks(user_id=user_id, status=status)
        
        def complete_task_wrapper(task_id: int):
            return complete_task(user_id=user_id, task_id=task_id)
        
        def delete_task_wrapper(task_id: int):
            return delete_task(user_id=user_id, task_id=task_id)
        
        def update_task_wrapper(task_id: int, title: str = None, description: str = None, status: str = None, priority: str = None, due_date: str = None):
            return update_task(user_id=user_id, task_id=task_id, title=title, description=description, status=status, priority=priority, due_date=due_date)

        system_prompt = (
            f"You are Zendo, a helpful Todo AI assistant. The current user is '{user_id}'. "
            "You must use the provided tools for all task operations.\n"
            "Tasks have the following metadata:\n"
            "- status: 'To Do', 'In Progress', 'Done'\n"
            "- priority: 'Low', 'Medium', 'High'\n"
            "- due_date: ISO date string (YYYY-MM-DD)\n"
            "Always output Markdown.\n"
            "Be concise and friendly."
        )

        # Convert history_objs to genai types
        genai_history = []
        for msg in history_objs[:-1]: # exclude the latest user message which we will send
            role = 'user' if msg.role == 'user' else 'model'
            genai_history.append(types.Content(role=role, parts=[types.Part.from_text(text=msg.content)]))

        # Start Chat
        chat = client.chats.create(
            model=model_id,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                tools=[add_task_wrapper, list_tasks_wrapper, complete_task_wrapper, delete_task_wrapper, update_task_wrapper],
                automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=False)
            ),
            history=genai_history
        )

        response = chat.send_message(new_message)
        final_content = response.text

    except Exception as e:
        return {"conversation_id": conversation_id, "response": f"Gemini Error: {str(e)}", "tool_calls": []}

    # 5. Store Assistant Response
    with Session(engine) as session:
        db_msg = Message(
            user_id=user_id,
            conversation_id=conversation_id,
            role="assistant",
            content=final_content
        )
        session.add(db_msg)
        session.commit()

    return {
        "conversation_id": conversation_id,
        "response": final_content,
        "tool_calls": [] # Handled automatically by the chat object
    }

class AgentRunner:
    def __init__(self, user_id: str, conversation_id: int):
        self.user_id = user_id
        self.conversation_id = conversation_id

    def run(self, new_message: str):
        return run_agent(self.user_id, self.conversation_id, new_message)
