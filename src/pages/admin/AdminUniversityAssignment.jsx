import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AdminUniversityAssignment = () => {
  const { challenges, universities, assignChallengeToUniversity, selectedChallengeId, setSelectedChallengeId, navigate } = useApp();

  const [activeChallengeId, setActiveChallengeId] = useState(selectedChallengeId || 'JH-2026-CHAL-8921');
  const [selectedUnivId, setSelectedUnivId] = useState('univ-bit-mesra');
  const [grantAmount, setGrantAmount] = useState(450000);
  const [facultyGuide, setFacultyGuide] = useState('Dr. Anirban Mukherjee (Dept. of Chemical Engineering)');
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  const currentChallenge = challenges.find(c => c.id === activeChallengeId) || challenges[0];
  const selectedUniv = universities.find(u => u.id === selectedUnivId) || universities[0];

  const handleAssign = (e) => {
    e.preventDefault();
    assignChallengeToUniversity(
      currentChallenge.id,
      selectedUniv.name.split('(')[0].trim(),
      grantAmount,
      facultyGuide
    );
    setAssignedSuccess(true);
    setTimeout(() => {
      setAssignedSuccess(false);
      navigate('/university/dashboard');
    }, 2500);
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Academic Allocation Hub</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">
            Assign Challenge to Academic Labs
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Match vetted civic problems with specialized research institutions and issue State Innovation Grants.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 bg-surface border border-outline-variant hover:bg-surface-container-high rounded-xl text-xs font-bold text-on-surface flex items-center gap-1 cursor-pointer w-fit"
        >
          <span className="material-symbols-outlined text-[16px]">dashboard</span>
          <span>Admin Dashboard</span>
        </button>
      </div>

      {assignedSuccess && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-3 animate-in fade-in">
          <span className="material-symbols-outlined text-2xl text-emerald-700">verified</span>
          <div>
            <h4 className="text-xs font-bold">Assignment Dispatched Successfully!</h4>
            <p className="text-[11px]">
              State Innovation Grant of ₹{(grantAmount / 100000).toFixed(1)} Lakhs allocated to {selectedUniv.name}. Redirecting to University Dashboard...
            </p>
          </div>
        </div>
      )}

      {/* Grid: Target Problem Card & University Selection / Grant Slider */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 5 Cols: Selected Civic Challenge Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-xs space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1.5">
                Select Civic Problem Statement
              </label>
              <select
                value={activeChallengeId}
                onChange={(e) => {
                  setActiveChallengeId(e.target.value);
                  setSelectedChallengeId(e.target.value);
                }}
                className="w-full px-3 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none"
              >
                {challenges.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.district}: {c.title.substring(0, 35)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary">{currentChallenge.id}</span>
                <span className="text-[11px] font-bold text-on-surface bg-surface px-2 py-0.5 rounded border border-outline-variant">
                  {currentChallenge.category}
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface leading-snug">{currentChallenge.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-4">
                {currentChallenge.description}
              </p>
              <div className="text-[11px] text-on-surface-variant pt-2 border-t border-outline-variant/50 flex justify-between">
                <span>Location: {currentChallenge.district} ({currentChallenge.block})</span>
                <span>Severity: {currentChallenge.severity}</span>
              </div>
            </div>

            <div className="p-4 bg-primary-fixed/30 border border-primary-fixed-dim rounded-2xl text-xs space-y-1">
              <span className="font-bold text-on-primary-fixed block">AI Lab Recommendation</span>
              <p className="text-on-primary-fixed-variant leading-relaxed">
                Chemical &amp; Bio-Engineering department at <strong>BIT Mesra</strong> or Water Resources at <strong>IIT ISM Dhanbad</strong> have 96%+ historical success in regional water purification.
              </p>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: University Match Roster & Grant Slider */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Universities Matching Cards */}
          <div>
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-3">
              Matched Academic Research Institutions
            </label>

            <div className="space-y-2.5">
              {universities.map(u => {
                const isSelected = selectedUnivId === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUnivId(u.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-primary bg-primary-fixed/20 shadow-xs ring-1 ring-primary'
                        : 'border-outline-variant/70 hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name[0]}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-on-surface">{u.name}</h4>
                        <p className="text-[11px] text-on-surface-variant">{u.location} • {u.focalAreas.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald-700 block">★ {u.performanceRating}</span>
                      <span className="text-[10px] text-on-surface-variant font-medium">{u.activeProjects} active projects</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grant Allocation Slider */}
          <div className="p-4 bg-surface rounded-2xl border border-outline-variant space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                State Innovation Grant Allocation
              </label>
              <span className="text-base font-mono font-extrabold text-primary">
                ₹{(grantAmount / 100000).toFixed(2)} Lakhs
              </span>
            </div>

            <input
              type="range"
              min={100000}
              max={1500000}
              step={50000}
              value={grantAmount}
              onChange={(e) => setGrantAmount(Number(e.target.value))}
              className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
            />

            <div className="flex justify-between text-[10px] text-on-surface-variant font-semibold">
              <span>₹1.0L (Micro-Grant)</span>
              <span>₹5.0L (Standard Prototype)</span>
              <span>₹15.0L (Major Pilot)</span>
            </div>
          </div>

          {/* Faculty Guide Input */}
          <div>
            <label className="text-xs font-bold text-on-surface block mb-1.5">
              Assigned Faculty Research Guide / PI
            </label>
            <input
              type="text"
              value={facultyGuide}
              onChange={(e) => setFacultyGuide(e.target.value)}
              placeholder="e.g. Dr. Anirban Mukherjee (Dept of Chemical Engineering)"
              className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleAssign}
            className="w-full py-3 bg-primary text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-primary-container shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>Dispatch Assignment Order to {selectedUniv.name.split('(')[0]}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
