import math
import os

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
# EMBEDDING CONFIGURATION
# ============================================================

EMBEDDING_MODEL = "gemini-embedding-001"

EMBEDDING_DIMENSION = 768


# ============================================================
# SKILL NORMALIZATION
# ============================================================

def normalize_skill(skill):
    """
    Normalize a skill name before comparison.

    Examples:

        Python
        python programming
        Python-Programming

    become a consistent representation.
    """

    if not isinstance(skill, str):
        return ""

    return (
        skill
        .strip()
        .lower()
        .replace("-", " ")
        .replace("_", " ")
        .replace("/", " ")
        .replace(".", " ")
    )


# ============================================================
# SKILL ALIASES
# ============================================================

SKILL_ALIASES = {

    # -------------------------
    # Python
    # -------------------------

    "python programming": "python",
    "python development": "python",
    "python language": "python",

    # -------------------------
    # Machine Learning
    # -------------------------

    "ml": "machine learning",
    "machine learning algorithms": "machine learning",

    # -------------------------
    # Deep Learning
    # -------------------------

    "dl": "deep learning",
    "deep learning algorithms": "deep learning",

    # -------------------------
    # Scikit-learn
    # -------------------------

    "scikit learn": "scikit learn",
    "sklearn": "scikit learn",
    "scikit learn library": "scikit learn",

    # -------------------------
    # JavaScript
    # -------------------------

    "js": "javascript",
    "javascript programming": "javascript",

    # -------------------------
    # TypeScript
    # -------------------------

    "ts": "typescript",
    "typescript programming": "typescript",

    # -------------------------
    # SQL
    # -------------------------

    "sql programming": "sql",
    "structured query language": "sql",

    # -------------------------
    # REST APIs
    # -------------------------

    "rest api": "api development",
    "rest apis": "api development",
    "restful api": "api development",
    "restful apis": "api development",
    "backend api development": "api development",

    # -------------------------
    # AWS
    # -------------------------

    "amazon web services": "aws",
    "aws cloud": "aws",

    # -------------------------
    # Git
    # -------------------------

    "git version control": "git",
    "version control git": "git",

    # -------------------------
    # Docker
    # -------------------------

    "docker container": "docker",
    "docker containers": "docker",

    # -------------------------
    # FastAPI
    # -------------------------

    "fast api": "fastapi",
    "fastapi framework": "fastapi",

    # -------------------------
    # TensorFlow
    # -------------------------

    "tensorflow framework": "tensorflow",

    # -------------------------
    # PyTorch
    # -------------------------

    "pytorch framework": "pytorch",

    # -------------------------
    # Pandas
    # -------------------------

    "pandas library": "pandas",

    # -------------------------
    # NumPy
    # -------------------------

    "numpy library": "numpy",

    # -------------------------
    # Databases
    # -------------------------

    "mysql database": "mysql",
    "mysql database system": "mysql",

    "postgres database": "postgresql",
    "postgres database system": "postgresql",

    "mongodb database": "mongodb",
    "mongo database": "mongodb",

    # -------------------------
    # Cloud aliases
    # -------------------------

    "google cloud platform": "google cloud",
    "google cloud platform cloud": "google cloud",

    # -------------------------
    # GitHub
    # -------------------------

    "github repository": "github",
    "github repositories": "github",
}


def canonical_skill(skill):
    """
    Convert a skill into its canonical representation.
    """

    normalized = normalize_skill(skill)

    return SKILL_ALIASES.get(
        normalized,
        normalized
    )


# ============================================================
# RELATED TECHNOLOGY GROUPS
# ============================================================

TECHNOLOGY_FAMILIES = {

    "cloud": {
        "aws",
        "azure",
        "google cloud",
        "gcp",
        "oracle cloud",
    },

    "deep_learning_framework": {
        "tensorflow",
        "pytorch",
        "keras",
    },

    "database": {
        "sql",
        "mysql",
        "postgresql",
        "mongodb",
        "oracle database",
        "sqlite",
    },

    "programming_language": {
        "python",
        "java",
        "javascript",
        "typescript",
        "c",
        "c++",
        "c sharp",
        "go",
        "rust",
    },

    "version_control": {
        "git",
        "github",
        "gitlab",
        "bitbucket",
    },

    "web_framework": {
        "fastapi",
        "django",
        "flask",
        "express",
        "spring boot",
    },
}


