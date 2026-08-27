import os

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel


load_dotenv()


class MatchAnalysis(BaseModel):
    match_score: int
    matched_skills: list[str]
    missing_skills: list[str]
    partially_matched_skills: list[str]
    explanation: str
    learning_recommendations: list[str]


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


resume = """
B.Tech student with experience in Python and machine learning.

Projects:
- Built a customer churn prediction system using Python,
  Pandas, Scikit-learn and machine learning algorithms.
- Built an image classification project using deep learning.
- Comfortable with NumPy, Pandas and basic data analysis.

Currently learning:
- Large Language Models
- Generative AI
"""


response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=f"""
You are a technical hiring analyst.

Analyze how well this candidate matches the job.

JOB DESCRIPTION:
{job_description}

CANDIDATE RESUME:
{resume}

Rules:
- Only use information present in the resume.
- Do not invent skills or experience.
- Give a match score from 0 to 100.
- Separate matched, missing and partially matched skills.
- Explain why the candidate received the score.
- Recommend what the candidate should learn next.
""",
    config={
        "response_mime_type": "application/json",
        "response_schema": MatchAnalysis,
    },
)


analysis = MatchAnalysis.model_validate_json(response.text)

print("\n===== CAREER ANALYSIS =====\n")
print(f"Match Score: {analysis.match_score}/100")

print("\nMatched Skills:")
for skill in analysis.matched_skills:
    print(f"  ✓ {skill}")

print("\nPartially Matched:")
for skill in analysis.partially_matched_skills:
    print(f"  ~ {skill}")

print("\nMissing Skills:")
for skill in analysis.missing_skills:
    print(f"  ✗ {skill}")

print("\nExplanation:")
print(analysis.explanation)

print("\nLearning Recommendations:")
for recommendation in analysis.learning_recommendations:
    print(f"  → {recommendation}")
    