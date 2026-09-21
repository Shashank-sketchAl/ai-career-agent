import {
  CheckCircle2,
  AlertCircle,
  Zap,
  Briefcase,
  Target,
  ArrowRight,
  RotateCcw,
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  Sparkles,
  Info,
  Flame,
} from 'lucide-react';

import { motion } from 'framer-motion';


// ============================================================
// HELPER: DISPLAY VALUE
// ============================================================

function displayValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return '';
}


// ============================================================
// HELPER: NORMALIZE ARRAY
// ============================================================

function normalizeArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}


// ============================================================
// INFO CARD
// ============================================================

function InfoCard({
  icon: Icon,
  title,
  children,
}) {
  return (
    <div className="bg-[#141416] border border-white/10 rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
          <Icon
            size={19}
            className="text-indigo-400"
          />
        </div>

        <h3 className="font-semibold">
          {title}
        </h3>
      </div>

      {children}
    </div>
  );
}


// ============================================================
// METRIC CARD
// ============================================================

function MetricCard({
  icon: Icon,
  value,
  label,
  type,
}) {
  const styles = {
    matched: {
      container:
        'bg-emerald-500/[0.08] border-emerald-500/30',
      icon:
        'bg-emerald-500/10 text-emerald-400',
      value:
        'text-emerald-400',
      label:
        'text-emerald-400',
    },

    partial: {
      container:
        'bg-amber-500/[0.08] border-amber-500/30',
      icon:
        'bg-amber-500/10 text-amber-400',
      value:
        'text-amber-400',
      label:
        'text-amber-400',
    },

    missing: {
      container:
        'bg-rose-500/[0.08] border-rose-500/30',
      icon:
        'bg-rose-500/10 text-rose-400',
      value:
        'text-rose-400',
      label:
        'text-rose-400',
    },
  };

  const style = styles[type];

  return (
    <div
      className={`rounded-3xl border p-7 ${style.container}`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${style.icon}`}
      >
        <Icon size={20} />
      </div>

      <div
        className={`text-3xl font-bold mt-6 ${style.value}`}
      >
        {value}
      </div>

      <div
        className={`text-xs uppercase tracking-wider mt-2 ${style.label}`}
      >
        {label}
      </div>
    </div>
  );
}


// ============================================================
// SKILL SECTION
// ============================================================

function SkillSection({
  title,
  skills,
  type,
  icon: Icon,
}) {
  const styles = {
    matched: {
      border:
        'border-emerald-500/20',
      background:
        'bg-emerald-500/[0.04]',
      badge:
        'bg-emerald-500/10 text-emerald-400',
      icon:
        'text-emerald-400',
    },

    partial: {
      border:
        'border-amber-500/20',
      background:
        'bg-amber-500/[0.04]',
      badge:
        'bg-amber-500/10 text-amber-400',
      icon:
        'text-amber-400',
    },

    missing: {
      border:
        'border-rose-500/20',
      background:
        'bg-rose-500/[0.04]',
      badge:
        'bg-rose-500/10 text-rose-400',
      icon:
        'text-rose-400',
    },
  };

  const style = styles[type];

  return (
    <div
      className={`rounded-2xl border ${style.border} ${style.background} p-5`}
    >
      <div className="flex items-center gap-2 mb-5">
        <Icon
          size={18}
          className={style.icon}
        />

        <h4 className="font-semibold">
          {title}
        </h4>

        <span
          className={`ml-auto px-2.5 py-1 rounded-full text-xs ${style.badge}`}
        >
          {skills.length}
        </span>
      </div>

      {skills.length === 0 ? (
        <p className="text-sm text-slate-600">
          None identified.
        </p>
      ) : (
        <div className="space-y-3">
          {skills.map((skill, index) => {
            const requiredSkill =
              skill.job_skill ||
              skill.skill ||
              skill.required_skill ||
              'Unknown skill';

            const resumeSkill =
              skill.resume_skill;

            const similarity =
              skill.similarity;

            return (
              <div
                key={`${requiredSkill}-${index}`}
                className="bg-black/20 rounded-xl p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-medium">
                    {requiredSkill}
                  </span>

                  {similarity !== undefined &&
                    similarity !== null && (
                      <span className="text-xs text-slate-500">
                        {(
                          Number(similarity) * 100
                        ).toFixed(0)}
                        %
                      </span>
                    )}
                </div>

                {resumeSkill && (
                  <p className="text-xs text-slate-500 mt-2">
                    Resume match:{' '}
                    <span className="text-slate-300">
                      {resumeSkill}
                    </span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ============================================================
// REQUIREMENT GROUP
// ============================================================

function RequirementGroup({
  title,
  items,
}) {
  const safeItems =
    normalizeArray(items);

  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-300 mb-3">
        {title}
      </h4>

      {safeItems.length ? (
        <div className="flex flex-wrap gap-2">
          {safeItems.map((item, index) => (
            <span
              key={`${String(item)}-${index}`}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-sm text-slate-300"
            >
              {displayValue(item) ||
                String(item)}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600">
          None identified.
        </p>
      )}
    </div>
  );
}


// ============================================================
// EDUCATION ITEM
// ============================================================

function EducationItem({
  education,
  index,
}) {
  if (typeof education === 'string') {
    return (
      <div
        className="rounded-xl bg-white/[0.02] border border-white/5 p-4"
      >
        <p className="text-sm text-slate-300 leading-6">
          {education}
        </p>
      </div>
    );
  }

  if (
    !education ||
    typeof education !== 'object'
  ) {
    return null;
  }

  const institution =
    education.institution ||
    education.school ||
    education.college ||
    '';

  const degree =
    education.degree ||
    education.qualification ||
    education.program ||
    '';

  const date =
    education.date ||
    education.duration ||
    education.year ||
    '';

  return (
    <div
      key={index}
      className="rounded-xl bg-white/[0.02] border border-white/5 p-4"
    >
      {institution && (
        <p className="font-medium text-slate-200">
          {institution}
        </p>
      )}

      {degree && (
        <p className="text-sm text-slate-400 mt-2">
          {degree}
        </p>
      )}

      {date && (
        <p className="text-xs text-slate-500 mt-2">
          {date}
        </p>
      )}
    </div>
  );
}


// ============================================================
// PROJECT ITEM
// ============================================================

function ProjectItem({
  project,
  index,
}) {
  if (typeof project === 'string') {
    return (
      <div
        key={index}
        className="rounded-xl bg-white/[0.02] border border-white/5 p-4"
      >
        <p className="text-sm text-slate-300 leading-6">
          {project}
        </p>
      </div>
    );
  }

  if (
    !project ||
    typeof project !== 'object'
  ) {
    return null;
  }

  const name =
    project.name ||
    project.title ||
    project.project_name ||
    'Project';

  const technologies =
    normalizeArray(
      project.technologies ||
      project.tech_stack ||
      project.skills
    );

  const date =
    project.date ||
    project.duration ||
    project.year ||
    '';

  const description =
    normalizeArray(
      project.description ||
      project.descriptions
    );

  return (
    <div
      key={index}
      className="rounded-xl bg-white/[0.02] border border-white/5 p-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

        <h4 className="font-medium text-slate-200">
          {name}
        </h4>

        {date && (
          <span className="text-xs text-slate-500 shrink-0">
            {date}
          </span>
        )}

      </div>


      {technologies.length > 0 && (

        <div className="flex flex-wrap gap-2 mt-3">

          {technologies.map(
            (technology, techIndex) => (

              <span
                key={`${String(technology)}-${techIndex}`}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/[0.06] border border-indigo-500/10 text-xs text-indigo-300"
              >
                {displayValue(technology) ||
                  String(technology)}
              </span>

            )
          )}

        </div>

      )}


      {description.length > 0 && (

        <div className="mt-4 space-y-2">

          {description.map(
            (item, descriptionIndex) => (

              <p
                key={descriptionIndex}
                className="text-sm text-slate-400 leading-6"
              >
                {displayValue(item) ||
                  String(item)}
              </p>

            )
          )}

        </div>

      )}

    </div>
  );
}


// ============================================================
// ACHIEVEMENT ITEM
// ============================================================

function AchievementItem({
  achievement,
  index,
}) {
  if (typeof achievement === 'string') {
    return (
      <div
        key={index}
        className="flex items-start gap-3"
      >
        <CheckCircle2
          size={17}
          className="text-emerald-400 mt-0.5 shrink-0"
        />

        <p className="text-sm text-slate-300 leading-6">
          {achievement}
        </p>
      </div>
    );
  }

  if (
    !achievement ||
    typeof achievement !== 'object'
  ) {
    return null;
  }

  const title =
    achievement.title ||
    achievement.name ||
    achievement.achievement ||
    '';

  const description =
    achievement.description ||
    achievement.details ||
    '';

  const value =
    achievement.value ||
    achievement.result ||
    '';

  return (
    <div
      key={index}
      className="rounded-xl bg-white/[0.02] border border-white/5 p-4"
    >
      <div className="flex items-start gap-3">

        <CheckCircle2
          size={17}
          className="text-emerald-400 mt-0.5 shrink-0"
        />

        <div className="min-w-0">

          {title && (
            <p className="font-medium text-slate-200">
              {title}
            </p>
          )}

          {description && (
            <p className="text-sm text-slate-400 mt-2 leading-6">
              {description}
            </p>
          )}

          {value && (
            <p className="text-sm text-emerald-400 mt-2">
              {value}
            </p>
          )}

        </div>

      </div>
    </div>
  );
}


// ============================================================
// SCORE BREAKDOWN
// ============================================================

function ScoreBreakdown({
  breakdown,
}) {
  if (!breakdown) {
    return null;
  }

  const technical =
    breakdown.technical || {};

  const tools =
    breakdown.tools_and_frameworks || {};

  return (
    <div className="mt-6 bg-[#141416] border border-white/10 rounded-3xl p-7">

      <div className="flex items-start gap-4">

        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
          <Info
            size={19}
            className="text-indigo-400"
          />
        </div>

        <div>
          <h3 className="font-semibold text-lg">
            How your score is calculated
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Your compatibility score uses semantic skill matching
            and gives more importance to technical requirements.
          </p>
        </div>

      </div>


      <div className="grid md:grid-cols-2 gap-5 mt-7">

        <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/[0.04] p-5">

          <div className="flex items-center justify-between">

            <div>
              <h4 className="font-semibold">
                Technical Skills
              </h4>

              <p className="text-xs text-slate-500 mt-1">
                Higher importance
              </p>
            </div>

            <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium">
              Weight {technical.weight ?? 1.25}
            </span>

          </div>


          <div className="grid grid-cols-3 gap-3 mt-5">

            <div className="rounded-xl bg-emerald-500/[0.06] border border-emerald-500/10 p-3">
              <div className="text-lg font-bold text-emerald-400">
                {technical.matched ?? 0}
              </div>

              <div className="text-xs text-slate-500 mt-1">
                Matched
              </div>
            </div>


            <div className="rounded-xl bg-amber-500/[0.06] border border-amber-500/10 p-3">
              <div className="text-lg font-bold text-amber-400">
                {technical.partial ?? 0}
              </div>

              <div className="text-xs text-slate-500 mt-1">
                Partial
              </div>
            </div>


            <div className="rounded-xl bg-rose-500/[0.06] border border-rose-500/10 p-3">
              <div className="text-lg font-bold text-rose-400">
                {technical.missing ?? 0}
              </div>

              <div className="text-xs text-slate-500 mt-1">
                Missing
              </div>
            </div>

          </div>

        </div>


        <div className="rounded-2xl border border-violet-500/15 bg-violet-500/[0.04] p-5">

          <div className="flex items-center justify-between">

            <div>
              <h4 className="font-semibold">
                Tools & Frameworks
              </h4>

              <p className="text-xs text-slate-500 mt-1">
                High importance
              </p>
            </div>

            <span className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 text-xs font-medium">
              Weight {tools.weight ?? 1.15}
            </span>

          </div>


          <div className="grid grid-cols-3 gap-3 mt-5">

            <div className="rounded-xl bg-emerald-500/[0.06] border border-emerald-500/10 p-3">
              <div className="text-lg font-bold text-emerald-400">
                {tools.matched ?? 0}
              </div>

              <div className="text-xs text-slate-500 mt-1">
                Matched
              </div>
            </div>


            <div className="rounded-xl bg-amber-500/[0.06] border border-amber-500/10 p-3">
              <div className="text-lg font-bold text-amber-400">
                {tools.partial ?? 0}
              </div>

              <div className="text-xs text-slate-500 mt-1">
                Partial
              </div>
            </div>


            <div className="rounded-xl bg-rose-500/[0.06] border border-rose-500/10 p-3">
              <div className="text-lg font-bold text-rose-400">
                {tools.missing ?? 0}
              </div>

              <div className="text-xs text-slate-500 mt-1">
                Missing
              </div>
            </div>

          </div>

        </div>

      </div>


      <div className="mt-6 pt-5 border-t border-white/10">

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs">

          <div className="flex items-center gap-2">
            <CheckCircle2
              size={15}
              className="text-emerald-400"
            />

            <span className="text-slate-400">
              MATCH = 100%
            </span>
          </div>


          <div className="flex items-center gap-2">
            <Zap
              size={15}
              className="text-amber-400"
            />

            <span className="text-slate-400">
              PARTIAL = 50%
            </span>
          </div>


          <div className="flex items-center gap-2">
            <AlertCircle
              size={15}
              className="text-rose-400"
            />

            <span className="text-slate-400">
              MISSING = 0%
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}


// ============================================================
// PRIORITY SKILLS
// ============================================================

function PrioritySkills({
  skills,
}) {
  if (!skills || skills.length === 0) {
    return (
      <div className="mt-6 bg-[#141416] border border-white/10 rounded-3xl p-7">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2
              size={19}
              className="text-emerald-400"
            />
          </div>

          <div>
            <h3 className="font-semibold">
              Priority Skills
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              No immediate skill gaps were identified.
            </p>
          </div>

        </div>

      </div>
    );
  }


  const sortedSkills = [...skills].sort(
    (a, b) => {

      const priorityOrder = {
        HIGH: 1,
        MEDIUM: 2,
        LOW: 3,
      };

      return (
        (priorityOrder[
          a.priority
        ] || 4) -
        (priorityOrder[
          b.priority
        ] || 4)
      );
    }
  );


  return (
    <div className="mt-6 bg-[#141416] border border-white/10 rounded-3xl p-7">

      <div className="flex items-start gap-4">

        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
          <Flame
            size={19}
            className="text-orange-400"
          />
        </div>

        <div>
          <h3 className="font-semibold text-lg">
            Priority Skills
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Skills that should receive attention first based on
            job relevance and your current match status.
          </p>
        </div>

      </div>


      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-7">

        {sortedSkills.map(
          (skill, index) => {

            const priority =
              skill.priority || 'MEDIUM';

            const priorityStyles = {

              HIGH: {
                container:
                  'border-rose-500/20 bg-rose-500/[0.04]',

                badge:
                  'bg-rose-500/10 text-rose-400',

                icon:
                  'text-rose-400',

                label:
                  'High Priority',
              },

              MEDIUM: {
                container:
                  'border-amber-500/20 bg-amber-500/[0.04]',

                badge:
                  'bg-amber-500/10 text-amber-400',

                icon:
                  'text-amber-400',

                label:
                  'Medium Priority',
              },

              LOW: {
                container:
                  'border-slate-500/20 bg-white/[0.02]',

                badge:
                  'bg-slate-500/10 text-slate-400',

                icon:
                  'text-slate-400',

                label:
                  'Low Priority',
              },
            };

            const style =
              priorityStyles[
                priority
              ] ||
              priorityStyles.MEDIUM;


            return (
              <motion.div
                key={`${skill.job_skill}-${index}`}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.04,
                }}
                className={`rounded-2xl border p-5 ${style.container}`}
              >

                <div className="flex items-center justify-between gap-3">

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${style.badge}`}
                  >
                    {style.label}
                  </span>

                  <span className="text-xs text-slate-600">
                    #{index + 1}
                  </span>

                </div>


                <h4 className="font-semibold mt-4">
                  {skill.job_skill}
                </h4>


                <div className="mt-3 space-y-2">

                  <div className="flex items-center justify-between text-xs">

                    <span className="text-slate-500">
                      Status
                    </span>

                    <span className="text-slate-300">
                      {skill.status}
                    </span>

                  </div>


                  {skill.resume_skill && (

                    <div className="flex items-center justify-between gap-4 text-xs">

                      <span className="text-slate-500">
                        Resume evidence
                      </span>

                      <span className="text-slate-300 text-right">
                        {skill.resume_skill}
                      </span>

                    </div>

                  )}


                  {skill.similarity !== undefined &&
                    skill.similarity !== null && (

                      <div className="flex items-center justify-between text-xs">

                        <span className="text-slate-500">
                          Similarity
                        </span>

                        <span className={style.icon}>
                          {(
                            Number(
                              skill.similarity
                            ) * 100
                          ).toFixed(0)}
                          %
                        </span>

                      </div>

                    )}

                </div>

              </motion.div>
            );
          }
        )}

      </div>

    </div>
  );
}


