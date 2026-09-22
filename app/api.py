from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    HTTPException,
)

from fastapi.middleware.cors import CORSMiddleware

import os

from resume_parser import extract_resume_text
from resume_analyzer import analyze_resume

from skill_gap import (
    extract_job_skills,
    calculate_skill_gap,
    calculate_match_score,
)

from career_advisor import generate_career_roadmap


# ============================================================
# APPLICATION
# ============================================================

app = FastAPI(
    title="AI Career Agent",
    description=(
        "AI-powered resume analysis, job compatibility "
        "analysis, skill gap detection and career guidance."
    ),
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local development
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        # Production Vercel frontend
        "https://frontend-psi-navy-3dglne6ox0.vercel.app",

        # Previous Vercel deployment URL
        "https://frontend-psi-navy-3dglne6x0.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# CONSTANTS
# ============================================================

MAX_RESUME_SIZE = 5 * 1024 * 1024

ALLOWED_RESUME_TYPES = {
    "application/pdf",
}

TEMP_RESUME_PATH = "temp_resume.pdf"


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def home():

    return {
        "status": "success",
        "message": "AI Career Agent API is running",
        "version": "1.0.0",
    }


# ============================================================
# HEALTH ENDPOINT
# ============================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "service": "AI Career Agent",
    }


# ============================================================
# CAREER ANALYSIS
# ============================================================

@app.post("/analyze-career")
async def analyze_career(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
):
    """
    Complete AI Career Agent pipeline.

    Flow:

        Resume PDF
            ↓
        Resume Text Extraction
            ↓
        Resume Intelligence
            ↓
        Job Requirement Extraction
            ↓
        Semantic Skill Matching
            ↓
        Skill Gap Analysis
            ↓
        Match Score
            ↓
        Skill Priority Engine
            ↓
        AI Career Roadmap
    """

    # ========================================================
    # VALIDATE JOB DESCRIPTION
    # ========================================================

    if not job_description:

        raise HTTPException(
            status_code=400,
            detail="Job description is required.",
        )

    job_description = job_description.strip()

    if len(job_description) < 30:

        raise HTTPException(
            status_code=400,
            detail=(
                "Job description is too short. "
                "Please provide a complete job description."
            ),
        )


    # ========================================================
    # VALIDATE RESUME
    # ========================================================

    if not resume:

        raise HTTPException(
            status_code=400,
            detail="Resume PDF is required.",
        )


    # --------------------------------------------------------
    # Validate filename
    # --------------------------------------------------------

    filename = resume.filename or ""

    if not filename.lower().endswith(".pdf"):

        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are supported.",
        )


    # --------------------------------------------------------
    # Validate MIME type
    # --------------------------------------------------------

    if (
        resume.content_type
        and resume.content_type
        not in ALLOWED_RESUME_TYPES
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid resume file type. Please upload a PDF.",
        )


    # ========================================================
    # SAVE TEMPORARY RESUME
    # ========================================================

    try:

        file_size = 0

        with open(
            TEMP_RESUME_PATH,
            "wb",
        ) as buffer:

            while True:

                chunk = await resume.read(
                    1024 * 1024
                )

                if not chunk:
                    break

                file_size += len(chunk)

                if file_size > MAX_RESUME_SIZE:

                    raise HTTPException(
                        status_code=413,
                        detail=(
                            "Resume file is too large. "
                            "Maximum allowed size is 5 MB."
                        ),
                    )

                buffer.write(chunk)


        # ====================================================
        # EXTRACT RESUME TEXT
        # ====================================================

        resume_text = extract_resume_text(
            TEMP_RESUME_PATH
        )


        if not resume_text or not resume_text.strip():

            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract readable text "
                    "from the uploaded resume."
                ),
            )


        # ====================================================
        # RESUME ANALYSIS
        # ====================================================

        resume_data = analyze_resume(
            resume_text
        )


        if not isinstance(
            resume_data,
            dict,
        ):

            raise HTTPException(
                status_code=500,
                detail=(
                    "Resume analysis returned "
                    "an invalid response."
                ),
            )


        # ====================================================
        # JOB ANALYSIS
        # ====================================================

        job_data = extract_job_skills(
            job_description
        )


        if not isinstance(
            job_data,
            dict,
        ):

            raise HTTPException(
                status_code=500,
                detail=(
                    "Job analysis returned "
                    "an invalid response."
                ),
            )


        # ====================================================
        # SKILL GAP ANALYSIS
        # ====================================================

        skill_gap = calculate_skill_gap(
            resume_data,
            job_data,
        )


        if not isinstance(
            skill_gap,
            dict,
        ):

            raise HTTPException(
                status_code=500,
                detail=(
                    "Skill gap analysis returned "
                    "an invalid response."
                ),
            )


        # ====================================================
        # MATCH SCORE
        # ====================================================

        match_score = calculate_match_score(
            skill_gap.get(
                "matches",
                [],
            )
        )


        # ====================================================
        # CAREER ROADMAP
        # ====================================================

        career_roadmap = generate_career_roadmap(
            resume_data,
            job_data,
            skill_gap,
            match_score,
        )


        if not isinstance(
            career_roadmap,
            dict,
        ):

            raise HTTPException(
                status_code=500,
                detail=(
                    "Career advisor returned "
                    "an invalid response."
                ),
            )


        # ====================================================
        # FINAL RESPONSE
        # ====================================================

        return {
            "status": "success",

            "match_score": match_score,

            "resume": resume_data,

            "job_requirements": job_data,

            "skill_gap": skill_gap,

            "career_advisor": career_roadmap,
        }


    # ========================================================
    # EXPECTED HTTP ERRORS
    # ========================================================

    except HTTPException:

        raise


    # ========================================================
    # UNEXPECTED ERRORS
    # ========================================================

    except Exception as error:

        print(
            "Career analysis error:",
            repr(error),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Career analysis failed. "
                "Please check the backend logs "
                "for more information."
            ),
        )


    # ========================================================
    # CLEANUP
    # ========================================================

    finally:

        # ----------------------------------------------------
        # Always remove temporary resume
        # ----------------------------------------------------

        if os.path.exists(
            TEMP_RESUME_PATH
        ):

            try:

                os.remove(
                    TEMP_RESUME_PATH
                )

            except OSError:

                pass


        # ----------------------------------------------------
        # Close uploaded file
        # ----------------------------------------------------

        try:

            await resume.close()

        except Exception:

            pass
        