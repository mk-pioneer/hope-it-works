import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const CitizenTrackStatus = () => {
  const { challenges, selectedChallengeId, setSelectedChallengeId, upvoteChallenge, navigate } = useApp();
  const [searchInput, setSearchInput] = useState(selectedChallengeId || 'JH-2026-CHAL-8921');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: "Rajeshwar Mahato (Submitter)", text: "Water testing team from BIT Mesra visited Chas Panchayat yesterday and collected 12 borehole samples.", time: "2 days ago" },
    { id: 2, author: "Dr. Anirban Mukherjee (BIT Mesra)", text: "Adsorbent media testing completed in Ranchi laboratory with 99.1% fluoride reduction. Pilot filtration canister under assembly.", time: "Yesterday" }
  ]);

  const activeChallenge = challenges.find(c => c.id === searchInput) || challenges.find(c => c.id === selectedChallengeId) || challenges[0];

  const handleSearch = (e) => {
    e.preventDefault();
    const found = challenges.find(c => c.id.toLowerCase() === searchInput.trim().toLowerCase() || c.district.toLowerCase() === searchInput.trim().toLowerCase());
    if (found) {
      setSelectedChallengeId(found.id);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => [
      ...prev,
      {
        id: Date.now(),
        author: "Citizen Contributor",
        text: newComment,
        time: "Just now"
      }
    ]);
    setNewComment('');
  };

  // Determine active step from status
  const getStepIndex = (status) => {
    switch (status) {
      case 'Submitted': return 1;
      case 'Under Review': return 2;
      case 'Assigned': return 3;
      case 'Prototyping': return 4;
      case 'Field Pilot': return 5;
      case 'Deployed': return 6;
      default: return 3;
    }
  };

  const currentStepNum = getStepIndex(activeChallenge.status);

  const trackerSteps = [
    { num: 1, title: "Submitted", desc: "Citizen registers issue" },
    { num: 2, title: "AI Triage & Validated", desc: "Dept approval & grant sizing" },
    { num: 3, title: "University Assigned", desc: "Matched with research lab" },
    { num: 4, title: "Prototype Build", desc: "Hardware/Software testing" },
    { num: 5, title: "Field Pilot", desc: "Panchayat trial validation" },
    { num: 6, title: "Solution Deployed", desc: "Scaled state-wide" }
  ];

  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 md:px-8 py-8 w-full">
      {/* Search Header */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Public Status Verification</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">Track Problem Resolution</h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Enter any SICP Challenge ID (e.g. JH-2026-CHAL-8921) to inspect live R&amp;D milestones.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                search
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Challenge ID..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-full text-xs sm:text-sm font-mono focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white font-bold rounded-full text-xs sm:text-sm hover:bg-primary-container shadow-xs cursor-pointer"
            >
              Track
            </button>
          </form>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-outline-variant/60">
          <span className="text-[11px] font-semibold text-on-surface-variant">Quick Track:</span>
          {challenges.slice(0, 4).map(c => (
            <button
              key={c.id}
              onClick={() => {
                setSearchInput(c.id);
                setSelectedChallengeId(c.id);
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                activeChallenge.id === c.id
                  ? 'bg-primary text-white font-bold'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {c.id} ({c.district})
            </button>
          ))}
        </div>
      </div>

      {/* Main Challenge Details & Live Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Challenge Overview & Milestone Tracker */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-primary bg-primary-fixed/50 px-2.5 py-1 rounded-lg">
                  {activeChallenge.id}
                </span>
                <span className="text-xs text-on-surface-variant font-semibold">
                  Submitted on {activeChallenge.submittedAt}
                </span>
              </div>
              <StatusBadge status={activeChallenge.status} />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface leading-snug mb-3">
              {activeChallenge.title}
            </h2>

            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
              {activeChallenge.description}
            </p>

            {/* Meta tags */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-outline-variant/60">
              <div className="p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Category</span>
                <span className="font-bold text-on-surface">{activeChallenge.category}</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Location</span>
                <span className="font-bold text-on-surface">{activeChallenge.district}</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Submitter</span>
                <span className="font-bold text-on-surface">{activeChallenge.submittedBy}</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-xl">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">State Grant</span>
                <span className="font-bold text-primary">₹{(activeChallenge.grantAllocated / 100000).toFixed(1)} Lakhs</span>
              </div>
            </div>

            {/* Upvote & Share Bar */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-outline-variant/60">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => upvoteChallenge(activeChallenge.id)}
                  className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-500/30 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-amber-600">thumb_up</span>
                  <span>Upvote ({activeChallenge.upvotes})</span>
                </button>
                <span className="text-xs text-on-surface-variant hidden sm:inline">
                  Community priority vote increases university grant weighting
                </span>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert(`Link copied for ${activeChallenge.id}`);
                }}
                className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full"
                title="Share link"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
              </button>
            </div>
          </div>

          {/* 6-Stage Resolution Timeline Stepper */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">timeline</span>
              <span>Solution Development Progress</span>
            </h3>

            <div className="relative space-y-6 before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-outline-variant/60">
              {trackerSteps.map((step) => {
                const isPassed = step.num <= currentStepNum;
                const isCurrent = step.num === currentStepNum;
                return (
                  <div key={step.num} className="relative flex items-start gap-4 pl-1">
                    {/* Circle Node */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                      isPassed
                        ? 'bg-secondary text-white shadow-xs'
                        : 'bg-surface border-2 border-outline-variant text-on-surface-variant'
                    }`}>
                      {isPassed ? (
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      ) : (
                        step.num
                      )}
                    </div>

                    <div className={`flex-1 p-3.5 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-primary-fixed/30 border-primary-fixed-dim shadow-xs'
                        : isPassed
                        ? 'bg-surface-container-low border-outline-variant/50'
                        : 'bg-surface/50 border-outline-variant/30 opacity-60'
                    }`}>
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                          {step.title}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded-full animate-pulse">
                            Active Phase
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Citizen Community Updates & Feedback Box */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">forum</span>
              <span>Field Updates &amp; Citizen Feedback</span>
            </h3>

            <div className="space-y-3 mb-6">
              {comments.map(c => (
                <div key={c.id} className="p-3.5 bg-surface rounded-2xl border border-outline-variant/70 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-on-surface">{c.author}</span>
                    <span className="text-[10px] text-on-surface-variant">{c.time}</span>
                  </div>
                  <p className="text-on-surface-variant leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Post a field update or ground feedback..."
                className="flex-1 px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary-container cursor-pointer"
              >
                Post
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Assigned Lab & Live Telemetry Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Assigned University Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-secondary bg-secondary-fixed/40 px-2 py-0.5 rounded-md">
              Assigned Academic Partner
            </span>

            {activeChallenge.assignedUniversity ? (
              <div className="mt-4 space-y-3">
                <h4 className="text-base font-extrabold text-on-surface">{activeChallenge.assignedUniversity}</h4>
                
                <div className="p-3 bg-surface-container-low rounded-xl text-xs space-y-2">
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Lead Faculty</span>
                    <span className="font-semibold text-on-surface">{activeChallenge.assignedFaculty || "Prof. In-Charge (R&D Cell)"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Student Research Group</span>
                    <span className="font-semibold text-on-surface">{activeChallenge.studentTeam || "Department Innovation Cohort"}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/university/workspace/${activeChallenge.id}`)}
                  className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">biotech</span>
                  <span>Open University Workspace</span>
                </button>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-surface-container-low rounded-2xl text-center text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-3xl text-amber-600 mb-1">hourglass_top</span>
                <p className="font-bold text-on-surface">Matching in Progress</p>
                <p className="text-[11px] mt-0.5">Admin is assigning this challenge to appropriate institute labs.</p>
              </div>
            )}
          </div>

          {/* CSR Funding & Industry Support Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-tertiary bg-tertiary-fixed/40 px-2 py-0.5 rounded-md">
              Industry &amp; CSR Co-Funding
            </span>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">CSR Pledged:</span>
                <strong className="text-emerald-700 font-bold">₹{((activeChallenge.csrPledged || 0) / 100000).toFixed(1)} Lakhs</strong>
              </div>

              {activeChallenge.industryCollaborators && activeChallenge.industryCollaborators.length > 0 ? (
                <div className="space-y-1.5">
                  {activeChallenge.industryCollaborators.map((corp, i) => (
                    <div key={i} className="p-2 bg-surface rounded-lg border border-outline-variant/60 text-xs font-semibold flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-700 text-[16px]">business</span>
                      <span>{corp}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant">Open for CSR scaling and sponsorship.</p>
              )}

              <button
                onClick={() => navigate('/industry/portal')}
                className="w-full py-2 bg-surface-container-low border border-outline-variant hover:bg-surface-container-high rounded-xl text-xs font-bold text-on-surface flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">handshake</span>
                <span>Pledge CSR Grant</span>
              </button>
            </div>
          </div>

          {/* Impact Map Entry Point Card */}
          <div className="bg-gradient-to-br from-emerald-500/10 via-surface-container-lowest to-teal-500/10 border border-emerald-500/30 rounded-3xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 material-symbols-outlined text-lg">explore</span>
              <div>
                <h4 className="text-xs font-extrabold text-on-surface">Nearby Deployed Outcomes</h4>
                <p className="text-[10px] text-emerald-800 font-semibold">{activeChallenge.district} &amp; Surrounding Region</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Explore successfully resolved societal solutions, lab prototypes, and before/after case studies in {activeChallenge.district}.
            </p>
            <button
              onClick={() => navigate(`/impact-map?district=${activeChallenge.district}&status=Resolved`)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">travel_explore</span>
              <span>See Similar Resolved Problems Nearby</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
