# What I Built

**StudyBuddy Local** is a private, open-weight AI study companion built for a friend who struggles with organizing, understanding, and revising scattered study material. 

The application allows users to paste raw text or upload study documents (`.txt` and `.pdf` files) and process them using a local open-weight AI model (such as Llama 3.2 3B or Qwen 2.5 3B) via Ollama. 

Core capabilities include:
- Generating concise summaries from study notes
- Explaining difficult concepts with step-by-step breakdowns
- Producing exam-focused revision bullet points
- Generating multiple-choice quizzes with automated scoring and explanations
- Answering questions grounded directly in the provided material

---

# Demo

[Add deployed demo or demo video]

---

# Code

[Add GitHub repository URL]

---

# How I Built It

StudyBuddy Local is designed with a lightweight, local-first architecture:

- **Frontend:** Built with React 19, Vite, and Tailwind CSS. It features a clean developer interface with real-time status monitoring for the local Ollama instance, document text analysis, interactive quiz navigation, and grounded Q&A.
- **Backend:** Built with Python and Flask. It handles file parsing (`.txt` and `.pdf` via `pypdf`), text preprocessing, and structured API communication with local Ollama endpoints.
- **Local AI Inference Engine:** Uses **Ollama** running locally on `http://localhost:11434`. It communicates with open-weight models (e.g. `llama3.2`).
- **Quiz Generation:** Uses structured JSON prompts to instruct the local model to produce valid JSON arrays containing questions, options, correct answer indices, and explanations.
- **Document & Text Processing:** Parses uploaded files on the local machine and extracts plain text for context generation.
- **Question Answering:** Prompts the model to answer questions strictly using the uploaded study material as context.

---

# Why Does Open Innovation Matter?

Adopting an open-source and open-weight approach enabled several key advantages for this application:

- **Local Execution & Privacy:** Study materials, unpublished class notes, and personal documents stay entirely on the user's laptop. No data is sent to external cloud APIs or third-party servers.
- **Model Flexibility:** Users can switch models based on hardware resources (e.g. choosing a lighter 3B model for older laptops or larger models for desktop rigs).
- **No Mandatory Closed API Dependency:** The application operates without requiring cloud API subscriptions, per-token billing, or closed API access keys.
- **System Customization:** Developers can inspect, modify, and fine-tune the prompt strategies and model parameters to suit specific academic subjects.

---

# My Agent Session

[Add DevRelay session link here]

---

# Prize Categories

[Add applicable prize categories here]
