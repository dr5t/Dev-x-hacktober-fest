import io
from pypdf import PdfReader

def extract_text_from_file(file_storage):
    filename = file_storage.filename.lower()
    if filename.endswith(".txt"):
        content = file_storage.read().decode("utf-8", errors="ignore")
        return content.strip()
    elif filename.endswith(".pdf"):
        pdf_bytes = io.BytesIO(file_storage.read())
        reader = PdfReader(pdf_bytes)
        text_parts = []
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text_parts.append(extracted)
        return "\n\n".join(text_parts).strip()
    else:
        raise ValueError("Unsupported file format. Please upload a .txt or .pdf file.")
