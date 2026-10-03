# What I Built

[ADD REAL FRIEND STORY HERE]

**StudyBuddy Local** is a private, open-weight AI study companion built for students who struggle with organizing, understanding, and revising scattered study notes across multiple subjects.

The application allows users to paste raw text or upload study documents (`.txt` and `.pdf` files) and process them locally using an open-weight AI model (`qwen2.5:0.5b`) via Ollama on their own computer.

Core features include:
- Summarizing study material into structured notes
- Explaining difficult concepts with step-by-step breakdowns
- Generating exam-focused revision bullet points
- Generating interactive multiple-choice quizzes with scoring and rationales
- Answering questions grounded directly in the provided material

---

# Demo

[ADD ACTUAL DEMO LINK OR VIDEO]

---

# Code

[ADD ACTUAL GITHUB REPOSITORY URL]

---

# How I Built It

StudyBuddy Local is built with a local-first architecture:

- **Frontend:** Built with React, Vite, and Tailwind CSS. It features a clean developer interface with real-time Ollama status monitoring, material statistics, interactive quiz execution, and grounded Q&A.
- **Backend:** Built with Python and Flask. It handles file parsing (`.txt` and `.pdf` via `pypdf`), text preprocessing, input validation, and structured REST communication with local Ollama endpoints.
- **Local AI Engine:** Uses **Ollama** running locally on `http://localhost:11434` with the tested open-weight model `qwen2.5:0.5b`.
- **Summarization & Explanations:** Prompts the local model to extract key concepts and break down complex topics.
- **Quiz Generation:** Uses structured JSON prompts to instruct the local model to generate valid JSON quiz questions with options, correct answer indices, and explanations.
- **Grounded Q&A:** Answers user questions strictly using the uploaded study material as reference.

---

# Why Does Open Innovation Matter?

- **Local Execution & Privacy:** Study notes, unpublished materials, and personal documents stay entirely on the user's computer. No data is transmitted to external cloud APIs or third-party servers.
- **Model Flexibility & Choice:** Users can select different open-weight models based on their laptop or desktop hardware capabilities.
- **No Mandatory Closed API Dependency:** The application runs locally without requiring cloud API subscriptions, per-token billing, or proprietary API access keys.
- **System Customization:** Developers can inspect, modify, and fine-tune prompt templates and inference options to tailor the system for specific academic subjects.

---

# My Agent Session

[ADD ACTUAL DEVRELAY SESSION LINK]

---

# Prize Categories

[ADD APPLICABLE PRIZE CATEGORIES]
