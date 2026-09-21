from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim


# ============================================================
# SEMANTIC MODEL
# ============================================================

model = SentenceTransformer("all-MiniLM-L6-v2")


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

# These technologies are related conceptually but should NOT
# automatically match each other.

TECHNOLOGY_FAMILIES = {

    "cloud": {
        "aws",
        "azure",
        "google cloud",
        "gcp",
        "oracle cloud"
    },

    "deep_learning_framework": {
        "tensorflow",
        "pytorch",
        "keras"
    },

    "database": {
        "sql",
        "mysql",
        "postgresql",
        "mongodb",
        "oracle database",
        "sqlite"
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
        "rust"
    },

    "version_control": {
        "git",
        "github",
        "gitlab",
        "bitbucket"
    },

    "web_framework": {
        "fastapi",
        "django",
        "flask",
        "express",
        "spring boot"
    }
}


def get_technology_family(skill):
    """
    Return the technology family of a skill.

    This prevents semantically similar but technically
    different technologies from being treated as direct
    matches.
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
    Determine whether two skills belong to the same
    technology family but represent different technologies.

    Example:

        AWS vs Google Cloud
        TensorFlow vs PyTorch
        MySQL vs MongoDB

    These should not become MATCH simply because their
    semantic embeddings are similar.
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

    Technology-specific safeguards prevent related but
    different technologies from becoming false MATCH results.
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


    # ========================================================
    # GENERATE EMBEDDINGS
    # ========================================================

    job_embeddings = model.encode(
        job_skills,
        convert_to_tensor=True
    )

    resume_embeddings = model.encode(
        resume_skills,
        convert_to_tensor=True
    )


    results = []


    # ========================================================
    # PROCESS EACH JOB SKILL
    # ========================================================

    for index, job_skill in enumerate(
        job_skills
    ):

        canonical_job = canonical_skill(
            job_skill
        )


        # ====================================================
        # STEP 1 — EXACT / CANONICAL MATCH
        # ====================================================

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
                "status": "MATCH"
            })

            continue


        # ====================================================
        # STEP 2 — SEMANTIC SIMILARITY
        # ====================================================

        similarities = cos_sim(
            job_embeddings[index],
            resume_embeddings
        )[0]


        # ----------------------------------------------------
        # Sort candidates by similarity.
        # ----------------------------------------------------

        ranked_indices = similarities.argsort(
            descending=True
        )


        best_index = None
        best_score = 0.0


        # ====================================================
        # STEP 3 — FIND BEST VALID CANDIDATE
        # ====================================================

        for candidate_index in ranked_indices:

            candidate_index = candidate_index.item()

            candidate_score = similarities[
                candidate_index
            ].item()

            candidate_resume_skill = resume_skills[
                candidate_index
            ]


            # -----------------------------------------------
            # Prevent incompatible technology matches.
            # -----------------------------------------------

            if are_incompatible_technologies(
                job_skill,
                candidate_resume_skill
            ):
                continue


            best_index = candidate_index
            best_score = candidate_score

            break


        # ====================================================
        # NO VALID SEMANTIC MATCH
        # ====================================================

        if best_index is None:

            results.append({
                "job_skill": job_skill,
                "resume_skill": None,
                "similarity": 0.0,
                "status": "MISSING"
            })

            continue


        best_resume_skill = resume_skills[
            best_index
        ]


        # ====================================================
        # STEP 4 — DETERMINE STATUS
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
            "status": status
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
        "Git"

    ]


    job_skills = [

        "Python programming",
        "SQL",
        "Machine Learning",
        "Deep Learning",
        "Backend API development",
        "AWS",
        "Git"

    ]


    matches = match_skills(
        job_skills,
        resume_skills
    )


    print(
        "\n===== SEMANTIC SKILL MATCHING =====\n"
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
        