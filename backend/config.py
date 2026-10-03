import os

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
DEFAULT_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")
ALLOWED_EXTENSIONS = {"txt", "pdf"}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
PORT = int(os.getenv("PORT", 5001))
