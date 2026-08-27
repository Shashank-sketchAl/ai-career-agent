from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim


model = SentenceTransformer("all-MiniLM-L6-v2")


resume_skills = [
    "Python",
    "Pandas",
    "NumPy",
    "Machine Learning",
    "CNN image classification",
]


job_skills = [
    "Python programming",
    "SQL",
    "Deep Learning",
    "AWS",
]


for job_skill in job_skills:

    job_embedding = model.encode(
        job_skill,
        convert_to_tensor=True
    )

    print(f"\nJob requirement: {job_skill}")

    best_skill = None
    best_score = -1

    for resume_skill in resume_skills:

        resume_embedding = model.encode(
            resume_skill,
            convert_to_tensor=True
        )

        similarity = cos_sim(
            job_embedding,
            resume_embedding
        ).item()

        if similarity > best_score:
            best_score = similarity
            best_skill = resume_skill

    print(f"Best resume match: {best_skill}")
    print(f"Similarity: {best_score:.2f}")
