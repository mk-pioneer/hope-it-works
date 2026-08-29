import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const IndustryPortal = () => {
  const { challenges, industryPledges, pledgeCSR, navigate, setSelectedChallengeId } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [pledgeModalOpen, setPledgeModalOpen] = useState(false);
  const [targetChallenge, setTargetChallenge] = useState(null);
  const [companyName, setCompanyName] = useState('Tata Steel Foundation');
  const [pledgeAmount, setPledgeAmount] = useState(300000);
  const [contactName, setContactName] = useState('Sourav Roy (Chief CSR)');

  const totalCommitted = industryPledges.reduce((acc, p) => acc + p.totalCommitted, 0);

  const filteredChallenges = challenges.filter(c => {
    return selectedCategory === 'All' || c.category.includes(selectedCategory) || selectedCategory.includes(c.category);
  });

  const handleOpenPledge = (challenge) => {
    setTargetChallenge(challenge);
    setPledgeModalOpen(true);
  };

  const handlePledgeSubmit = (e) => {
    e.preventDefault();
    if (!targetChallenge) return;
    pledgeCSR(targetChallenge.id, companyName, pledgeAmount, contactName);
    setPledgeModalOpen(false);
    alert(`Thank you! ₹${(pledgeAmount / 100000).toFixed(1)} Lakhs pledged for ${targetChallenge.id}. CSR receipt generated.`);
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              Corporate CSR &amp; Industry Hub
            </span>
            <span className="text-xs text-on-surface-variant font-semibold">Schedule VII Innovation Co-Funding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1.5">
            Industry &amp; CSR Collaboration Portal
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Support validated university prototypes, mentor student researchers, and deploy scalable societal technology.
          </p>
        </div>

        <button
          onClick={() => navigate('/citizen/track')}
          className="px-4 py-2 bg-surface border border-outline-variant hover:bg-surface-container-high rounded-xl text-xs font-bold text-on-surface flex items-center gap-1.5 cursor-pointer w-fit"
        >
          <span className="material-symbols-outlined text-[16px]">track_changes</span>
          <span>View Public Trackers</span>
        </button>
      </div>

      {/* 4 CSR Impact Bento KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total CSR Committed</span>
            <span className="p-2 bg-amber-100 text-amber-800 rounded-xl material-symbols-outlined text-lg">payments</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-amber-700">₹{(totalCommitted / 10000000).toFixed(2)} Cr</h3>
            <span className="text-[11px] text-amber-800 font-semibold mt-1 block">
              Across Tata Steel, CCL, JSW
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active CSR Collabs</span>
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl material-symbols-outlined text-lg">handshake</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-emerald-700">14 Projects</h3>
            <span className="text-[11px] text-emerald-800 font-semibold mt-1 block">
              Co-developed with universities
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Lives Impacted</span>
            <span className="p-2 bg-blue-100 text-blue-800 rounded-xl material-symbols-outlined text-lg">groups</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-blue-700">28,500+</h3>
            <span className="text-[11px] text-blue-800 font-semibold mt-1 block">
              In tribal &amp; rural panchayats
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tax &amp; 80G Certified</span>
            <span className="p-2 bg-purple-100 text-purple-800 rounded-xl material-symbols-outlined text-lg">verified</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-purple-700">100%</h3>
            <span className="text-[11px] text-purple-800 font-semibold mt-1 block">
              Schedule VII CSR compliant
            </span>
          </div>
        </div>
      </div>

      {/* Prototype Marketplace & Catalog */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-on-surface">Validated Prototypes Seeking CSR Co-Funding</h2>
            <p className="text-xs text-on-surface-variant">Select high-readiness student prototypes to sponsor field pilots and commercialization.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['All', 'Water & Sanitation', 'AgriTech', 'Healthcare', 'Clean Energy'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map(c => (
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

                <div className="p-3 bg-surface-container-low rounded-xl text-xs space-y-1 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Academic Lab:</span>
                    <strong className="text-on-surface">{c.assignedUniversity || "BIT Mesra / IIT ISM"}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Location:</span>
                    <strong className="text-on-surface">{c.district}</strong>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-on-surface-variant">CSR Pledged so far:</span>
                    <span className="text-emerald-700 font-bold">₹{((c.csrPledged || 0) / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-on-surface-variant">Funding Needed for Pilot:</span>
                    <span className="text-primary font-bold">₹3.0 Lakhs</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedChallengeId(c.id);
                    navigate(`/university/workspace/${c.id}`);
                  }}
                  className="px-3 py-2 bg-surface hover:bg-surface-container-high border border-outline-variant rounded-xl text-xs font-bold text-on-surface"
                >
                  Specs
                </button>

                <button
                  onClick={() => handleOpenPledge(c)}
                  className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">handshake</span>
                  <span>Pledge CSR Grant</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pledge Modal */}
      {pledgeModalOpen && targetChallenge && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">CSR Grant Commitment</span>
                <h3 className="text-base font-bold text-on-surface">Pledge for {targetChallenge.id}</h3>
              </div>
              <button
                onClick={() => setPledgeModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              <strong>{targetChallenge.title}</strong> — Your pledge directly co-funds hardware fabrication &amp; village field trials.
            </p>

            <form onSubmit={handlePledgeSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Company / CSR Foundation</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Contact Officer Name &amp; Title</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Pledge Grant Amount (₹)</label>
                <input
                  type="number"
                  step="50000"
                  required
                  value={pledgeAmount}
                  onChange={(e) => setPledgeAmount(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/60">
                <button
                  type="button"
                  onClick={() => setPledgeModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant rounded-xl text-xs font-semibold text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Confirm &amp; Issue Schedule VII Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
