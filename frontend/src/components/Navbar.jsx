import { Cpu } from 'lucide-react';

function Navbar() {
  const handleNavigation = (sectionId) => {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0A0A0B]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Cpu size={20} />
          </div>

          <span className="text-lg font-bold tracking-tight">
            AI Career Agent
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <button
            type="button"
            onClick={() => handleNavigation('overview')}
            className="hover:text-white transition-colors"
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => handleNavigation('skill-gap')}
            className="hover:text-white transition-colors"
          >
            Skill Gap
          </button>

          <button
            type="button"
            onClick={() => handleNavigation('roadmap')}
            className="hover:text-white transition-colors"
          >
            Roadmap
          </button>

          <div className="h-5 w-px bg-white/10" />

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
