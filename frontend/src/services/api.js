const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://ai-career-agent-c3ky.onrender.com";


export async function analyzeCareer(
  resumeFile,
  jobDescription
) {

  if (!resumeFile) {
    throw new Error("Please upload your resume PDF.");
  }

  if (!jobDescription || jobDescription.trim().length < 30) {
    throw new Error(
      "Please provide a job description of at least 30 characters."
    );
  }


  const formData = new FormData();

  formData.append(
    "resume",
    resumeFile
  );

  formData.append(
    "job_description",
    jobDescription
  );


  let response;

  try {

    response = await fetch(
      `${API_BASE_URL}/analyze-career`,
      {
        method: "POST",
        body: formData,
      }
    );

  } catch (error) {

    throw new Error(
      "Unable to connect to the AI Career Agent server. Please try again."
    );

  }


  let data;

  try {

    data = await response.json();

  } catch (error) {

    throw new Error(
      `Server returned an invalid response. HTTP ${response.status}.`
    );

  }


  if (!response.ok) {

    throw new Error(
      data?.detail ||
      data?.message ||
      `Analysis failed. HTTP ${response.status}.`
    );

  }


  if (data?.status !== "success") {

    throw new Error(
      data?.message ||
      "Career analysis failed."
    );

  }


  return data;
}


export async function checkBackendHealth() {

  try {

    const response = await fetch(
      `${API_BASE_URL}/health`
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    return data?.status === "success";

  } catch (error) {

    return false;

  }
}


export default {
  analyzeCareer,
  checkBackendHealth,
};