def get_technology_family(skill):
    """
    Return the technology family of a skill.
    """

    canonical = canonical_skill(skill)

    for family, skills in TECHNOLOGY_FAMILIES.items():

        if canonical in skills:
            return family

    return None


def are_incompatible_technologies(
    job_skill,
    resume_skill
):
    """
    Prevent related but technically different
    technologies from becoming direct matches.

    Examples:

        AWS vs Google Cloud
        TensorFlow vs PyTorch
        MySQL vs MongoDB
    """

    job_canonical = canonical_skill(
        job_skill
    )

    resume_canonical = canonical_skill(
        resume_skill
    )

    job_family = get_technology_family(
        job_canonical
    )

    resume_family = get_technology_family(
        resume_canonical
    )

    if not job_family:
        return False

    if job_family != resume_family:
        return False

    if job_canonical == resume_canonical:
        return False

    return True


# ============================================================
# COSINE SIMILARITY
# ============================================================

def cosine_similarity(
    vector_a,
    vector_b
):
    """
    Calculate cosine similarity between two vectors.

    This implementation avoids NumPy and PyTorch,
    keeping the deployment lightweight.
    """

    if not vector_a or not vector_b:
        return 0.0

    if len(vector_a) != len(vector_b):
        return 0.0

    dot_product = 0.0
    magnitude_a = 0.0
    magnitude_b = 0.0

    for value_a, value_b in zip(
        vector_a,
        vector_b
    ):

        dot_product += (
            value_a * value_b
        )

        magnitude_a += (
            value_a * value_a
        )

        magnitude_b += (
            value_b * value_b
        )

    if (
        magnitude_a == 0.0
        or magnitude_b == 0.0
    ):
        return 0.0

    return (
        dot_product
        /
        (
            math.sqrt(magnitude_a)
            *
            math.sqrt(magnitude_b)
        )
    )


# ============================================================
# GEMINI EMBEDDINGS
# ============================================================

def generate_embeddings(texts):
    """
    Generate embeddings for a list of skill names
    using the Gemini Embedding API.

    A single API request is used for the complete
    list of texts.
    """

    if not texts:
        return []

    try:

        response = client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=texts,
            config=types.EmbedContentConfig(
                task_type="SEMANTIC_SIMILARITY",
                output_dimensionality=EMBEDDING_DIMENSION,
            ),
        )

    except Exception as error:

        raise RuntimeError(
            "Gemini embedding generation failed: "
            f"{error}"
        ) from error


    if not response.embeddings:

        raise RuntimeError(
            "Gemini embedding API returned no embeddings."
        )


    embeddings = []

    for embedding in response.embeddings:

        values = getattr(
            embedding,
            "values",
            None
        )

        if not values:

            raise RuntimeError(
                "Gemini returned an invalid embedding."
            )

        embeddings.append(
            list(values)
        )

    return embeddings


# ============================================================
# SEMANTIC SKILL MATCHING
# ============================================================

