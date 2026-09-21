import { useState } from 'react';

import {
  AlertCircle,
  X,
} from 'lucide-react';

import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

import { analyzeCareer } from './services/api';


function App() {
  const [loading, setLoading] =
    useState(false);

  const [data, setData] =
    useState(null);

  const [view, setView] =
    useState('landing');

  const [error, setError] =
    useState('');


  // ==========================================================
  // CAREER ANALYSIS
  // ==========================================================

  const handleAnalyze = async (
    resume,
    jobDescription
  ) => {

    try {

      setLoading(true);

      setError('');


      console.log(
        'Sending resume to backend...'
      );

      console.log(
        'Job description:',
        jobDescription
      );


      const result =
        await analyzeCareer(
          resume,
          jobDescription
        );


      console.log(
        'Backend result:',
        result
      );


      setData(result);

      setView('dashboard');

    } catch (error) {

      console.error(
        'Career analysis failed:',
        error
      );


      setError(
        error?.message ||
        'Unable to analyze your career. Please try again.'
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================================
  // NEW ANALYSIS
  // ==========================================================

  const handleNewAnalysis = () => {

    setData(null);

    setError('');

    setView('landing');

  };


  // ==========================================================
  // DISMISS ERROR
  // ==========================================================

  const handleDismissError = () => {

    setError('');

  };


  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">

      <Navbar />


      {/* ==================================================== */}
      {/* GLOBAL ERROR MESSAGE */}
      {/* ==================================================== */}

      {error && (

        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-2xl">

          <div className="flex items-start gap-4 rounded-2xl border border-rose-500/20 bg-[#171216]/95 backdrop-blur-xl px-5 py-4 shadow-2xl shadow-black/40">

            <div className="w-10 h-10 shrink-0 rounded-xl bg-rose-500/10 flex items-center justify-center">

              <AlertCircle
                size={20}
                className="text-rose-400"
              />

            </div>


            <div className="flex-1 min-w-0">

              <p className="text-sm font-semibold text-rose-300">
                Analysis failed
              </p>

              <p className="text-sm text-slate-400 mt-1 leading-6">
                {error}
              </p>

            </div>


            <button
              type="button"
              onClick={
                handleDismissError
              }
              className="text-slate-500 hover:text-white transition-colors"
              aria-label="Dismiss error"
            >

              <X size={18} />

            </button>

          </div>

        </div>

      )}


      {/* ==================================================== */}
      {/* MAIN APPLICATION */}
      {/* ==================================================== */}

      <main>

        {view === 'landing' ? (

          <LandingPage
            onAnalyze={
              handleAnalyze
            }
            isLoading={
              loading
            }
          />

        ) : (

          <Dashboard
            data={data}
            onNewAnalysis={
              handleNewAnalysis
            }
          />

        )}

      </main>

    </div>
  );
}


export default App;
