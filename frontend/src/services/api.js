const API_BASE_URL = 'http://127.0.0.1:8000';


// ============================================================
// ANALYZE CAREER
// ============================================================

export async function analyzeCareer(
  resumeFile,
  jobDescription
) {
  if (!resumeFile) {
    throw new Error(
      'Please upload your resume PDF.'
    );
  }

  if (!jobDescription || !jobDescription.trim()) {
    throw new Error(
      'Please enter a job description.'
    );
  }


  const formData = new FormData();

  formData.append(
    'resume',
    resumeFile
  );

  formData.append(
    'job_description',
    jobDescription.trim()
  );


  let response;


  // ========================================================
  // SEND REQUEST
  // ========================================================

  try {

    response = await fetch(
      `${API_BASE_URL}/analyze-career`,
      {
        method: 'POST',
        body: formData,
      }
    );

  } catch (error) {

    throw new Error(
      'Unable to connect to the AI Career Agent backend. Make sure FastAPI is running on port 8000.'
    );
  }


  // ========================================================
  // HANDLE RESPONSE
  // ========================================================

  if (!response.ok) {

    let errorMessage =
      'Career analysis failed.';


    try {

      const errorData =
        await response.json();


      if (
        typeof errorData.detail ===
        'string'
      ) {

        errorMessage =
          errorData.detail;

      } else if (
        Array.isArray(
          errorData.detail
        )
      ) {

        errorMessage =
          errorData.detail
            .map(
              (item) =>
                item.msg ||
                'Invalid request.'
            )
            .join(', ');

      }

    } catch {

      try {

        const errorText =
          await response.text();

        if (errorText) {
          errorMessage =
            errorText;
        }

      } catch {
        // Keep default error message.
      }
    }


    throw new Error(
      errorMessage
    );
  }


  // ========================================================
  // PARSE SUCCESS RESPONSE
  // ========================================================

  let data;


  try {

    data =
      await response.json();

  } catch {

    throw new Error(
      'The backend returned an invalid response.'
    );
  }


  // ========================================================
  // VALIDATE RESPONSE
  // ========================================================

  if (
    !data ||
    typeof data !== 'object'
  ) {

    throw new Error(
      'The backend returned an empty response.'
    );
  }


  if (
    data.status &&
    data.status !== 'success'
  ) {

    throw new Error(
      'Career analysis was not completed successfully.'
    );
  }


  return data;
}
