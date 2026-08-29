import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const UniversityProjectWorkspace = () => {
  const { challenges, selectedChallengeId, updateMilestone, pledgeCSR, navigate } = useApp();
  const [activeTab, setActiveTab] = useState('milestones'); // 'milestones', 'budget', 'prototype', 'mentorship'

  const project = challenges.find(c => c.id === selectedChallengeId) || challenges[0];

  const milestonesList = project.milestones || [
    { title: "Literature Review & Problem Formulation", status: "completed", date: "2026-08-15", notes: "Problem analysis completed" },
    { title: "Hardware / Software Prototype Build", status: "in-progress", date: "2026-08-28", notes: "Lab bench fabrication active" },
    { title: "Field Testing & Panchayat Pilot", status: "pending", date: "2026-09-15", notes: "Awaiting stage 2 signoff" },
    { title: "Final Evaluation & Department Deployment", status: "pending", date: "2026-10-10", notes: "Handover protocol" }
  ];

  const [milestones, setMilestones] = useState(milestonesList);
  const [newLogNote, setNewLogNote] = useState('');
  const [csrPledgeAmount, setCsrPledgeAmount] = useState(250000);
  const [csrCompany, setCsrCompany] = useState('Tata Steel CSR Foundation');

  const handleMilestoneToggle = (idx) => {
    const currentStatus = milestones[idx].status;
    const nextStatus = currentStatus === 'completed' ? 'in-progress' : currentStatus === 'in-progress' ? 'completed' : 'in-progress';
    updateMilestone(project.id, idx, nextStatus, newLogNote || "Milestone status updated by Faculty PI.");
    setMilestones(prev => prev.map((m, i) => i === idx ? { ...m, status: nextStatus } : m));
    setNewLogNote('');
  };

  const handleCsrPledge = (e) => {
    e.preventDefault();
    pledgeCSR(project.id, csrCompany, csrPledgeAmount, "Project Workspace CSR Connect");
    alert(`Pledged ₹${(csrPledgeAmount / 100000).toFixed(1)} Lakhs towards project ${project.id}!`);
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-1">
            <button onClick={() => navigate('/university/dashboard')} className="hover:text-primary font-medium">
              University Dashboard
            </button>
            <span>/</span>
            <span className="font-mono font-bold text-primary">{project.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface leading-tight">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-on-surface-variant">
            <StatusBadge status={project.status} size="sm" />
            <span>• Assigned Institute: <strong>{project.assignedUniversity || "BIT Mesra"}</strong></span>
            <span>• District: <strong>{project.district}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/citizen/track')}
            className="px-4 py-2 bg-surface border border-outline-variant hover:bg-surface-container-high rounded-xl text-xs font-bold text-on-surface flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>Citizen View</span>
          </button>

          <button
            onClick={() => navigate('/industry/portal')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">handshake</span>
            <span>Request CSR Grant</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-outline-variant/60 gap-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'milestones', label: 'Milestones & Deliverables', icon: 'checklist' },
          { id: 'budget', label: 'Grant & Expenses Tracker', icon: 'account_balance_wallet' },
          { id: 'prototype', label: 'Technical Prototype & Specs', icon: 'biotech' },
          { id: 'mentorship', label: 'Industry & CSR Mentorship', icon: 'business' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Milestones & Deliverables */}
      {activeTab === 'milestones' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in">
          <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-on-surface">R&amp;D Milestone Progression Checklist</h3>
                <p className="text-xs text-on-surface-variant">Update milestone status to trigger next tranche of state research grant.</p>
              </div>
            </div>

            <div className="space-y-4">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    m.status === 'completed'
                      ? 'border-emerald-500/40 bg-emerald-50/50'
                      : m.status === 'in-progress'
                      ? 'border-primary bg-primary-fixed/20'
                      : 'border-outline-variant/60 bg-surface'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleMilestoneToggle(idx)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors cursor-pointer ${
                        m.status === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : m.status === 'in-progress'
                          ? 'bg-primary text-white animate-pulse'
                          : 'border-2 border-outline-variant text-transparent hover:border-primary'
                      }`}
                      title="Click to toggle status"
                    >
                      {m.status === 'completed' ? '✓' : m.status === 'in-progress' ? '●' : ''}
                    </button>
                    <div>
                      <h4 className={`text-xs sm:text-sm font-bold ${m.status === 'completed' ? 'text-emerald-950 line-through' : 'text-on-surface'}`}>
                        {m.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">{m.notes}</p>
                      <span className="text-[10px] text-on-surface-variant font-mono mt-1 block">Target Date: {m.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      m.status === 'completed' ? 'bg-emerald-200 text-emerald-900' :
                      m.status === 'in-progress' ? 'bg-primary text-white' :
                      'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {m.status}
                    </span>
                    <button
                      onClick={() => handleMilestoneToggle(idx)}
                      className="px-3 py-1 bg-surface border border-outline-variant rounded-lg text-xs font-semibold hover:bg-surface-container-high cursor-pointer"
                    >
                      Advance Status
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Note addition */}
            <div className="pt-4 border-t border-outline-variant/60">
              <label className="text-xs font-bold text-on-surface block mb-1.5">Attach Verification Note / Lab Finding</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLogNote}
                  onChange={(e) => setNewLogNote(e.target.value)}
                  placeholder="e.g. Spectrometry results confirm 99.1% fluoride reduction..."
                  className="flex-1 px-4 py-2 bg-surface border border-outline-variant rounded-xl text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Team Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Research Team Roster</h3>

              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/60 text-xs space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Principal Investigator</span>
                  <span className="font-bold text-on-surface">{project.assignedFaculty || "Dr. Anirban Mukherjee"}</span>
                  <span className="text-[11px] text-on-surface-variant block">Dept. of Chemical Engineering, BIT Mesra</span>
                </div>
                <div className="pt-2 border-t border-outline-variant/50">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Student Innovators Cohort</span>
                  <span className="font-bold text-primary">{project.studentTeam || "Team Jal-Shuddhi"}</span>
                  <ul className="text-[11px] text-on-surface-variant list-disc pl-4 mt-1 space-y-0.5">
                    <li>Rohan Sen (M.Tech Nanotech)</li>
                    <li>Priyanka Oraon (B.Tech Chemical)</li>
                    <li>Aman Verma (Ph.D. Scholar)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Grant & Expenses Tracker */}
      {activeTab === 'budget' && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/60 pb-4">
            <div>
              <h3 className="text-base font-bold text-on-surface">Grant Financial Ledger</h3>
              <p className="text-xs text-on-surface-variant">Real-time breakdown of State Innovation Funds &amp; Corporate CSR grants.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-on-surface-variant block">Total Grant Sanctioned</span>
              <strong className="text-xl font-extrabold text-emerald-700">₹{((project.grantAllocated || 450000) / 100000).toFixed(2)} Lakhs</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-surface rounded-2xl border border-outline-variant">
              <span className="text-xs text-on-surface-variant block">Tranche 1: Lab Fabrication (Disbursed)</span>
              <h4 className="text-xl font-bold text-on-surface mt-1">₹2,70,000</h4>
              <span className="text-[11px] text-emerald-700 font-semibold">100% Utilized</span>
            </div>

            <div className="p-4 bg-surface rounded-2xl border border-outline-variant">
              <span className="text-xs text-on-surface-variant block">Tranche 2: Field Trials (Pending Release)</span>
              <h4 className="text-xl font-bold text-on-surface mt-1">₹1,80,000</h4>
              <span className="text-[11px] text-amber-700 font-semibold">Milestone 3 Trigger</span>
            </div>

            <div className="p-4 bg-surface rounded-2xl border border-outline-variant">
              <span className="text-xs text-on-surface-variant block">CSR Co-Funding Pledged</span>
              <h4 className="text-xl font-bold text-primary mt-1">₹{((project.csrPledged || 300000) / 100000).toFixed(2)} Lakhs</h4>
              <span className="text-[11px] text-primary font-semibold">Tata Steel CSR</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Prototype Specifications */}
      {activeTab === 'prototype' && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-on-surface">Prototype Technical Specifications &amp; CAD</h3>
            <p className="text-xs text-on-surface-variant">Validated laboratory schematics for rural field trial deployment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-surface rounded-2xl border border-outline-variant space-y-2 text-xs">
              <span className="font-bold text-primary uppercase tracking-wider text-[10px]">Key Technical Specs</span>
              <ul className="space-y-1.5 text-on-surface">
                <li>• <strong>Filter Throughput:</strong> 500 Liters / Hour Gravity Flow</li>
                <li>• <strong>Fluoride Extraction Matrix:</strong> Bauxite residue + activated alumina composite</li>
                <li>• <strong>Lifespan:</strong> 180,000 Liters before cartridge regeneration</li>
                <li>• <strong>Operating Cost:</strong> &lt; ₹0.03 per Liter clean drinking water</li>
              </ul>
            </div>

            <div className="p-4 bg-surface rounded-2xl border border-outline-variant flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-4xl text-primary mb-2">view_in_ar</span>
              <h4 className="text-xs font-bold text-on-surface">3D CAD Model &amp; BOM Schematics</h4>
              <p className="text-[11px] text-on-surface-variant mt-1">Jal-Shuddhi-V2-Canister.step (14.2 MB)</p>
              <button
                onClick={() => alert("Downloading CAD Assembly Specification...")}
                className="mt-3 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container cursor-pointer"
              >
                Download CAD Assembly
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Industry & CSR Mentorship */}
      {activeTab === 'mentorship' && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-on-surface">Corporate CSR &amp; Industry Partnership</h3>
            <p className="text-xs text-on-surface-variant">Collaborate with corporate R&amp;D engineers and pledge matching CSR grants.</p>
          </div>

          <form onSubmit={handleCsrPledge} className="p-5 bg-surface rounded-2xl border border-outline-variant space-y-4 max-w-lg">
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1.5">CSR Partner Company Name</label>
              <input
                type="text"
                value={csrCompany}
                onChange={(e) => setCsrCompany(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1.5">Pledge Matching Grant Amount (₹)</label>
              <input
                type="number"
                step="50000"
                value={csrPledgeAmount}
                onChange={(e) => setCsrPledgeAmount(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">handshake</span>
              <span>Confirm CSR Grant Pledge</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
