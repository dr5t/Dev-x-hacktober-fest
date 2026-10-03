import json
import re
import requests
from config import OLLAMA_BASE_URL, DEFAULT_MODEL

def get_ollama_status():
    try:
        resp = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=3)
        if resp.status_code == 200:
            models_data = resp.json().get("models", [])
            model_names = [m.get("name") for m in models_data]
            return {
                "connected": True,
                "models": model_names,
                "default_model": DEFAULT_MODEL,
                "error": None
            }
    except requests.exceptions.RequestException as e:
        return {
            "connected": False,
            "models": [],
            "default_model": DEFAULT_MODEL,
            "error": f"Ollama service unavailable at {OLLAMA_BASE_URL}. Ensure Ollama is running locally."
        }
    return {
        "connected": False,
        "models": [],
        "default_model": DEFAULT_MODEL,
        "error": "Unexpected response from local Ollama server."
    }

def query_ollama(prompt, system_prompt=None, model=None, format_json=False):
    target_model = model or DEFAULT_MODEL
    url = f"{OLLAMA_BASE_URL}/api/generate"
    payload = {
        "model": target_model,
        "prompt": prompt,
        "stream": False
    }
    if system_prompt:
        payload["system"] = system_prompt
    if format_json:
        payload["format"] = "json"

    try:
        resp = requests.post(url, json=payload, timeout=90)
        if resp.status_code == 200:
            return resp.json().get("response", "").strip()
        elif resp.status_code == 404:
            raise RuntimeError(f"Model '{target_model}' not found in local Ollama instance. Please run: ollama pull {target_model}")
        else:
            raise RuntimeError(f"Ollama API returned HTTP {resp.status_code}: {resp.text}")
    except requests.exceptions.ConnectionError:
        raise RuntimeError(f"Could not connect to Ollama at {OLLAMA_BASE_URL}. Please start Ollama locally.")
    except requests.exceptions.Timeout:
        raise RuntimeError("Request to local Ollama model timed out. Try reducing text size or selecting a lighter model.")
    except Exception as e:
        raise RuntimeError(str(e))

def generate_summary(text, model=None):
    system = "You are a clear, structured study assistant. Provide a well-organized, comprehensive summary of the study material using bullet points and section headers."
    prompt = f"Study Material:\n\n{text}\n\nTask: Summarize the key concepts and ideas from the material above."
    return query_ollama(prompt, system_prompt=system, model=model)

def explain_concept(text, topic, model=None):
    system = "You are an expert tutor. Explain concepts clearly using simple analogies, key definitions, and step-by-step breakdowns based strictly on the provided study material."
    prompt = f"Study Material:\n\n{text}\n\nTask: Explain the following topic/question clearly using the study material: {topic}"
    return query_ollama(prompt, system_prompt=system, model=model)

def generate_revision_notes(text, model=None):
    system = "You are an exam revision coach. Generate concise, high-yield revision bullet points focused on key formulas, terms, dates, definitions, and facts that are crucial for exam preparation."
    prompt = f"Study Material:\n\n{text}\n\nTask: Produce high-impact exam revision notes from this material."
    return query_ollama(prompt, system_prompt=system, model=model)

def generate_quiz(text, num_questions=5, model=None):
    system = (
        "You are an educational assessment generator. Output ONLY a valid JSON array containing multiple-choice quiz questions. "
        "Each object in the array MUST strictly follow this JSON schema:\n"
        "[\n"
        "  {\n"
        '    "id": 1,\n'
        '    "question": "Question text here?",\n'
        '    "options": ["Option A", "Option B", "Option C", "Option D"],\n'
        '    "answer": 0,\n'
        '    "explanation": "Brief explanation of why this answer is correct based on the material."\n'
        "  }\n"
        "]\n"
        "Do NOT include markdown formatting or extra conversational text outside the JSON array."
    )
    prompt = f"Study Material:\n\n{text}\n\nTask: Generate exactly {num_questions} multiple choice quiz questions based on the material."
    
    raw_response = query_ollama(prompt, system_prompt=system, model=model, format_json=True)
    
    # Try parsing JSON directly or regex matching JSON array
    try:
        return json.loads(raw_response)
    except json.JSONDecodeError:
        match = re.search(r'\[.*\]', raw_response, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass
        raise RuntimeError("Failed to parse AI output into valid quiz format. Please try generating again.")

def answer_question(text, question, model=None):
    system = "You are a study assistant. Answer questions accurately and directly based ONLY on the provided study material. If the answer cannot be deduced from the material, state that clearly."
    prompt = f"Study Material:\n\n{text}\n\nUser Question: {question}\n\nAnswer:"
    return query_ollama(prompt, system_prompt=system, model=model)
