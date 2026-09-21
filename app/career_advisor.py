import os
import json

from dotenv import load_dotenv
from google import genai
from google.genai import types


# ============================================================
# ENVIRONMENT & GEMINI CLIENT
# ============================================================

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


# ============================================================
# CAREER ROADMAP GENERATOR
# ============================================================

def generate_career_roadmap(
    resume_data,
    job_data,
    skill_gap,
    match_score
):
    """
    Generate a personalized career roadmap using:

    - Resume evidence
    - Job requirements
    - Semantic skill matching
    - Skill priorities
    - Overall compatibility score

    The AI must base its recommendations on the
    structured analysis rather than inventing skills
    or experience.
    """

    priority_skills = skill_gap.get(
        "priority_skills",
        []
    )

    matched_skills = skill_gap.get(
        "matched_skills",
        []
    )

    partial_skills = skill_gap.get(
        "partial_skills",
        []
    )

    missing_skills = skill_gap.get(
        "missing_skills",
        []
    )

    score_breakdown = skill_gap.get(
        "score_breakdown",
        {}
    )


    # ========================================================
    # PREPARE PRIORITY INFORMATION
    # ========================================================

    high_priority = [
        skill
        for skill in priority_skills
        if skill.get("priority") == "HIGH"
    ]

    medium_priority = [
        skill
        for skill in priority_skills
        if skill.get("priority") == "MEDIUM"
    ]

    low_priority = [
        skill
        for skill in priority_skills
        if skill.get("priority") == "LOW"
    ]


    # ========================================================
    # AI PROMPT
    # ========================================================

    prompt = f"""
You are an AI Career Advisor inside an AI Career Agent.

Your job is to analyze a candidate's resume against
a target job description and create a practical,
evidence-based career improvement roadmap.

========================================================
CANDIDATE RESUME
========================================================

{json.dumps(resume_data, indent=2)}


========================================================
TARGET JOB REQUIREMENTS
========================================================

{json.dumps(job_data, indent=2)}


========================================================
OVERALL MATCH SCORE
========================================================

{match_score}%


========================================================
SKILL GAP ANALYSIS
========================================================

{json.dumps(skill_gap, indent=2)}


========================================================
PRIORITY SKILLS
========================================================

HIGH PRIORITY:
{json.dumps(high_priority, indent=2)}

MEDIUM PRIORITY:
{json.dumps(medium_priority, indent=2)}

LOW PRIORITY:
{json.dumps(low_priority, indent=2)}


========================================================
MATCHED SKILLS
========================================================

{json.dumps(matched_skills, indent=2)}


========================================================
PARTIAL SKILLS
========================================================

{json.dumps(partial_skills, indent=2)}


========================================================
MISSING SKILLS
========================================================

{json.dumps(missing_skills, indent=2)}


========================================================
SCORE BREAKDOWN
========================================================

{json.dumps(score_breakdown, indent=2)}


========================================================
TASK
========================================================

Create a personalized career improvement plan.

The plan must include:

1. Candidate strengths

2. Important partially matched skills

3. High-priority skills that should be learned first

4. Medium-priority skills that should be learned after
   the high-priority skills

5. A practical learning roadmap

6. One realistic project that combines the most important
   missing or partial skills

7. Concrete next steps


========================================================
PRIORITY LOGIC
========================================================

Follow these rules carefully:

HIGH priority skills must receive the strongest attention.

MEDIUM priority skills should be addressed after the
high-priority skills.

LOW priority skills should not dominate the roadmap.

Matched skills should NOT be recommended as missing skills.

A PARTIAL skill should be treated differently from a
completely MISSING skill.

If a skill has strong semantic similarity but is still
classified as PARTIAL, do not claim the candidate already
fully knows that skill.

Do not recommend technologies simply because they are
popular.

Recommendations must be connected to the supplied
job requirements.

Do not invent experience, certifications, projects,
education, or skills.

Do not claim that learning a skill guarantees employment.

Do not make hiring predictions.


========================================================
ROADMAP ORDER
========================================================

The learning roadmap should generally follow this order:

Phase 1:
Highest-value missing technical skills.

Phase 2:
Important missing tools/frameworks.

Phase 3:
Partial skills that need strengthening.

Phase 4:
An integrated project applying the learned skills.

Phase 5:
Job application and resume preparation.


========================================================
PROJECT REQUIREMENT
========================================================

The recommended project should:

- directly address the job's skill requirements
- use the candidate's existing skills where possible
- include important missing skills
- be realistic for a student
- produce something demonstrable in a portfolio

Do not recommend a project requiring a large team
or unrealistic infrastructure.


========================================================
OUTPUT FORMAT
========================================================

Return ONLY valid JSON.

Use exactly this structure:

{{
    "summary": "",

    "strengths": [],

    "partial_skills": [
        {{
            "skill": "",
            "priority": "HIGH",
            "reason": ""
        }}
    ],

    "priority_skills": [
        {{
            "skill": "",
            "priority": "HIGH",
            "reason": ""
        }}
    ],

    "learning_roadmap": [
        {{
            "phase": "",
            "duration": "",
            "topics": [],
            "goal": ""
        }}
    ],

    "recommended_project": "",

    "next_steps": []
}}

Additional rules:

- Return valid JSON only.
- Do not use Markdown.
- Do not add explanations outside the JSON.
- Keep recommendations concise but useful.
- Use the exact skill names where possible.
- Do not create skills that are absent from the job requirements.
- Preserve the distinction between MATCH, PARTIAL and MISSING.
"""


    # ========================================================
    # GEMINI REQUEST
    # ========================================================

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )


    # ========================================================
    # PARSE RESPONSE
    # ========================================================

    response_text = response.text.strip()

    return json.loads(
        response_text
    )
    