import os
import json

from dotenv import load_dotenv
from google import genai
from google.genai import types

from resume_parser import extract_resume_text
from resume_analyzer import analyze_resume
from semantic_matcher import match_skills
from career_advisor import generate_career_roadmap


# ============================================================
# ENVIRONMENT & GEMINI CLIENT
# ============================================================

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


# ============================================================
# JOB SKILL EXTRACTION
# ============================================================

def extract_job_skills(job_description):
    """
    Extract structured skills and requirements
    from a job description using Gemini.
    """

    prompt = f"""
You are an AI career assistant.

Analyze the following job description and identify
the skills required for the role.

Separate the requirements into:

1. Technical skills
2. Tools and frameworks
3. Soft skills
4. Other relevant requirements

Return ONLY valid JSON.

Use exactly this structure:

{{
    "technical_skills": [],
    "tools_and_frameworks": [],
    "soft_skills": [],
    "other_requirements": []
}}

Rules:

- Extract skills explicitly mentioned in the job description.
- Do not invent technologies.
- Keep skill names concise.
- Avoid duplicate skills.
- Do not include explanations.
- Do not use Markdown.

JOB DESCRIPTION:

{job_description}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    return json.loads(response.text)


# ============================================================
# SKILL PRIORITY
# ============================================================

def determine_skill_priority(
    result
):
    """
    Determine the priority of a skill based on:

    1. Match status
    2. Skill category
    3. Semantic similarity

    Priority is mainly intended for PARTIAL
    and MISSING skills.
    """

    status = result.get(
        "status",
        "MISSING"
    )

    category = result.get(
        "category",
        "technical"
    )

    similarity = float(
        result.get(
            "similarity",
            0
        )
    )

    # --------------------------------------------------------
    # Already matched
    # --------------------------------------------------------

    if status == "MATCH":

        return "LOW"


    # --------------------------------------------------------
    # Technical skills
    # --------------------------------------------------------

    if category == "technical":

        if status == "MISSING":

            return "HIGH"

        if status == "PARTIAL":

            if similarity >= 0.60:
                return "HIGH"

            return "MEDIUM"


    # --------------------------------------------------------
    # Tools and frameworks
    # --------------------------------------------------------

    if category == "tool_or_framework":

        if status == "MISSING":

            return "HIGH"

        if status == "PARTIAL":

            if similarity >= 0.60:
                return "HIGH"

            return "MEDIUM"


    # --------------------------------------------------------
    # Soft / other
    # --------------------------------------------------------

    if category in {
        "soft_skill",
        "other"
    }:

        if status == "MISSING":

            return "MEDIUM"

        if status == "PARTIAL":

            return "LOW"


    return "MEDIUM"


# ============================================================
# ADD PRIORITY TO RESULTS
# ============================================================

def add_skill_priorities(
    results
):
    """
    Add priority information to every
    semantic matching result.
    """

    prioritized_results = []

    for result in results:

        result_copy = dict(
            result
        )

        result_copy[
            "priority"
        ] = determine_skill_priority(
            result_copy
        )

        prioritized_results.append(
            result_copy
        )

    return prioritized_results


# ============================================================
# SKILL GAP ANALYSIS
# ============================================================

def calculate_skill_gap(
    resume_data,
    job_data
):
    """
    Compare resume skills against technical
    skills and tools/frameworks required
    by the job.
    """

    # --------------------------------------------------------
    # Resume skills
    # --------------------------------------------------------

    resume_skills = [
        str(skill).strip()
        for skill in resume_data.get(
            "skills",
            []
        )
        if str(skill).strip()
    ]


    # --------------------------------------------------------
    # Job skills
    # --------------------------------------------------------

    technical_skills = [
        str(skill).strip()
        for skill in job_data.get(
            "technical_skills",
            []
        )
        if str(skill).strip()
    ]


    tools_and_frameworks = [
        str(skill).strip()
        for skill in job_data.get(
            "tools_and_frameworks",
            []
        )
        if str(skill).strip()
    ]


    job_skills = (
        technical_skills
        + tools_and_frameworks
    )


    # --------------------------------------------------------
    # Empty skill handling
    # --------------------------------------------------------

    if not resume_skills or not job_skills:

        return {
            "matches": [],
            "matched_skills": [],
            "partial_skills": [],
            "missing_skills": [],

            "priority_skills": [],

            "skill_categories": {
                "technical_skills": [],
                "tools_and_frameworks": []
            },

            "score_breakdown": {
                "technical": {
                    "weight": 1.25,
                    "total": 0,
                    "matched": 0,
                    "partial": 0,
                    "missing": 0
                },

                "tools_and_frameworks": {
                    "weight": 1.15,
                    "total": 0,
                    "matched": 0,
                    "partial": 0,
                    "missing": 0
                }
            }
        }


    # --------------------------------------------------------
    # Semantic matching
    # --------------------------------------------------------

    semantic_results = match_skills(
        job_skills,
        resume_skills,
        threshold=0.65,
        partial_threshold=0.50
    )


    # --------------------------------------------------------
    # Add category information
    # --------------------------------------------------------

    technical_count = len(
        technical_skills
    )


    categorized_results = []


    for index, result in enumerate(
        semantic_results
    ):

        result_copy = dict(
            result
        )

        if index < technical_count:

            result_copy[
                "category"
            ] = "technical"

        else:

            result_copy[
                "category"
            ] = "tool_or_framework"


        categorized_results.append(
            result_copy
        )


    # --------------------------------------------------------
    # Add priorities
    # --------------------------------------------------------

    prioritized_results = add_skill_priorities(
        categorized_results
    )


    # --------------------------------------------------------
    # Categorize final results
    # --------------------------------------------------------

    matched_skills = []

    partial_skills = []

    missing_skills = []

    priority_skills = []


    for result in prioritized_results:

        status = result.get(
            "status"
        )


        if status == "MATCH":

            matched_skills.append(
                result
            )

        elif status == "PARTIAL":

            partial_skills.append(
                result
            )

        else:

            missing_skills.append(
                result
            )


        # ----------------------------------------------------
        # Priority skills are skills that need attention.
        # ----------------------------------------------------

        if status != "MATCH":

            priority_skills.append(
                result
            )


    # --------------------------------------------------------
    # Separate category results
    # --------------------------------------------------------

    technical_results = []

    tool_results = []


    for result in prioritized_results:

        if result.get(
            "category"
        ) == "technical":

            technical_results.append(
                result
            )

        else:

            tool_results.append(
                result
            )


    # --------------------------------------------------------
    # Score breakdown
    # --------------------------------------------------------

    score_breakdown = {

        "technical": {

            "weight": 1.25,

            "total": len(
                technical_results
            ),

            "matched": 0,

            "partial": 0,

            "missing": 0
        },


        "tools_and_frameworks": {

            "weight": 1.15,

            "total": len(
                tool_results
            ),

            "matched": 0,

            "partial": 0,

            "missing": 0
        }
    }


    # --------------------------------------------------------
    # Count technical results
    # --------------------------------------------------------

    for result in technical_results:

        status = result.get(
            "status"
        )


        if status == "MATCH":

            score_breakdown[
                "technical"
            ]["matched"] += 1


        elif status == "PARTIAL":

            score_breakdown[
                "technical"
            ]["partial"] += 1


        else:

            score_breakdown[
                "technical"
            ]["missing"] += 1


    # --------------------------------------------------------
    # Count tools/framework results
    # --------------------------------------------------------

    for result in tool_results:

        status = result.get(
            "status"
        )


        if status == "MATCH":

            score_breakdown[
                "tools_and_frameworks"
            ]["matched"] += 1


        elif status == "PARTIAL":

            score_breakdown[
                "tools_and_frameworks"
            ]["partial"] += 1


        else:

            score_breakdown[
                "tools_and_frameworks"
            ]["missing"] += 1


    return {

        "matches":
            prioritized_results,

        "matched_skills":
            matched_skills,

        "partial_skills":
            partial_skills,

        "missing_skills":
            missing_skills,

        "priority_skills":
            priority_skills,

        "skill_categories": {

            "technical_skills":
                technical_results,

            "tools_and_frameworks":
                tool_results
        },

        "score_breakdown":
            score_breakdown
    }


# ============================================================
# CATEGORY WEIGHTS
# ============================================================

SKILL_CATEGORY_WEIGHTS = {

    "technical":
        1.25,

    "tool_or_framework":
        1.15,

    "soft_skill":
        0.75,

    "other":
        0.60
}


# ============================================================
# STATUS WEIGHTS
# ============================================================

STATUS_WEIGHTS = {

    "MATCH":
        1.0,

    "PARTIAL":
        0.5,

    "MISSING":
        0.0
}


# ============================================================
# WEIGHTED MATCH SCORE
# ============================================================

def calculate_match_score(
    semantic_results
):
    """
    Calculate a weighted job compatibility score.
    """

    if not semantic_results:

        return 0


    weighted_score = 0.0

    total_weight = 0.0


    for result in semantic_results:

        status = result.get(
            "status",
            "MISSING"
        )

        category = result.get(
            "category",
            "technical"
        )


        status_weight = STATUS_WEIGHTS.get(
            status,
            0.0
        )


        category_weight = (
            SKILL_CATEGORY_WEIGHTS.get(
                category,
                1.0
            )
        )


        weighted_score += (
            status_weight
            * category_weight
        )


        total_weight += (
            category_weight
        )


    if total_weight == 0:

        return 0


    score = (
        weighted_score
        / total_weight
    ) * 100


    return round(
        score,
        2
    )


# ============================================================
# LOCAL TEST
# ============================================================

if __name__ == "__main__":

    resume_text = extract_resume_text(
        "resume.pdf"
    )


    print(
        "\n===== RESUME EXTRACTED =====\n"
    )

    print(
        resume_text
    )


    resume_data = analyze_resume(
        resume_text
    )


    print(
        "\n===== STRUCTURED RESUME =====\n"
    )

    print(
        json.dumps(
            resume_data,
            indent=4
        )
    )


    job_description = """
    We are looking for a Machine Learning Engineer.

    Requirements:
    - Python
    - Machine Learning
    - Scikit-learn
    - TensorFlow
    - PyTorch
    - SQL
    - Docker
    - FastAPI
    - Git
    - AWS
    - Pandas
    - NumPy
    - Data Structures and Algorithms
    - REST APIs
    - Problem Solving
    - Communication skills
    """


    job_data = extract_job_skills(
        job_description
    )


    print(
        "\n===== JOB SKILLS =====\n"
    )

    print(
        json.dumps(
            job_data,
            indent=4
        )
    )


    skill_gap = calculate_skill_gap(
        resume_data,
        job_data
    )


    print(
        "\n===== SKILL GAP =====\n"
    )

    print(
        json.dumps(
            skill_gap,
            indent=4
        )
    )


    match_score = calculate_match_score(
        skill_gap["matches"]
    )


    print(
        "\n===== WEIGHTED JOB MATCH SCORE =====\n"
    )

    print(
        f"Overall Match: {match_score}%"
    )


    career_roadmap = generate_career_roadmap(
        resume_data,
        job_data,
        skill_gap,
        match_score
    )


    print(
        "\n===== CAREER ROADMAP =====\n"
    )

    print(
        json.dumps(
            career_roadmap,
            indent=4
        )
    )
    