def match_skills(
    job_skills,
    resume_skills,
    threshold=0.65,
    partial_threshold=0.50
):
    """
    Compare job-required skills with resume skills.

    Matching levels:

        MATCH
            similarity >= threshold

        PARTIAL
            similarity >= partial_threshold

        MISSING
            similarity < partial_threshold

    Exact/canonical matches are always preferred.

    Semantic similarity is generated using the
    Gemini Embedding API instead of a local
    SentenceTransformer/PyTorch model.

    Technology-specific safeguards prevent related
    but different technologies from becoming false
    MATCH results.
    """

    if not job_skills or not resume_skills:
        return []


    # ========================================================
    # CLEAN INPUT
    # ========================================================

    job_skills = [
        skill.strip()
        for skill in job_skills
        if isinstance(skill, str)
        and skill.strip()
    ]

    resume_skills = [
        skill.strip()
        for skill in resume_skills
        if isinstance(skill, str)
        and skill.strip()
    ]


    if not job_skills or not resume_skills:
        return []


    # ========================================================
    # CANONICAL RESUME SKILLS
    # ========================================================

    canonical_resume = [
        canonical_skill(skill)
        for skill in resume_skills
    ]


    results = []


    # ========================================================
    # FIND EXACT / CANONICAL MATCHES FIRST
    # ========================================================

    unmatched_job_skills = []

    for job_skill in job_skills:

        canonical_job = canonical_skill(
            job_skill
        )

        exact_match_index = None

        for resume_index, resume_skill in enumerate(
            canonical_resume
        ):

            if canonical_job == resume_skill:

                exact_match_index = resume_index

                break


        if exact_match_index is not None:

            results.append({
                "job_skill": job_skill,
                "resume_skill": resume_skills[
                    exact_match_index
                ],
                "similarity": 1.0,
                "status": "MATCH",
            })

        else:

            unmatched_job_skills.append(
                job_skill
            )


    # ========================================================
    # ALL SKILLS ALREADY MATCHED
    # ========================================================

    if not unmatched_job_skills:
        return results


    # ========================================================
    # GENERATE EMBEDDINGS
    # ========================================================

    embedding_texts = (
        unmatched_job_skills
        +
        resume_skills
    )

    embeddings = generate_embeddings(
        embedding_texts
    )


    job_embedding_count = len(
        unmatched_job_skills
    )

    job_embeddings = embeddings[
        :job_embedding_count
    ]

    resume_embeddings = embeddings[
        job_embedding_count:
    ]


    # ========================================================
    # SEMANTIC MATCHING
    # ========================================================

    for job_index, job_skill in enumerate(
        unmatched_job_skills
    ):

        similarities = []

        for resume_index, resume_skill in enumerate(
            resume_skills
        ):

            # -----------------------------------------------
            # Prevent incompatible technology matches.
            # -----------------------------------------------

            if are_incompatible_technologies(
                job_skill,
                resume_skill
            ):

                similarities.append(
                    None
                )

                continue


            similarity = cosine_similarity(
                job_embeddings[job_index],
                resume_embeddings[resume_index]
            )

            similarities.append(
                similarity
            )


        # ====================================================
        # FIND BEST VALID CANDIDATE
        # ====================================================

        best_index = None
        best_score = 0.0

        for candidate_index, score in enumerate(
            similarities
        ):

            if score is None:
                continue

            if score > best_score:

                best_score = score
                best_index = candidate_index


        # ====================================================
        # NO VALID MATCH
        # ====================================================

        if best_index is None:

            results.append({
                "job_skill": job_skill,
                "resume_skill": None,
                "similarity": 0.0,
                "status": "MISSING",
            })

            continue


        best_resume_skill = resume_skills[
            best_index
        ]


        # ====================================================
        # DETERMINE STATUS
        # ====================================================

        if best_score >= threshold:

            status = "MATCH"

        elif best_score >= partial_threshold:

            status = "PARTIAL"

        else:

            status = "MISSING"

            best_resume_skill = None


        # ====================================================
        # STORE RESULT
        # ====================================================

        results.append({
            "job_skill": job_skill,
            "resume_skill": best_resume_skill,
            "similarity": round(
                best_score,
                2
            ),
            "status": status,
        })


    return results


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    resume_skills = [

        "Python",
        "Pandas",
        "NumPy",
        "Machine Learning",
        "CNN image classification",
        "FastAPI",
        "MySQL database",
        "Google Cloud",
        "Git",

    ]


    job_skills = [

        "Python programming",
        "SQL",
        "Machine Learning",
        "Deep Learning",
        "Backend API development",
        "AWS",
        "Git",

    ]


    matches = match_skills(
        job_skills,
        resume_skills
    )


    print(
        "\n===== GEMINI SEMANTIC SKILL MATCHING =====\n"
    )


    for match in matches:

        resume_skill = (
            match["resume_skill"]
            if match["resume_skill"]
            else "No strong evidence"
        )

        print(
            f"{match['job_skill']} "
            f"→ {resume_skill} "
            f"| Similarity: {match['similarity']} "
            f"| {match['status']}"
        )
        