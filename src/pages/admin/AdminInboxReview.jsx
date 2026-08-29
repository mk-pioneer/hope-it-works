import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminInboxReview = () => {
  const { challenges, selectedChallengeId, setSelectedChallengeId, navigate } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedChallenge, setSelectedChallenge] = useState(() => {
    return challenges.find(c => c.id === selectedChallengeId) || challenges[0];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const filteredChallenges = challenges.filter(c => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Under Review') return c.status === 'Under Review' || c.status === 'Submitted';
    if (filterStatus === 'Duplicates') return c.duplicatesDetected > 0;
    if (filterStatus === 'Assigned') return c.status === 'Assigned' || c.status === 'Prototyping';
    return c.status === filterStatus;
  });

  const handleSelectChallenge = (c) => {
    setSelectedChallenge(c);
    setSelectedChallengeId(c.id);
    setIsDrawerOpen(true);
  };

  const handleApprove = () => {
    setSelectedChallengeId(selectedChallenge.id);
    navigate('/admin/assign');
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-97px)] overflow-hidden">
      {/* Top Bar with Filters */}
      <div className="p-4 md:px-8 bg-surface-container-lowest border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Triage &amp; Evaluation Hub</span>
          <h1 className="text-xl font-extrabold text-on-surface">Problem Review Queue</h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Under Review', 'Duplicates', 'Assigned'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filterStatus === tab
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Container */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Table / Queue */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
          {filteredChallenges.map(c => {
            const isSelected = selectedChallenge?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => handleSelectChallenge(c)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-primary bg-primary-fixed/20 shadow-xs ring-1 ring-primary'
                    : 'border-outline-variant/70 bg-surface-container-lowest hover:bg-surface-container-low hover:border-outline-variant'
                }`}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary">{c.id}</span>
                    <span className="text-[11px] text-on-surface-variant font-semibold">• {c.district} ({c.block})</span>
                    {c.duplicatesDetected > 0 && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">psychology</span>
                        {c.duplicatesDetected} AI Duplicates
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-on-surface line-clamp-1">{c.title}</h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2">{c.description}</p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <StatusBadge status={c.status} size="sm" />
                  <span className="text-[11px] text-on-surface-variant font-medium">
                    {c.submittedAt}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Slide-over Evaluation Drawer */}
        {selectedChallenge && isDrawerOpen && (
          <div className="w-full sm:w-[480px] lg:w-[520px] bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col h-full z-30 shrink-0 animate-in slide-in-from-right-4 duration-200">
            {/* Drawer Header */}
            <div className="p-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-primary bg-surface px-2.5 py-1 rounded-lg border border-outline-variant">
                  {selectedChallenge.id}
                </span>
                <StatusBadge status={selectedChallenge.status} size="sm" />
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {/* Problem Title & Text */}
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant">Problem Title</span>
                <h3 className="text-base font-bold text-on-surface mt-0.5">{selectedChallenge.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-2 bg-surface p-3 rounded-xl border border-outline-variant/60">
                  {selectedChallenge.description}
                </p>
              </div>

              {/* Submitter & Geography */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-surface-container-low rounded-2xl border border-outline-variant/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Submitter</span>
                  <span className="font-bold text-on-surface">{selectedChallenge.submittedBy}</span>
                  <span className="text-[11px] text-on-surface-variant block">{selectedChallenge.submittedPhone}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Location</span>
                  <span className="font-bold text-on-surface">{selectedChallenge.village || "Panchayat"}</span>
                  <span className="text-[11px] text-on-surface-variant block">{selectedChallenge.block}, {selectedChallenge.district}</span>
                </div>
              </div>

              {/* AI Triage Matrix */}
              <div className="p-4 bg-primary-fixed/30 border border-primary-fixed-dim rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 text-primary font-bold">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                  <span className="text-xs uppercase tracking-wider">AI Intelligence Assessment</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="bg-surface-container-lowest p-2 rounded-xl">
                    <span className="text-[10px] text-on-surface-variant block">Category</span>
                    <strong className="text-primary font-bold block">{selectedChallenge.category.split(' ')[0]}</strong>
                    <span className="text-[9px] text-emerald-700">98% Fit</span>
                  </div>
                  <div className="bg-surface-container-lowest p-2 rounded-xl">
                    <span className="text-[10px] text-on-surface-variant block">Severity</span>
                    <strong className="text-red-700 font-bold block">{selectedChallenge.aiSeverityScore || 90}/100</strong>
                    <span className="text-[9px] text-on-surface-variant">High Impact</span>
                  </div>
                  <div className="bg-surface-container-lowest p-2 rounded-xl">
                    <span className="text-[10px] text-on-surface-variant block">Duplication</span>
                    <strong className="text-amber-700 font-bold block">{selectedChallenge.duplicatesDetected} Reports</strong>
                    <span className="text-[9px] text-amber-700">Clustered</span>
                  </div>
                </div>
              </div>

              {/* Citizen Attachments */}
              {selectedChallenge.attachments && selectedChallenge.attachments.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1.5">
                    Field Evidence Attachments ({selectedChallenge.attachments.length})
                  </span>
                  <div className="space-y-1.5">
                    {selectedChallenge.attachments.map((att, i) => (
                      <div key={i} className="p-2.5 bg-surface rounded-xl border border-outline-variant flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[18px]">
                            {att.type === 'pdf' ? 'picture_as_pdf' : 'image'}
                          </span>
                          <span className="font-semibold text-on-surface">{att.name}</span>
                        </div>
                        <span className="text-[11px] text-primary font-bold hover:underline cursor-pointer">
                          Inspect
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Action Controls Footer */}
            <div className="p-4 bg-surface-container-low border-t border-outline-variant space-y-2 shrink-0">
              <button
                onClick={handleApprove}
                className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-container shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                <span>Approve &amp; Assign to Academic Lab</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate('/admin/ai-notifications')}
                  className="py-2 bg-amber-500/15 text-amber-900 border border-amber-500/30 hover:bg-amber-500/25 rounded-xl font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">merge</span>
                  <span>Duplicate Merge</span>
                </button>

                <button
                  onClick={() => alert(`Clarification SMS dispatched to citizen at ${selectedChallenge.submittedPhone}`)}
                  className="py-2 bg-surface border border-outline-variant hover:bg-surface-container-high rounded-xl font-bold text-xs text-on-surface flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">sms</span>
                  <span>Request Info</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
