import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const SuperadminAnalyticsDashboard = () => {
  const { challenges, universities, industryPledges, navigate } = useApp();
  const [selectedTimeframe, setSelectedTimeframe] = useState('FY 2026-27');

  const districtData = [
    { name: "Ranchi", submissions: 32, resolved: 24, activePilots: 8, leadLab: "BIT Mesra", funding: "₹38.5L" },
    { name: "Bokaro", submissions: 22, resolved: 14, activePilots: 6, leadLab: "BIT Mesra", funding: "₹24.0L" },
    { name: "Dhanbad", submissions: 28, resolved: 19, activePilots: 7, leadLab: "IIT (ISM) Dhanbad", funding: "₹32.0L" },
    { name: "East Singhbhum", submissions: 18, resolved: 13, activePilots: 4, leadLab: "NIT Jamshedpur", funding: "₹18.5L" },
    { name: "Khunti", submissions: 14, resolved: 9, activePilots: 3, leadLab: "BAU Ranchi", funding: "₹12.0L" },
    { name: "Dumka", submissions: 12, resolved: 7, activePilots: 2, leadLab: "Ranchi University", funding: "₹9.5L" },
    { name: "West Singhbhum", submissions: 11, resolved: 6, activePilots: 3, leadLab: "IIT ISM", funding: "₹11.0L" },
    { name: "Palamu", submissions: 11, resolved: 4, activePilots: 5, leadLab: "BIT Mesra", funding: "₹10.5L" }
  ];

  const handleExport = () => {
    alert("Exporting official State Societal Innovation & Academia Performance Report (PDF/CSV)...");
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full">
              State Planning &amp; Higher Education Council
            </span>
            <span className="text-xs text-on-surface-variant font-semibold">Macro Policy Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1.5">
            Jharkhand Societal Innovation Analytics
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Cross-district telemetry, university research translation metrics, and CSR co-funding leverage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="FY 2026-27">FY 2026-27 (Current)</option>
            <option value="FY 2025-26">FY 2025-26 (Past Year)</option>
            <option value="All Time">All Time Aggregate</option>
          </select>

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 State Macro KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Civic Problems</span>
            <span className="p-2 bg-blue-100 text-blue-800 rounded-xl material-symbols-outlined text-lg">flag</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-on-surface">{challenges.length * 24}</h3>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
              100% geotagged across 24 districts
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">R&amp;D Translation Rate</span>
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl material-symbols-outlined text-lg">psychology</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-emerald-700">76.4%</h3>
            <span className="text-[11px] text-emerald-800 font-semibold mt-1 block">
              Problems converted to lab prototypes
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">State Fund Deployed</span>
            <span className="p-2 bg-purple-100 text-purple-800 rounded-xl material-symbols-outlined text-lg">account_balance</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-purple-700">₹1.85 Cr</h3>
            <span className="text-[11px] text-purple-800 font-semibold mt-1 block">
              + ₹2.40 Cr Corporate CSR matching
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Avg Time to Field Pilot</span>
            <span className="p-2 bg-amber-100 text-amber-800 rounded-xl material-symbols-outlined text-lg">schedule</span>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-amber-700">42 Days</h3>
            <span className="text-[11px] text-amber-800 font-semibold mt-1 block">
              58% faster than conventional tenders
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 24 District Matrix & University Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: District Heatmap / Activity Table */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-on-surface">District-Wise Problem Resolution Matrix</h3>
              <p className="text-xs text-on-surface-variant">Active civic challenges and deployed solutions by administrative geography.</p>
            </div>
            <span className="text-xs font-bold text-primary">24 Districts Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/60 text-on-surface-variant font-bold uppercase text-[10px]">
                  <th className="pb-3 px-2">District</th>
                  <th className="pb-3 px-2 text-center">Submissions</th>
                  <th className="pb-3 px-2 text-center">Pilots Active</th>
                  <th className="pb-3 px-2">Lead Academic Lab</th>
                  <th className="pb-3 px-2 text-right">Grant Utilized</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {districtData.map((d, i) => (
                  <tr key={i} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-2 font-bold text-on-surface">{d.name}</td>
                    <td className="py-3 px-2 text-center font-semibold text-on-surface">{d.submissions}</td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                        {d.activePilots}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-primary font-semibold">{d.leadLab}</td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-on-surface">{d.funding}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 Cols: University Translation Leaderboard */}
        <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-on-surface">University Innovation Performance Leaderboard</h3>
            <p className="text-xs text-on-surface-variant">Ranked by prototype success rate and village field pilot handovers.</p>
          </div>

          <div className="space-y-3">
            {universities.map((u, rank) => (
              <div
                key={u.id}
                className="p-3.5 bg-surface rounded-2xl border border-outline-variant/70 flex items-center justify-between text-xs hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
                    rank === 0 ? 'bg-amber-400 text-amber-950 shadow-xs' :
                    rank === 1 ? 'bg-gray-300 text-gray-900' :
                    rank === 2 ? 'bg-amber-600 text-white' : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    #{rank + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">{u.name.split('(')[0]}</h4>
                    <p className="text-[11px] text-on-surface-variant">{u.completedPilots} completed field pilots</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-emerald-700 block">★ {u.performanceRating}</span>
                  <span className="text-[10px] text-on-surface-variant">₹{(u.grantsReceived / 100000).toFixed(1)}L Grant</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-primary-fixed/30 border border-primary-fixed-dim rounded-2xl text-xs space-y-1 mt-4">
            <span className="font-bold text-on-primary-fixed block">State Innovation Council Recommendation</span>
            <p className="text-on-primary-fixed-variant leading-relaxed">
              Allocate additional ₹50 Lakhs seed fund to BIT Mesra &amp; IIT ISM Dhanbad for Phase 2 scaling of rural water purification and tele-cardiology kits.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
