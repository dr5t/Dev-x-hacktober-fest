# StudyBuddy Local

> A private, open-weight AI study companion that summarizes, explains, revises, and generates quizzes from study material locally on your computer.

---

## What It Is

[ADD REAL FRIEND STORY HERE]

**StudyBuddy Local** is a private study companion designed for students who struggle with organizing, understanding, and revising scattered study material across multiple subjects. 

Instead of sending course material, lecture notes, or personal summaries to cloud AI services, StudyBuddy Local runs open-weight AI models locally on the user's machine using Ollama.

---

## Problem

Students face two major issues when preparing for exams:
1. **Scattered Material & Overwhelm:** Turning textbook notes and lecture slides into actionable study guides or quizzes takes significant manual effort.
2. **Privacy & Cloud API Costs:** Uploading unpublished notes or personal documents to cloud AI services transmits sensitive data to third-party servers and often requires per-token API subscriptions.

---

## Solution

StudyBuddy Local provides a local workstation where students can paste text or upload `.txt` and `.pdf` files. It communicates with a local **Ollama** server, keeping all data on the user's computer while offering five AI actions:
- **Summarize:** Generate structured key concept overviews
- **Explain:** Break down complex topics or definitions
- **Make Revision Notes:** Extract high-yield exam bullet points
- **Generate Quiz:** Create multiple-choice questions with answer keys and explanations
- **Ask:** Answer specific questions grounded in the supplied notes

---

## Features

- **100% Local Inference:** All AI processing runs on your computer via Ollama. No data is sent to external AI services.
- **Multi-Format Document Input:** Supports raw text input and `.txt` / `.pdf` file uploads.
- **Local AI Status Monitor:** Real-time connection detection and list of installed local open-weight models.
- **Model Selector:** Switch between installed local models (tested with `qwen2.5:0.5b`).
- **Interactive Quiz Engine:** Takes quizzes with option selection, automated score calculation, and rationales.
- **Grounded Q&A:** Ask questions directly against the uploaded study material with Q&A history.
- **Error Handling:** Clear instructions and CLI commands when Ollama is offline or models are missing.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Python, Flask, Flask-CORS, PyPDF
- **AI Inference Engine:** Ollama (Tested with open-weight model `qwen2.5:0.5b`)

---

## Architecture

```
User
  │
  ▼
React (Frontend @ http://localhost:3000)
  │
  ▼
Flask (Backend @ http://localhost:5001)
  │
  ▼
Ollama (Local Inference @ http://localhost:11434)
  │
  ▼
Open-Weight Model (qwen2.5:0.5b)
```

---

## Privacy

- All study material text remains on your local machine.
- Flask communicates directly with the local Ollama daemon on `http://localhost:11434`.
- Zero requests are sent to OpenAI, Gemini, Claude, or any external cloud AI provider.

---

## Local Setup

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- **Ollama** (Download from [ollama.com](https://ollama.com))

### 2. Start Ollama and Pull the Tested Model
In a terminal, start Ollama and pull the tested model:
```bash
ollama serve
ollama pull qwen2.5:0.5b
```

### 3. Start the Backend
In a new terminal:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
The backend server runs on `http://localhost:5001`.

### 4. Start the Frontend
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Troubleshooting

- **Local AI Status Disconnected:** Run `ollama serve` in a terminal window to start the Ollama daemon.
- **Model Not Found Error:** Run `ollama pull qwen2.5:0.5b` to download the required model weights.
- **Port Conflict:** The backend defaults to port `5001` to avoid macOS AirPlay Receiver conflicts on port 5000.

---

## Limitations

- **Hardware Dependency:** Local AI performance depends on your laptop/computer RAM, CPU, and GPU capability.
- **Text Extraction:** PDF extraction works on text-based PDFs (scanned image PDFs without OCR are unreadable).

---

## Future Improvements

- **Local Vector Search (RAG):** Adding ChromaDB or FAISS for semantic search over large textbook libraries.
- **Anki Flashcard Export:** Exporting revision points to Anki card decks.
