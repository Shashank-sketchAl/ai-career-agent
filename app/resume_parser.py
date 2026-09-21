from pypdf import PdfReader
from resume_analyzer import analyze_resume


def extract_resume_text(pdf_path):
    reader = PdfReader(pdf_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text.strip()


if __name__ == "__main__":

    pdf_path = "resume.pdf"

    resume_text = extract_resume_text(pdf_path)

    print("\n===== EXTRACTED RESUME =====\n")
    print(resume_text)

    result = analyze_resume(resume_text)

    print("\n===== STRUCTURED RESUME =====\n")
    print(result)
    