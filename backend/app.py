import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pdf_utils import extract_text_from_file
import ollama_client

app = Flask(__name__)
CORS(app)

@app.route("/api/status", methods=["GET"])
def get_status():
    status = ollama_client.get_ollama_status()
    return jsonify(status)

@app.route("/api/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["file"]
    if not file or file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    try:
        text = extract_text_from_file(file)
        if not text:
            return jsonify({"error": "Extracted text is empty. The file may be blank or unreadable."}), 400
        words = len(text.split())
        chars = len(text)
        return jsonify({
            "text": text,
            "filename": file.filename,
            "word_count": words,
            "char_count": chars
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/summarize", methods=["POST"])
def handle_summarize():
    data = request.json or {}
    text = data.get("text", "").strip()
    model = data.get("model")
    if not text:
        return jsonify({"error": "Study material text is required."}), 400
    try:
        result = ollama_client.generate_summary(text, model=model)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/explain", methods=["POST"])
def handle_explain():
    data = request.json or {}
    text = data.get("text", "").strip()
    topic = data.get("topic", "").strip()
    model = data.get("model")
    if not text:
        return jsonify({"error": "Study material text is required."}), 400
    if not topic:
        return jsonify({"error": "Please enter a topic or concept to explain."}), 400
    try:
        result = ollama_client.explain_concept(text, topic, model=model)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/revision-notes", methods=["POST"])
def handle_revision_notes():
    data = request.json or {}
    text = data.get("text", "").strip()
    model = data.get("model")
    if not text:
        return jsonify({"error": "Study material text is required."}), 400
    try:
        result = ollama_client.generate_revision_notes(text, model=model)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/generate-quiz", methods=["POST"])
def handle_generate_quiz():
    data = request.json or {}
    text = data.get("text", "").strip()
    num_questions = data.get("num_questions", 5)
    model = data.get("model")
    if not text:
        return jsonify({"error": "Study material text is required."}), 400
    try:
        quiz = ollama_client.generate_quiz(text, num_questions=num_questions, model=model)
        return jsonify({"quiz": quiz})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/ask", methods=["POST"])
def handle_ask():
    data = request.json or {}
    text = data.get("text", "").strip()
    question = data.get("question", "").strip()
    model = data.get("model")
    if not text:
        return jsonify({"error": "Study material text is required."}), 400
    if not question:
        return jsonify({"error": "Please enter a question to ask."}), 400
    try:
        answer = ollama_client.answer_question(text, question, model=model)
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    from config import PORT
    app.run(host="0.0.0.0", port=PORT, debug=True)
