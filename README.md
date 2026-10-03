# StudyBuddy Local

> A private, open-weight AI study companion designed to summarize, explain, revise, and generate quizzes from your personal study material locally on your machine.

---

## What It Is

**StudyBuddy Local** was built for a real friend who struggles with organizing, understanding, and revising scattered study notes across multiple subjects. 

Rather than sending sensitive course materials, lecture notes, or personal summaries to third-party cloud APIs, StudyBuddy Local runs completely on the user's computer using open-weight AI models via Ollama.

---

## Problem

Students face two major issues when preparing for exams:
1. **Scattered Material & Overwhelm:** Notes, slides, and textbook extracts are hard to turn into actionable revision points or quizzes quickly.
2. **Privacy & API Costs:** Uploading course material, unpublished notes, or private documents to proprietary cloud AI services exposes private data and often incurs per-token subscription costs.

---

## Solution

StudyBuddy Local provides a single, unified local workstation where students can paste text or upload `.txt` / `.pdf` study files. 

It connects directly to a local **Ollama** inference instance, keeping all study material private on the device while offering core AI workflows:
- **Summarization** into structured notes
- **Concept Explanations** with step-by-step breakdowns
- **High-Yield Revision Bullet Points** targeted for exams
- **Interactive Quiz Generation** with instant scoring and explanations
- **Grounded Q&A** to answer questions directly from notes

---

## Features

- **100% Local Inference:** No data leaves your machine. Zero external network calls required for AI processing.
- **Multi-Format Input:** Supports raw text input as well as uploaded `.txt` and `.pdf` files.
- **Local AI Status Monitor:** Real-time detection of local Ollama server status and available open-weight models.
- **Model Switching:** Easily select between installed local models (e.g., `llama3.2`, `qwen2.5:3b`).
- **Exam Revision Generator:** Instant extraction of high-yield definitions, key facts, and formulas.
- **Interactive Quiz Engine:** Generates multiple-choice questions with options, answer submission, automated score calculation, and detailed rationale.
- **Grounded Q&A Mode:** Ask questions directly against your study notes with conversation history.
- **Robust Error Handling:** Clear instructions and copyable CLI commands when Ollama is offline or models are missing.

---

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Python 3.9+, Flask, Flask-CORS, PyPDF
- **AI Inference Layer:** Ollama (Local open-weight LLMs like Llama 3.2 3B or Qwen 2.5 3B)

---

## Architecture

```
User
  │
  ▼
React (Vite Frontend @ http://localhost:3000)
  │
  ▼
Flask (Python Backend @ http://localhost:5001)
  │
  ▼
Ollama (Local Inference API @ http://localhost:11434)
  │
  ▼
Open-Weight Model (Llama 3.2 3B / Qwen2.5 3B)
```

---

## Why Open Innovation Matters

Building with local, open-weight models offers distinct advantages:

1. **Complete Privacy:** Study materials, unpublished research, and personal notes remain entirely on the local device.
2. **Model Flexibility:** Users can swap models based on hardware capabilities (e.g., `llama3.2:3b` for light laptops, `qwen2.5:7b` for high-end setups) or fine-tune models for specific domain subjects.
3. **No Per-Request API Costs:** Once installed, running queries does not require recurring per-token cloud API subscriptions.
4. **Full System Control:** Developers and students can inspect, modify, and extend the surrounding application without vendor lock-in.

*Note: Running models locally requires sufficient system memory (RAM/VRAM), and open-weight models have hardware-dependent inference speeds.*

---

## Running Locally

Follow these steps to run StudyBuddy Local on your computer:

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Ollama** (Download from [ollama.com](https://ollama.com))

### 2. Pull an Open-Weight Model
Open your terminal and pull a recommended lightweight model:
```bash
ollama pull llama3.2
```

Make sure the Ollama server is running:
```bash
ollama serve
```

### 3. Start the Flask Backend
In a new terminal window:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
The backend server will run on `http://localhost:5001`.

### 4. Start the React Frontend
In another terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

## Troubleshooting Ollama Connection Issues

- **Status Shows "Disconnected":** Ensure Ollama is running by opening a terminal and executing `ollama serve`.
- **Model Not Found Error:** Run `ollama pull llama3.2` to download the default model weights.
- **Port Conflicts:** The backend defaults to port `5001` (to avoid macOS AirPlay conflicts on port 5000) and Ollama communicates on port `11434`.

---

## Project Structure

```
Dev x hacktober fest/
├── backend/
│   ├── app.py            # Flask API routes
│   ├── config.py         # App configuration & environment defaults
│   ├── ollama_client.py  # Ollama API client & prompt handlers
│   ├── pdf_utils.py      # PDF and text file extraction helpers
│   ├── requirements.txt  # Python backend dependencies
│   └── venv/             # Python virtual environment
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js    # Vite configuration & backend proxy
│   └── src/
│       ├── App.jsx       # Main application layout & state
│       ├── index.css     # Base styles & Tailwind setup
│       ├── main.jsx
│       └── components/
│           ├── Navbar.jsx        # Top bar & Local AI indicator
│           ├── Sidebar.jsx       # Navigation tabs
│           ├── StudyWorkspace.jsx# Upload/Paste & action buttons
│           ├── QuizMode.jsx      # Interactive MCQ generator & test
│           ├── AskMode.jsx       # Grounded Q&A conversation mode
│           └── StatusView.jsx    # Ollama diagnostics & setup guide
├── README.md
└── DEV_SUBMISSION.md
```

---

## Future Improvements

- **Local Vector Database Integration (RAG):** Adding ChromaDB or FAISS for multi-document semantic search over large textbook libraries.
- **Flashcard Export:** Exporting revision points directly to Anki (.apkg) format.
- **Audio Note Transcription:** Local speech-to-text processing using Whisper.
