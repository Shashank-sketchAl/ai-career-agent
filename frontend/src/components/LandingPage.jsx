import { useRef, useState } from 'react';

import {
  Upload,
  FileText,
  Briefcase,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

import { motion } from 'framer-motion';


function LandingPage({
  onAnalyze,
  isLoading,
}) {
  const fileInputRef = useRef(null);

  const [resume, setResume] =
    useState(null);

  const [jobDescription, setJobDescription] =
    useState('');

  const [error, setError] =
    useState('');


  // ==========================================================
  // FILE VALIDATION
  // ==========================================================

  const validateFile = (file) => {

    if (!file) {
      return 'Please select a resume PDF.';
    }


    const isPdf =
      file.type === 'application/pdf' ||
      file.name
        .toLowerCase()
        .endsWith('.pdf');


    if (!isPdf) {
      return 'Only PDF resume files are supported.';
    }


    const maxSize =
      5 * 1024 * 1024;


    if (file.size > maxSize) {
      return 'Resume file must be smaller than 5 MB.';
    }


    return '';
  };


  // ==========================================================
  // FILE SELECTION
  // ==========================================================

  const handleFileChange = (
    event
  ) => {

    const file =
      event.target.files?.[0];


    const validationError =
      validateFile(file);


    if (validationError) {

      setResume(null);

      setError(
        validationError
      );

      return;
    }


    setError('');

    setResume(file);

  };


  // ==========================================================
  // REMOVE FILE
  // ==========================================================

  const handleRemoveFile = () => {

    setResume(null);

    setError('');


    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

  };


  // ==========================================================
  // DRAG & DROP
  // ==========================================================

  const handleDrop = (
    event
  ) => {

    event.preventDefault();


    if (isLoading) {
      return;
    }


    const file =
      event.dataTransfer.files?.[0];


    const validationError =
      validateFile(file);


    if (validationError) {

      setResume(null);

      setError(
        validationError
      );

      return;
    }


    setError('');

    setResume(file);

  };


  const handleDragOver = (
    event
  ) => {

    event.preventDefault();

  };


  // ==========================================================
  // FORM SUBMISSION
  // ==========================================================

  const handleSubmit = (
    event
  ) => {

    event.preventDefault();


    if (isLoading) {
      return;
    }


    // --------------------------------------------------------
    // Validate resume
    // --------------------------------------------------------

    const fileError =
      validateFile(resume);


    if (fileError) {

      setError(
        fileError
      );

      return;
    }


    // --------------------------------------------------------
    // Validate job description
    // --------------------------------------------------------

    const cleanedJobDescription =
      jobDescription.trim();


    if (!cleanedJobDescription) {

      setError(
        'Please enter a job description.'
      );

      return;
    }


    if (
      cleanedJobDescription.length < 30
    ) {

      setError(
        'Please enter a more complete job description.'
      );

      return;
    }


    setError('');


    onAnalyze(
      resume,
      cleanedJobDescription
    );

  };


  // ==========================================================
  // FORMAT FILE SIZE
  // ==========================================================

  const formatFileSize = (
    bytes
  ) => {

    if (!bytes) {
      return '0 KB';
    }


    const kb =
      bytes / 1024;


    if (kb < 1024) {
      return `${kb.toFixed(0)} KB`;
    }


    return `${(
      kb / 1024
    ).toFixed(2)} MB`;

  };


  return (
    <section
      id="overview"
      className="min-h-screen pt-28 pb-20 px-6"
    >

      <div className="max-w-6xl mx-auto">

        {/* ================================================= */}
        {/* HERO */}
        {/* ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="text-center max-w-3xl mx-auto"
        >

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/[0.06] text-indigo-400 text-xs font-medium mb-6">

            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />

            AI-powered career intelligence

          </div>


          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">

            Understand your

            <span className="block text-indigo-400">
              career fit.
            </span>

          </h1>


          <p className="text-slate-400 text-lg md:text-xl leading-8 mt-6 max-w-2xl mx-auto">

            Upload your resume and a target job description.
            AI Career Agent will identify your strengths,
            skill gaps, priorities and create a personalized
            roadmap.

          </p>

        </motion.div>


        {/* ================================================= */}
        {/* INPUT AREA */}
        {/* ================================================= */}

        <motion.form
          onSubmit={handleSubmit}
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
          className="mt-14"
        >

          <div className="grid lg:grid-cols-2 gap-6">

            {/* ============================================= */}
            {/* RESUME UPLOAD */}
            {/* ============================================= */}

            <div className="bg-[#141416] border border-white/10 rounded-3xl p-7">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">

                  <FileText
                    size={19}
                    className="text-indigo-400"
                  />

                </div>


                <div>

                  <h2 className="font-semibold">
                    Upload Resume
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    PDF only · Maximum 5 MB
                  </p>

                </div>

              </div>


              {!resume ? (

                <div
                  onDrop={
                    handleDrop
                  }
                  onDragOver={
                    handleDragOver
                  }
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="group cursor-pointer border border-dashed border-white/15 hover:border-indigo-500/50 rounded-2xl min-h-[260px] flex flex-col items-center justify-center text-center px-6 transition-all hover:bg-indigo-500/[0.03]"
                >

                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] group-hover:bg-indigo-500/10 flex items-center justify-center transition-colors">

                    <Upload
                      size={24}
                      className="text-slate-400 group-hover:text-indigo-400 transition-colors"
                    />

                  </div>


                  <h3 className="font-medium mt-5">
                    Drop your resume here
                  </h3>


                  <p className="text-sm text-slate-500 mt-2">
                    or click to browse your files
                  </p>


                  <span className="text-xs text-slate-600 mt-4">
                    PDF · Up to 5 MB
                  </span>


                  <input
                    ref={
                      fileInputRef
                    }
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={
                      handleFileChange
                    }
                    className="hidden"
                  />

                </div>

              ) : (

                <div className="min-h-[260px] rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] flex flex-col justify-center p-6">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">

                      <CheckCircle2
                        size={22}
                        className="text-emerald-400"
                      />

                    </div>


                    <div className="min-w-0">

                      <p className="font-medium truncate">
                        {resume.name}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {formatFileSize(
                          resume.size
                        )}
                      </p>

                    </div>


                    {!isLoading && (

                      <button
                        type="button"
                        onClick={
                          handleRemoveFile
                        }
                        className="ml-auto w-9 h-9 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                        aria-label="Remove resume"
                      >

                        <X size={17} />

                      </button>

                    )}

                  </div>


                  <div className="mt-6 pt-5 border-t border-white/10">

                    <p className="text-sm text-slate-400">
                      Your resume is ready for analysis.
                    </p>

                    <p className="text-xs text-slate-600 mt-2">
                      The PDF is temporarily processed by
                      the backend and is not required to remain
                      permanently stored.
                    </p>

                  </div>

                </div>

              )}

            </div>


            {/* ============================================= */}
            {/* JOB DESCRIPTION */}
            {/* ============================================= */}

            <div className="bg-[#141416] border border-white/10 rounded-3xl p-7">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">

                  <Briefcase
                    size={19}
                    className="text-violet-400"
                  />

                </div>


                <div>

                  <h2 className="font-semibold">
                    Target Job
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Paste the complete job description
                  </p>

                </div>

              </div>


              <textarea
                value={
                  jobDescription
                }
                onChange={(event) => {

                  setJobDescription(
                    event.target.value
                  );

                  if (error) {
                    setError('');
                  }

                }}
                placeholder={`Paste the job description here...

Example:

We are looking for a Machine Learning Engineer with experience in Python, machine learning, SQL, FastAPI, Docker and AWS...`}
                disabled={
                  isLoading
                }
                className="w-full min-h-[260px] resize-none rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
              />


              <div className="flex justify-between items-center mt-3">

                <span className="text-xs text-slate-600">
                  {jobDescription.length} characters
                </span>


                {jobDescription.trim().length >= 30 && (

                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">

                    <CheckCircle2
                      size={13}
                    />

                    Ready

                  </span>

                )}

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* ERROR */}
          {/* ================================================= */}

          {error && (

            <motion.div
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/[0.05] px-5 py-4"
            >

              <AlertCircle
                size={19}
                className="text-rose-400 mt-0.5 shrink-0"
              />

              <div>

                <p className="text-sm font-medium text-rose-300">
                  Please check your input
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  {error}
                </p>

              </div>

            </motion.div>

          )}


          {/* ================================================= */}
          {/* SUBMIT */}
          {/* ================================================= */}

          <div className="flex justify-center mt-8">

            <button
              type="submit"
              disabled={
                isLoading
              }
              className="group inline-flex items-center justify-center gap-3 min-w-[240px] px-7 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-medium shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all"
            >

              {isLoading ? (

                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />

                  Analyzing your career...

                </>

              ) : (

                <>
                  Analyze My Career

                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />

                </>

              )}

            </button>

          </div>


          {/* ================================================= */}
          {/* PROCESS INFORMATION */}
          {/* ================================================= */}

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 text-xs text-slate-600">

            <span>
              Resume Intelligence
            </span>

            <span>
              •
            </span>

            <span>
              Semantic Skill Matching
            </span>

            <span>
              •
            </span>

            <span>
              AI Career Roadmap
            </span>

          </div>

        </motion.form>


        {/* ================================================= */}
        {/* PROCESS STEPS */}
        {/* ================================================= */}

        <div className="grid md:grid-cols-3 gap-4 mt-16">

          {[
            {
              number: '01',
              title: 'Analyze',
              text: 'AI extracts structured information from your resume and target job.',
            },

            {
              number: '02',
              title: 'Compare',
              text: 'Semantic matching identifies matched, partial and missing skills.',
            },

            {
              number: '03',
              title: 'Improve',
              text: 'Your highest-priority gaps become a personalized learning roadmap.',
            },
          ].map(
            (item) => (

              <div
                key={item.number}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-5"
              >

                <span className="text-xs font-mono text-indigo-400">
                  {item.number}
                </span>

                <h3 className="font-semibold mt-3">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-500 leading-6 mt-2">
                  {item.text}
                </p>

              </div>

            )
          )}

        </div>

      </div>

    </section>
  );
}


export default LandingPage;
