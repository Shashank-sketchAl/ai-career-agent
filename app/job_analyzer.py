import os

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel


load_dotenv()


class JobAnalysis(BaseModel):
    job_title: str
    required_skills: list[str]
    preferred_skills: list[str]
    experience_level: str


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


job_description = """
We are looking for an AI/ML Intern.

Requirements:
- Python programming
- SQL
- Machine learning fundamentals
- Pandas and NumPy
- Basic understanding of LLMs

Good to have:
- Experience with RAG
- Knowledge of AWS
- Experience building AI applications
"""


response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=f"""
Analyze this job description and extract the information
according to the required structure.

Job description:

{job_description}
""",
    config={
        "response_mime_type": "application/json",
        "response_schema": JobAnalysis,
    },
)


analysis = JobAnalysis.model_validate_json(response.text)

print(analysis)
