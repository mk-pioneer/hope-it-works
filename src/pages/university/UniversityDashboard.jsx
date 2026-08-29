import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const UniversityDashboard = () => {
  const { challenges, universities, navigate, setSelectedChallengeId } = useApp();
  const [selectedUniv, setSelectedUniv] = useState(universities[0]);

  const activeProjects = challenges.filter(c => c.assignedUniversity && c.status !== 'Completed');
  const pendingAcceptance = challenges.filter(c => c.status === 'Assigned' && (!c.milestones || c.milestones.length === 0));

  const totalGrants = challenges
    .filter(c => c.assignedUniversity)
    .reduce((acc, c) => acc + (c.grantAllocated || 0), 0);

  return (
    <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              University Innovation Cell
            </span>
            <span className="text-xs text-on-surface-variant font-semibold">Institutional R&amp;D Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1.5">
            {selectedUniv.name}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Managing state-allocated civic challenges, student innovator teams, and milestone deliverables.
          </p>
        </div>

        {/* University Switcher for Demo */}
        <div className="flex items-center gap-2">
          <select
            value={selectedUniv.id}
            onChange={(e) => {
              const u = universities.find(x => x.id === e.target.value);
              if (u) setSelectedUniv(u);
            }}
            className="px-3 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none"
          >
            {universities.map(u => (
              <option key={u.id} value={u.id}>{u.name.split('(')[0]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Bento KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active R&amp;D Projects</span>
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl material-symbols-outlined text-lg">biotech</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-on-surface">{selectedUniv.activeProjects}</h3>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
              +2 assigned this semester
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Grants Disbursed</span>
            <span className="p-2 bg-purple-100 text-purple-800 rounded-xl material-symbols-outlined text-lg">payments</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-purple-700">₹{(selectedUniv.grantsReceived / 100000).toFixed(1)}L</h3>
            <span className="text-[11px] text-on-surface-variant font-medium mt-1 block">
              State Innovation Fund &amp; CSR
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Student Innovators</span>
            <span className="p-2 bg-blue-100 text-blue-800 rounded-xl material-symbols-outlined text-lg">groups</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-blue-700">{selectedUniv.studentInnovators}</h3>
            <span className="text-[11px] text-blue-800 font-semibold mt-1 block">
              Across B.Tech, M.Tech &amp; Ph.D.
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Completed Pilots</span>
            <span className="p-2 bg-teal-100 text-teal-800 rounded-xl material-symbols-outlined text-lg">verified</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-teal-700">{selectedUniv.completedPilots}</h3>
            <span className="text-[11px] text-teal-800 font-semibold mt-1 block">
              ★ {selectedUniv.performanceRating} institutional rating
            </span>
          </div>
        </div>
      </div>

      {/* Active University Projects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-on-surface">Assigned Innovation Projects</h2>
            <p className="text-xs text-on-surface-variant">Live civic challenges being engineered into deployable prototypes.</p>
          </div>

          <button
            onClick={() => navigate('/citizen/submit')}
            className="px-3 py-1.5 bg-surface border border-outline-variant hover:bg-surface-container-high rounded-xl text-xs font-bold text-on-surface flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Register Faculty Proposal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeProjects.map(c => {
            const completedCount = c.milestones?.filter(m => m.status === 'completed').length || 0;
            const totalCount = c.milestones?.length || 4;
            const progressPercent = Math.round((completedCount / totalCount) * 100);

            return (
              <div
                key={c.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold text-primary">{c.id}</span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>

                  <h3 className="text-base font-bold text-on-surface line-clamp-2 mb-2">
                    {c.title}
                  </h3>

                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                    {c.description}
                  </p>

                  {/* Faculty & Student Team Info */}
                  <div className="p-3 bg-surface-container-low rounded-xl text-xs space-y-1 mb-4">
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span>Principal Investigator:</span>
                      <strong className="text-on-surface">{c.assignedFaculty || "Dr. A. Mukherjee"}</strong>
                    </div>
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span>Research Team:</span>
                      <strong className="text-primary">{c.studentTeam || "Innovation Cohort"}</strong>
                    </div>
                  </div>

                  {/* Milestone Progress Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs font-semibold text-on-surface">
                      <span>Milestone Progress ({completedCount}/{totalCount})</span>
                      <span className="text-primary font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Grant Budget</span>
                    <span className="font-bold text-emerald-700">₹{((c.grantAllocated || 450000) / 100000).toFixed(1)}L</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedChallengeId(c.id);
                      navigate(`/university/workspace/${c.id}`);
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">launch</span>
                    <span>Open Workspace</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
