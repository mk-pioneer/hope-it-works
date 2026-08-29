import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AdminAINotifications = () => {
  const { challenges, notifications, mergeDuplicates, navigate, setSelectedChallengeId } = useApp();
  const [selectedCluster, setSelectedCluster] = useState('JH-2026-CHAL-8921');
  const [mergedSuccess, setMergedSuccess] = useState(false);

  const primaryChallenge = challenges.find(c => c.id === selectedCluster) || challenges[0];

  const duplicateReports = [
    {
      id: "JH-2026-DUP-104",
      submitter: "Manoj Singh (Mukhiya)",
      phone: "+91 94311 88120",
      location: "Gomia, Bokaro",
      title: "Yellow water and teeth staining in 3 wards",
      submittedAt: "2026-08-14",
      similarityScore: 94
    },
    {
      id: "JH-2026-DUP-109",
      submitter: "Anita Devi (Asha Worker)",
      phone: "+91 87891 00213",
      location: "Chas Ward 4, Bokaro",
      title: "Children complaining of knee joint pain from well water",
      submittedAt: "2026-08-15",
      similarityScore: 91
    },
    {
      id: "JH-2026-DUP-115",
      submitter: "Panchayat Samiti Chas",
      phone: "+91 98350 44109",
      location: "Petarwar-Bokaro",
      title: "Excess fluoride in government hand-pumps",
      submittedAt: "2026-08-19",
      similarityScore: 97
    }
  ];

  const handleMergeAction = () => {
    mergeDuplicates(primaryChallenge.id, duplicateReports.map(d => d.id));
    setMergedSuccess(true);
    setTimeout(() => setMergedSuccess(false), 4000);
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            AI Automated Intelligence &amp; Dispatch
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1.5">
            AI Duplicate Detection &amp; Smart Alerts
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Natural language semantic similarity model clusters regional problem reports to optimize grant deployment.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/inbox')}
          className="px-4 py-2 bg-surface border border-outline-variant hover:bg-surface-container-high rounded-xl text-xs font-bold text-on-surface flex items-center gap-1 cursor-pointer w-fit"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Problem Inbox</span>
        </button>
      </div>

      {mergedSuccess && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700">check_circle</span>
            <span className="text-xs font-bold">Successfully merged 3 duplicate submissions into {primaryChallenge.id}! Priority weight boosted.</span>
          </div>
        </div>
      )}

      {/* Grid: Active AI Alerts List & Side-by-Side Diff Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: AI Notifications Stream */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">AI Intelligence Feed</h3>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => notif.challengeId && setSelectedCluster(notif.challengeId)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedCluster === notif.challengeId
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-1 ring-amber-500'
                    : 'border-outline-variant/70 bg-surface-container-lowest hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    notif.type === 'duplicate_cluster' ? 'bg-amber-100 text-amber-800' :
                    notif.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {notif.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">{notif.timestamp}</span>
                </div>
                <h4 className="text-xs font-bold text-on-surface">{notif.title}</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed mt-1">
                  {notif.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Duplicate Comparison & Merge Cockpit */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Target Cluster Inspection</span>
              <h3 className="text-base font-bold text-on-surface">{primaryChallenge.title}</h3>
              <span className="text-xs font-mono text-primary font-bold">{primaryChallenge.id} • {primaryChallenge.district}</span>
            </div>

            <button
              onClick={handleMergeAction}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">merge</span>
              <span>Merge Duplicates (3)</span>
            </button>
          </div>

          {/* Primary Statement */}
          <div className="p-4 bg-surface rounded-2xl border border-outline-variant space-y-1">
            <span className="text-[10px] uppercase font-bold text-primary">Master Problem Statement</span>
            <p className="text-xs text-on-surface leading-relaxed">{primaryChallenge.description}</p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-on-surface-variant">
              <span>Origin: {primaryChallenge.submittedBy} ({primaryChallenge.submittedPhone})</span>
              <span>• Priority Score: {primaryChallenge.aiSeverityScore || 92}/100</span>
            </div>
          </div>

          {/* Duplicates to be Merged */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Matching Citizen Submissions ({duplicateReports.length})
              </h4>
              <span className="text-[11px] text-emerald-700 font-bold">Avg Similarity: 94%</span>
            </div>

            <div className="space-y-3">
              {duplicateReports.map((dup) => (
                <div key={dup.id} className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-on-surface">{dup.id}</span>
                      <span className="text-[11px] text-on-surface-variant">• {dup.location}</span>
                    </div>
                    <p className="font-semibold text-on-surface">{dup.title}</p>
                    <p className="text-[11px] text-on-surface-variant">Submitted by {dup.submitter} ({dup.phone}) on {dup.submittedAt}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg">
                      {dup.similarityScore}% Match
                    </span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Merge Impact Summary */}
          <div className="p-4 bg-primary-fixed/30 border border-primary-fixed-dim rounded-2xl text-xs space-y-1">
            <span className="font-bold text-on-primary-fixed block">Consolidation Benefit</span>
            <p className="text-on-primary-fixed-variant leading-relaxed">
              Merging these reports combines citizen urgency weights across 3 adjacent panchayats into a single comprehensive R&amp;D mandate for BIT Mesra, unlocking higher state grant eligibility.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
