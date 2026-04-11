from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import subprocess
import tempfile
import sys
import os
import shutil
import json
import google.generativeai as genai
from datetime import datetime

# ✅ NEW: Lightweight imports (replaces HuggingFace + ChromaDB)
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS

# DATABASE Imports
from sqlalchemy import create_engine, Column, Integer, String, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session

from dotenv import load_dotenv
load_dotenv()

# ==========================================
# 🚀 INITIALIZE APP
# ==========================================
app = FastAPI(title="AI Command Center Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 💾 1. DATABASE SETUP: USER PROGRESS & LOGS
# ==========================================
SQLALCHEMY_DATABASE_URL = "sqlite:///./command_center.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    streak = Column(Integer, default=0)
    solved_count = Column(Integer, default=0)

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    tool = Column(String, index=True)
    action = Column(String)
    timestamp = Column(String, default=lambda: datetime.now().isoformat())

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def log_action(db: Session, tool: str, action: str):
    try:
        log = ActivityLog(tool=tool, action=action)
        db.add(log)
        db.commit()
    except Exception as e:
        print(f"Logging failed: {e}")

# ==========================================
# 🗄️ 2. DATABASE SETUP: SQL SANDBOX
# ==========================================
SANDBOX_DB_URL = "sqlite:///./sandbox.db"
sandbox_engine = create_engine(SANDBOX_DB_URL, connect_args={"check_same_thread": False})

with sandbox_engine.connect() as conn:
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY,
            name TEXT,
            department TEXT,
            salary INTEGER,
            hire_date TEXT
        )
    """))
    result = conn.execute(text("SELECT COUNT(*) FROM employees")).scalar()
    if result == 0:
        conn.execute(text("""
            INSERT INTO employees (name, department, salary, hire_date) VALUES 
            ('Alice', 'Engineering', 120000, '2023-01-15'),
            ('Bob', 'Sales', 85000, '2023-03-22'),
            ('Charlie', 'Engineering', 110000, '2022-11-05'),
            ('Diana', 'HR', 75000, '2024-01-10'),
            ('Evan', 'Sales', 90000, '2021-08-19')
        """))
        conn.commit()

# ==========================================
# 🤖 3. AI SETUP — ✅ LIGHTWEIGHT VERSION
# ==========================================

# ✅ Load API key from environment variable (never hardcode!)
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable not set!")

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

# ✅ Google embeddings instead of HuggingFace (no model download needed)
print("Initializing Google Embeddings...")
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=GOOGLE_API_KEY
)

# ✅ FAISS in-memory vector store instead of ChromaDB
FAISS_INDEX_PATH = "./faiss_index"
if os.path.exists(FAISS_INDEX_PATH):
    print("Loading existing FAISS index...")
    vector_store = FAISS.load_local(
        FAISS_INDEX_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )
else:
    print("Creating new FAISS index...")
    # Create a minimal starter index
    vector_store = FAISS.from_texts(
        ["AI Workspace initialized."],
        embedding=embeddings
    )
    vector_store.save_local(FAISS_INDEX_PATH)

os.makedirs("temp_uploads", exist_ok=True)

# ==========================================
# 📦 4. DATA MODELS
# ==========================================
class ChatRequest(BaseModel): message: str
class AuditRequest(BaseModel): code: str
class SchemaRequest(BaseModel): prompt: str
class FlashcardRequest(BaseModel): topic: str
class ExecuteRequest(BaseModel):
    language: str
    code: str
    problem_id: int
class SQLRequest(BaseModel):
    query: str

# ==========================================
# 🧪 5. TEST REGISTRY
# ==========================================
TEST_REGISTRY = {
    "python": {
        1: """\nprint('\\n[System] Running Python Test Cases...')\ntry:\n    if 'twoSum' in globals():\n        res = twoSum([2, 7, 11, 15], 9)\n        if res == [0, 1] or res == (0, 1): print('[PASS] TwoSum Test Passed!')\n        else: print(f'[FAIL] Expected [0, 1] but got {res}')\n    else: print('[ERROR] Function not found.')\nexcept Exception as e: print(f'[ERROR] {e}')""",
        2: """\nprint('\\n[System] Running Python Test Cases...')\ntry:\n    if 'lengthOfLongestSubstring' in globals():\n        res = lengthOfLongestSubstring("abcabcbb")\n        if res == 3: print('[PASS] LongestSubstring Test Passed!')\n        else: print(f'[FAIL] Expected 3 but got {res}')\n    else: print('[ERROR] Function not found.')\nexcept Exception as e: print(f'[ERROR] {e}')"""
    }
}

# ==========================================
# 🚀 6. API ENDPOINTS
# ==========================================

@app.get("/")
def read_root():
    return {"status": "System Online", "message": "Backend engine is running securely."}

@app.get("/api/analytics")
async def get_analytics(db: Session = Depends(get_db)):
    try:
        total_queries = db.query(ActivityLog).count()
        recent_logs = db.query(ActivityLog).order_by(ActivityLog.id.desc()).limit(5).all()

        color_map = {
            "AI Assistant": "#a78bfa", "Documents": "#22d3ee",
            "Code Auditor": "#fb923c", "Schema": "#f472b6",
            "Interview Prep": "#c8f04a"
        }

        recent_activity = []
        for log in recent_logs:
            recent_activity.append({
                "tool": log.tool,
                "action": log.action,
                "time": "Just now",
                "color": color_map.get(log.tool, "#64748b")
            })

        base_traffic = max(total_queries, 10)
        chart_data = [
            {"name": "Mon", "queries": int(base_traffic * 0.4)},
            {"name": "Tue", "queries": int(base_traffic * 0.7)},
            {"name": "Wed", "queries": int(base_traffic * 0.5)},
            {"name": "Thu", "queries": int(base_traffic * 0.9)},
            {"name": "Fri", "queries": int(base_traffic * 0.8)},
            {"name": "Sat", "queries": int(base_traffic * 1.2)},
            {"name": "Sun", "queries": total_queries},
        ]

        return {
            "stats": [
                {"label": "TOTAL QUERIES", "value": str(total_queries), "trend": "↑ Live Data", "color": "#22c55e"},
                {"label": "DOCS PROCESSED", "value": "143", "trend": "↑ 8 new today", "color": "#22d3ee"},
                {"label": "AVG RESPONSE", "value": "1.3s", "trend": "↑ faster than avg", "color": "#22c55e"},
                {"label": "SESSIONS", "value": "38", "trend": "↓ 2 vs last week", "color": "#f43f5e"}
            ],
            "recent_activity": recent_activity,
            "chart_data": chart_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/activity")
async def get_full_activity_log(limit: int = 100, db: Session = Depends(get_db)):
    try:
        logs = db.query(ActivityLog).order_by(ActivityLog.id.desc()).limit(limit).all()
        color_map = {
            "AI Assistant": "#a78bfa", "Documents": "#22d3ee",
            "Code Auditor": "#fb923c", "Schema": "#f472b6",
            "Interview Prep": "#c8f04a"
        }
        results = []
        for log in logs:
            try:
                dt = datetime.fromisoformat(log.timestamp)
                time_str = dt.strftime("%b %d, %Y - %I:%M %p")
            except:
                time_str = log.timestamp
            results.append({
                "id": log.id,
                "tool": log.tool,
                "action": log.action,
                "time": time_str,
                "color": color_map.get(log.tool, "#64748b")
            })
        return {"logs": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/progress")
async def get_user_progress(db: Session = Depends(get_db)):
    try:
        user = db.query(User).first()
        if not user:
            user = User(username="admin", streak=0, solved_count=0)
            db.add(user)
            db.commit()
            db.refresh(user)
        return {"username": user.username, "streak": user.streak, "solved": user.solved_count, "total": 6}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/progress/solve")
async def increment_solved_score(db: Session = Depends(get_db)):
    try:
        user = db.query(User).first()
        if user:
            user.streak += 1
            db.commit()
            db.refresh(user)
            return {"streak": user.streak}
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/sql")
async def execute_sql(request: SQLRequest):
    try:
        with sandbox_engine.connect() as conn:
            result = conn.execute(text(request.query))
            if request.query.strip().upper().startswith(("INSERT", "UPDATE", "DELETE", "CREATE", "DROP")):
                conn.commit()
                return {"columns": ["Status"], "rows": [[f"Query executed successfully. Rows affected: {result.rowcount}"]]}
            columns = list(result.keys())
            rows = [list(row) for row in result.fetchall()]
            return {"columns": columns, "rows": rows}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/execute")
async def execute_code(request: ExecuteRequest, db: Session = Depends(get_db)):
    log_action(db, "Interview Prep", f"Ran {request.language} code")
    try:
        final_code = request.code
        lang = request.language.lower()

        if lang == "python":
            if lang in TEST_REGISTRY and request.problem_id in TEST_REGISTRY[lang]:
                final_code += TEST_REGISTRY[lang][request.problem_id]
            else:
                final_code += f"\nprint('\\n[System] No hidden test cases configured for Problem {request.problem_id} yet.')"

            with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding="utf-8") as f:
                f.write(final_code)
                temp_filename = f.name

            try:
                result = subprocess.run([sys.executable, temp_filename], capture_output=True, text=True, encoding="utf-8", timeout=3)
                output = result.stdout + result.stderr
            finally:
                if os.path.exists(temp_filename): os.remove(temp_filename)

            return {"output": output if output else "(Process exited successfully with no output)"}

        elif lang == "cpp":
            with tempfile.NamedTemporaryFile(mode="w", suffix=".cpp", delete=False, encoding="utf-8") as f:
                f.write(final_code)
                cpp_filename = f.name
                exe_filename = cpp_filename.replace(".cpp", ".exe")

            try:
                compile_result = subprocess.run(["g++", cpp_filename, "-o", exe_filename], capture_output=True, text=True, encoding="utf-8")
                if compile_result.returncode != 0:
                    return {"output": f"🚨 COMPILATION ERROR:\n{compile_result.stderr}"}
                run_result = subprocess.run([exe_filename], capture_output=True, text=True, encoding="utf-8", timeout=3)
                output = run_result.stdout + run_result.stderr
                return {"output": output if output else "(Process exited successfully with no output)"}
            finally:
                if os.path.exists(cpp_filename): os.remove(cpp_filename)
                if os.path.exists(exe_filename): os.remove(exe_filename)

        elif lang == "java":
            temp_dir = tempfile.mkdtemp()
            java_filename = os.path.join(temp_dir, "Main.java")
            with open(java_filename, "w", encoding="utf-8") as f:
                f.write(final_code)
            try:
                compile_result = subprocess.run(["javac", java_filename], capture_output=True, text=True, encoding="utf-8")
                if compile_result.returncode != 0:
                    return {"output": f"🚨 COMPILATION ERROR:\n{compile_result.stderr}"}
                run_result = subprocess.run(["java", "Main"], cwd=temp_dir, capture_output=True, text=True, encoding="utf-8", timeout=3)
                output = run_result.stdout + run_result.stderr
                return {"output": output if output else "(Process exited successfully with no output)"}
            finally:
                shutil.rmtree(temp_dir, ignore_errors=True)
        else:
            return {"output": f"🚨 Language '{lang}' is not supported."}

    except subprocess.TimeoutExpired:
        return {"output": "🚨 ERROR: Execution timed out (infinite loop detected)."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    log_action(db, "Documents", f"Uploaded {file.filename}")
    try:
        file_path = f"temp_uploads/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        if file.filename.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        elif file.filename.endswith(".txt") or file.filename.endswith(".md"):
            loader = TextLoader(file_path)
        else:
            os.remove(file_path)
            raise HTTPException(status_code=400, detail="Unsupported file type.")

        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_documents(documents)

        # ✅ Add to FAISS and save
        vector_store.add_documents(chunks)
        vector_store.save_local(FAISS_INDEX_PATH)

        os.remove(file_path)
        return {"filename": file.filename, "status": "Vectorized and stored in FAISS", "chunks_created": len(chunks)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/inspect/{filename}")
async def inspect_chunks(filename: str, limit: int = 10, offset: int = 0):
    try:
        # FAISS doesn't support metadata filtering like Chroma
        # Return a helpful message instead
        return {
            "filename": filename,
            "message": "Chunk inspection is not supported with FAISS. Use /api/chat to query your documents.",
            "chunks": [],
            "total_chunks": 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat_with_pdf(request: ChatRequest, db: Session = Depends(get_db)):
    log_action(db, "AI Assistant", "1 query")
    try:
        docs = vector_store.similarity_search(request.message, k=3)
        context_text = "\n\n".join([doc.page_content for doc in docs])
        prompt = f"Use this context to answer the user: {context_text}\nUser Question: {request.message}"
        response = model.generate_content(prompt)
        return {"response": response.text, "sources": [doc.metadata.get("source") for doc in docs]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/audit")
async def audit_code(request: AuditRequest, db: Session = Depends(get_db)):
    log_action(db, "Code Auditor", "Code scanned")
    try:
        prompt = f"You are a Security Engineer. Respond ONLY with raw JSON. Format: {{\"vulnerabilities\": [{{\"line\": 1, \"issue\": \"x\"}}], \"complexity\": {{\"time\": \"O(1)\", \"space\": \"O(1)\", \"reason\": \"x\"}}, \"refactored\": \"code\"}}. Analyze this: {request.code}"
        response = model.generate_content(prompt)
        cleaned = response.text.strip().replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/schema")
async def design_schema(request: SchemaRequest, db: Session = Depends(get_db)):
    log_action(db, "Schema", "Generated new schema")
    try:
        response = model.generate_content(request.prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/flashcards")
async def generate_flashcards(request: FlashcardRequest, db: Session = Depends(get_db)):
    log_action(db, "Interview Prep", f"Generated flashcards for {request.topic[:10]}...")
    try:
        prompt = f"Generate 6 flashcards about '{request.topic}'. Respond ONLY with raw JSON: {{\"cards\": [{{\"q\": \"question\", \"a\": \"answer\"}}]}}"
        response = model.generate_content(prompt)
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        return {"response": clean_json}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)