import os

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
DEFAULT_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:0.5b")
ALLOWED_EXTENSIONS = {"txt", "pdf"}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024
PORT = int(os.getenv("PORT", 5001))
