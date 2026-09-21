import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def analyze_resume(resume_text):

    prompt = f"""
You are an AI career assistant.

Analyze the following resume and extract structured information.

Return ONLY valid JSON.
Do not use Markdown.
Do not add ```json.
Do not add explanations before or after the JSON.

Use exactly this structure:

{{
    "name": "",
    "education": [],
    "skills": [],
    "projects": [],
    "experience": [],
    "certifications": []
}}

Resume:

{resume_text}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    response_text = response.text.strip()

    print("\n===== GEMINI RAW RESPONSE =====\n")
    print(response_text)

    return json.loads(response_text)
