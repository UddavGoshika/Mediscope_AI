from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import socket
import subprocess
import time
import ollama


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def ensure_ollama_running(model_name="qwen2.5:0.5b"):
    try:
        socket.create_connection(("localhost", 11434), timeout=2).close()
    except Exception:
        subprocess.Popen(
            ["ollama", "serve"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        time.sleep(5)

    try:
        subprocess.run(
            ["ollama", "run", model_name],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=10
        )
        print(f" Model '{model_name}' warmed up")
    except subprocess.TimeoutExpired:
        print(f" Model '{model_name}' ready")
    except Exception as e:
        print(f"❌ Could not start Ollama: {e}")



ensure_ollama_running()

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str

@app.post("/chat", response_model=ChatResponse)
async def chat_with_model(payload: ChatRequest):
    
    enhanced_question = (
        "You are a medical assistant. "
        "Give only a short, key answer. with in only 2-3 lines"
        "You are Mediscope AI, built by student. "
        "If user asks who you are / your name / who built you, "
        "answer exactly: 'I am Mediscope AI, built by Mediscope.'"
        "Question: " + payload.question
    )
    
    response = ollama.chat(
        model="qwen2.5:0.5b",
        messages=[
            {"role": "user", "content": enhanced_question}
        ]
    )
    answer_text = response["message"]["content"]
    print("answer:",answer_text)
    return {"answer": answer_text}