// ============================================================
// DASHBOARD
// ============================================================

function Dashboard({
  data,
  onNewAnalysis,
}) {
  if (!data) {
    return null;
  }


  const resume =
    data.resume || {};

  const jobRequirements =
    data.job_requirements || {};

  const skillGap =
    data.skill_gap || {};

  const advisor =
    data.career_advisor || {};

  const matchScore =
    Number(
      data.match_score || 0
    );

  const matchedSkills =
    skillGap.matched_skills || [];

  const partialSkills =
    skillGap.partial_skills || [];

  const missingSkills =
    skillGap.missing_skills || [];

  const prioritySkills =
    skillGap.priority_skills || [];

  const scoreBreakdown =
    skillGap.score_breakdown || null;


  const skills =
    normalizeArray(
      resume.skills
    );

  const projects =
    normalizeArray(
      resume.projects
    );

  const achievements =
    normalizeArray(
      resume.achievements
    );

  const education =
    normalizeArray(
      resume.education
    );


  const candidateName =
    resume.name ||
    resume.candidate_name ||
    'Candidate';


  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-24 pb-20 px-6">

      <div className="max-w-7xl mx-auto">

        {/* ================================================= */}
        {/* OVERVIEW */}
        {/* ================================================= */}

        <section
          id="overview"
          className="scroll-mt-24"
        >

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

            <div>

              <p className="text-sm uppercase tracking-widest text-indigo-400 font-medium">
                Career Intelligence
              </p>

              <h1 className="text-4xl md:text-5xl font-bold mt-3">
                Your Career Analysis
              </h1>

              <p className="text-slate-400 mt-3">
                Resume analysis and personalized career insights.
              </p>

            </div>


            <button
              onClick={onNewAnalysis}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all"
            >
              <RotateCcw size={17} />
              New Analysis
            </button>

          </div>


          {/* SCORE + METRICS */}

          <div className="grid lg:grid-cols-4 gap-5">

            <div className="lg:col-span-1 bg-[#141416] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px]">

              <div className="relative w-44 h-44 flex items-center justify-center">

                <svg
                  className="absolute inset-0 w-full h-full -rotate-90"
                  viewBox="0 0 100 100"
                >

                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="7"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset={
                      251.2 -
                      (
                        251.2 *
                        Math.min(
                          matchScore,
                          100
                        )
                      ) /
                        100
                    }
                  />

                </svg>


                <div className="text-center">

                  <div className="text-4xl font-bold">
                    {matchScore.toFixed(2)}%
                  </div>

                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                    Match Score
                  </div>

                </div>

              </div>


              <p className="text-xs text-slate-500 text-center mt-6 max-w-xs">
                Based on semantic matching between your resume and the target role.
              </p>

            </div>


            <MetricCard
              icon={CheckCircle2}
              value={matchedSkills.length}
              label="Matched Skills"
              type="matched"
            />

            <MetricCard
              icon={Zap}
              value={partialSkills.length}
              label="Partial Matches"
              type="partial"
            />

            <MetricCard
              icon={AlertCircle}
              value={missingSkills.length}
              label="Missing Skills"
              type="missing"
            />

          </div>


          {/* SCORE BREAKDOWN */}

          <ScoreBreakdown
            breakdown={scoreBreakdown}
          />


          {/* PRIORITY SKILLS */}

          <PrioritySkills
            skills={prioritySkills}
          />


          {/* AI SUMMARY */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
            }}
            className="mt-6 bg-[#141416] border border-white/10 rounded-3xl p-7"
          >

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">

                <Sparkles
                  size={19}
                  className="text-indigo-400"
                />

              </div>

              <div>

                <p className="text-sm uppercase tracking-wider text-indigo-400">
                  AI Summary
                </p>

              </div>

            </div>


            <p className="text-slate-300 leading-7">
              {advisor.summary ||
                'No AI summary was generated.'}
            </p>

          </motion.div>

        </section>


        {/* ================================================= */}
        {/* RESUME INSIGHTS */}
        {/* ================================================= */}

        <section
          className="mt-8 scroll-mt-24"
        >

          <div className="bg-[#141416] border border-white/10 rounded-3xl p-7">

            <div className="flex items-center gap-3 mb-7">

              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">

                <User
                  size={19}
                  className="text-indigo-400"
                />

              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  Resume Insights
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Information extracted from your resume.
                </p>

              </div>

            </div>


            <div className="grid md:grid-cols-2 gap-5">

              {/* =========================================== */}
              {/* CANDIDATE */}
              {/* =========================================== */}

              <InfoCard
                icon={User}
                title="Candidate"
              >

                <p className="text-slate-300">
                  {candidateName}
                </p>

              </InfoCard>


              {/* =========================================== */}
              {/* EDUCATION */}
              {/* =========================================== */}

              <InfoCard
                icon={GraduationCap}
                title="Education"
              >

                {education.length ? (

                  <div className="space-y-3">

                    {education.map(
                      (item, index) => (
                        <EducationItem
                          key={index}
                          education={item}
                          index={index}
                        />
                      )
                    )}

                  </div>

                ) : (

                  <p className="text-sm text-slate-600">
                    No education details identified.
                  </p>

                )}

              </InfoCard>


              {/* =========================================== */}
              {/* SKILLS */}
              {/* =========================================== */}

              <InfoCard
                icon={Code2}
                title="Skills"
              >

                {skills.length ? (

                  <div className="flex flex-wrap gap-2">

                    {skills.map(
                      (skill, index) => (

                        <span
                          key={`${String(skill)}-${index}`}
                          className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-sm text-slate-300"
                        >
                          {displayValue(skill) ||
                            String(skill)}
                        </span>

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-sm text-slate-600">
                    No skills identified.
                  </p>

                )}

              </InfoCard>


              {/* =========================================== */}
              {/* PROJECTS */}
              {/* =========================================== */}

              <InfoCard
                icon={FolderGit2}
                title="Projects"
              >

                {projects.length ? (

                  <div className="space-y-3">

                    {projects.map(
                      (project, index) => (

                        <ProjectItem
                          key={index}
                          project={project}
                          index={index}
                        />

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-sm text-slate-600">
                    No projects identified.
                  </p>

                )}

              </InfoCard>


              {/* =========================================== */}
              {/* ACHIEVEMENTS */}
              {/* =========================================== */}

              <InfoCard
                icon={Award}
                title="Achievements"
              >

                {achievements.length ? (

                  <div className="space-y-3">

                    {achievements.map(
                      (achievement, index) => (

                        <AchievementItem
                          key={index}
                          achievement={achievement}
                          index={index}
                        />

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-sm text-slate-600">
                    No achievements identified.
                  </p>

                )}

              </InfoCard>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* SKILL GAP */}
        {/* ================================================= */}

        <section
          id="skill-gap"
          className="mt-8 scroll-mt-24"
        >

          <div className="mb-6">

            <p className="text-sm uppercase tracking-widest text-indigo-400 font-medium">
              Skill Analysis
            </p>

            <h2 className="text-3xl font-bold mt-2">
              Where you stand
            </h2>

            <p className="text-slate-500 mt-2">
              Compare your current skills with the requirements of the target role.
            </p>

          </div>


          <div className="grid lg:grid-cols-3 gap-5">

            <SkillSection
              title="Matched Skills"
              skills={matchedSkills}
              type="matched"
              icon={CheckCircle2}
            />

            <SkillSection
              title="Partial Matches"
              skills={partialSkills}
              type="partial"
              icon={Zap}
            />

            <SkillSection
              title="Missing Skills"
              skills={missingSkills}
              type="missing"
              icon={AlertCircle}
            />

          </div>

        </section>


        {/* ================================================= */}
        {/* TARGET ROLE REQUIREMENTS */}
        {/* ================================================= */}

        <section className="mt-8">

          <div className="bg-[#141416] border border-white/10 rounded-3xl p-7">

            <div className="flex items-center gap-3 mb-8">

              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">

                <Briefcase
                  size={19}
                  className="text-violet-400"
                />

              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  Target Role Requirements
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Requirements extracted from the job description.
                </p>

              </div>

            </div>


            <div className="grid md:grid-cols-2 gap-8">

              <RequirementGroup
                title="Technical Skills"
                items={
                  jobRequirements.technical_skills
                }
              />

              <RequirementGroup
                title="Tools & Frameworks"
                items={
                  jobRequirements.tools_and_frameworks
                }
              />

              <RequirementGroup
                title="Soft Skills"
                items={
                  jobRequirements.soft_skills
                }
              />

              <RequirementGroup
                title="Other Requirements"
                items={
                  jobRequirements.other_requirements
                }
              />

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* ROADMAP */}
        {/* ================================================= */}

        <section
          id="roadmap"
          className="mt-8 scroll-mt-24"
        >

          <div className="mb-6">

            <p className="text-sm uppercase tracking-widest text-indigo-400 font-medium">
              Personalized Roadmap
            </p>

            <h2 className="text-3xl font-bold mt-2">
              Your path forward
            </h2>

            <p className="text-slate-500 mt-2">
              A practical learning plan generated from your skill gaps.
            </p>

          </div>


          {advisor.recommended_project && (

            <div className="bg-indigo-500/[0.06] border border-indigo-500/20 rounded-3xl p-7 mb-6">

              <div className="flex items-center gap-3 mb-4">

                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">

                  <Target
                    size={19}
                    className="text-indigo-400"
                  />

                </div>

                <h3 className="font-semibold">
                  Recommended Project
                </h3>

              </div>

              <p className="text-slate-300 leading-7">
                {advisor.recommended_project}
              </p>

            </div>

          )}


          <div className="space-y-5">

            {(advisor.learning_roadmap || []).map(
              (phase, index) => (

                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.05,
                  }}
                  className="bg-[#141416] border border-white/10 rounded-3xl p-7"
                >

                  <div className="flex flex-col md:flex-row md:items-start gap-5">

                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">
                      {index + 1}
                    </div>

                    <div className="flex-1">

                      <div className="flex flex-col md:flex-row md:items-center gap-2">

                        <h3 className="text-lg font-semibold">
                          {phase.phase ||
                            `Phase ${index + 1}`}
                        </h3>

                        {phase.duration && (

                          <span className="md:ml-auto text-xs px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-400">
                            {phase.duration}
                          </span>

                        )}

                      </div>


                      {phase.topics?.length > 0 && (

                        <div className="flex flex-wrap gap-2 mt-4">

                          {phase.topics.map(
                            (topic, topicIndex) => (

                              <span
                                key={topicIndex}
                                className="px-3 py-1.5 rounded-lg bg-indigo-500/[0.06] border border-indigo-500/10 text-sm text-slate-300"
                              >
                                {topic}
                              </span>

                            )
                          )}

                        </div>

                      )}


                      {phase.goal && (

                        <p className="text-sm text-slate-500 mt-5 leading-6">

                          <span className="text-slate-300 font-medium">
                            Goal:
                          </span>{' '}

                          {phase.goal}

                        </p>

                      )}

                    </div>

                  </div>

                </motion.div>

              )
            )}

          </div>


          {advisor.next_steps?.length > 0 && (

            <div className="bg-[#141416] border border-white/10 rounded-3xl p-7 mt-6">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">

                  <ArrowRight
                    size={19}
                    className="text-emerald-400"
                  />

                </div>

                <h3 className="font-semibold">
                  Next Steps
                </h3>

              </div>


              <div className="space-y-3">

                {advisor.next_steps.map(
                  (step, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >

                      <CheckCircle2
                        size={18}
                        className="text-emerald-400 mt-0.5 shrink-0"
                      />

                      <p className="text-sm text-slate-300 leading-6">
                        {step}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </section>

      </div>

    </div>
  );
}


export default Dashboard;
