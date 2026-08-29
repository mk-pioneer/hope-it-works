import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminDashboard = () => {
  const { challenges, universities, navigate, setSelectedChallengeId } = useApp();
  const [filterCategory, setFilterCategory] = useState('All');

  const pendingCount = challenges.filter(c => c.status === 'Under Review' || c.status === 'Submitted').length;
  const assignedCount = challenges.filter(c => c.status === 'Assigned' || c.status === 'Prototyping' || c.status === 'Field Pilot').length;
  const deployedCount = challenges.filter(c => c.status === 'Deployed' || c.status === 'Completed').length;
  const totalGrants = challenges.reduce((acc, c) => acc + (c.grantAllocated || 0), 0);

  const filteredChallenges = challenges.filter(c => {
    return filterCategory === 'All' || c.category === filterCategory;
  });

  const categories = [
    { name: "Water & Sanitation", count: 18, color: "bg-blue-500", percent: 32 },
    { name: "AgriTech & Livelihoods", count: 24, color: "bg-emerald-500", percent: 28 },
    { name: "Healthcare", count: 15, color: "bg-red-500", percent: 18 },
    { name: "Clean Energy", count: 12, color: "bg-amber-500", percent: 12 },
    { name: "Smart Urban Infra", count: 10, color: "bg-purple-500", percent: 10 }
  ];

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6">
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Department of Planning &amp; Higher Education</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">Admin Operations Cockpit</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Monitor state-wide civic challenges, manage AI triage pipelines, and allocate academic innovation grants.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/admin/inbox')}
            className="px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">inbox</span>
            <span>Review Inbox ({pendingCount})</span>
          </button>

          <button
            onClick={() => navigate('/admin/ai-notifications')}
            className="px-4 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span>AI Alerts</span>
          </button>

          <button
            onClick={() => navigate('/admin/assign')}
            className="px-4 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-secondary-container shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">assignment</span>
            <span>Assign Universities</span>
          </button>
        </div>
      </div>

      {/* 4 Bento KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Submissions</span>
            <span className="p-2 bg-blue-100 text-blue-800 rounded-xl material-symbols-outlined text-lg">description</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-on-surface">{challenges.length}</h3>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +14% this month across 24 districts
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pending Evaluation</span>
            <span className="p-2 bg-amber-100 text-amber-800 rounded-xl material-symbols-outlined text-lg">rate_review</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-amber-600">{pendingCount}</h3>
            <span className="text-[11px] text-on-surface-variant font-medium mt-1 block">
              Requires administrative sign-off
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active in Academia</span>
            <span className="p-2 bg-purple-100 text-purple-800 rounded-xl material-symbols-outlined text-lg">school</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-purple-700">{assignedCount}</h3>
            <span className="text-[11px] text-purple-800 font-semibold mt-1 block">
              BIT Mesra, IIT ISM &amp; NIT
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">State Grants Issued</span>
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl material-symbols-outlined text-lg">payments</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-emerald-700">₹{(totalGrants / 100000).toFixed(1)}L</h3>
            <span className="text-[11px] text-emerald-800 font-semibold mt-1 block">
              100% tracked milestone disbursements
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Challenges Queue & Sector Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Filterable Problem Inbox Queue */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-xs flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-bold text-on-surface">Incoming Problem Submissions</h3>
              <p className="text-xs text-on-surface-variant">Real-time civic submissions requiring triage &amp; lab matching.</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="All">All Categories</option>
                {categories.map((c, idx) => (
                  <option key={idx} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/60 text-on-surface-variant font-bold uppercase text-[10px]">
                  <th className="pb-3 px-2">ID / District</th>
                  <th className="pb-3 px-2">Problem Statement</th>
                  <th className="pb-3 px-2">AI Severity</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filteredChallenges.map(c => (
                  <tr key={c.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="py-3 px-2 whitespace-nowrap">
                      <span className="font-mono font-bold text-primary block">{c.id}</span>
                      <span className="text-[11px] text-on-surface-variant">{c.district}</span>
                    </td>
                    <td className="py-3 px-2">
                      <p className="font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                        {c.title}
                      </p>
                      <span className="text-[11px] text-on-surface-variant">{c.category}</span>
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        c.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                        c.severity === 'High' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {c.aiSeverityScore || 85}/100 ({c.severity})
                      </span>
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="py-3 px-2 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedChallengeId(c.id);
                            navigate('/admin/inbox');
                          }}
                          className="px-2.5 py-1 bg-surface-container-high hover:bg-primary hover:text-white rounded-lg text-xs font-semibold transition-colors"
                          title="Open Triage Drawer"
                        >
                          Triage
                        </button>
                        <button
                          onClick={() => {
                            setSelectedChallengeId(c.id);
                            navigate('/admin/assign');
                          }}
                          className="px-2.5 py-1 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-semibold transition-colors"
                          title="Assign University"
                        >
                          Assign
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Sector Distribution & Institutional R&D Capacity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Sector Share Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-on-surface mb-1">Sector Distribution</h3>
            <p className="text-xs text-on-surface-variant mb-4">Jharkhand Innovation Focus Areas</p>

            <div className="space-y-3">
              {categories.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-on-surface">
                    <span>{cat.name}</span>
                    <span>{cat.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected University Roster */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-on-surface">Academic Lab Network</h3>
              <span className="text-xs text-primary font-bold">{universities.length} Institutes</span>
            </div>

            <div className="space-y-2.5">
              {universities.slice(0, 3).map(u => (
                <div key={u.id} className="p-3 bg-surface rounded-2xl border border-outline-variant/60 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-on-surface">{u.name.split('(')[0]}</h5>
                    <p className="text-[11px] text-on-surface-variant">{u.activeProjects} Active Projects</p>
                  </div>
                  <span className="font-bold text-primary">★ {u.performanceRating}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/admin/assign')}
              className="w-full mt-4 py-2 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant rounded-xl text-xs font-bold text-on-surface flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View All Matching Institutes</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
