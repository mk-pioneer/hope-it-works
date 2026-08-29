import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const LandingPage = () => {
  const { navigate, challenges, switchRole, setSelectedChallengeId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');

  const sectors = [
    { name: "All", icon: "apps" },
    { name: "Water & Sanitation", icon: "water_drop", count: 18 },
    { name: "AgriTech & Livelihoods", icon: "agriculture", count: 24 },
    { name: "Healthcare", icon: "medical_services", count: 15 },
    { name: "Clean Energy", icon: "solar_power", count: 12 },
    { name: "Smart Urban Infra", icon: "location_city", count: 10 },
    { name: "Environment & Mining", icon: "forest", count: 9 }
  ];

  const filteredChallenges = challenges.filter(c => {
    const matchesSector = selectedSector === 'All' || c.category.includes(selectedSector) || selectedSector.includes(c.category);
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-20 md:pb-28 px-4 md:px-8 bg-gradient-to-b from-surface-container-low via-surface to-background overflow-hidden border-b border-outline-variant/40">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider mx-auto lg:mx-0 w-fit">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              State Innovation &amp; Collaboration Platform
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-tight leading-tight">
              Transforming <span className="text-primary">Jharkhand</span> Through Civic Innovation &amp; Academia
            </h1>

            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Connecting citizen challenges across all 24 districts directly with premier research institutions like BIT Mesra &amp; IIT Dhanbad, supported by state innovation grants and corporate CSR funding.
            </p>

            {/* Quick Action CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => navigate('/impact-map')}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">explore</span>
                <span>See Real Outcomes</span>
              </button>

              <button
                onClick={() => navigate('/citizen/submit')}
                className="px-6 py-3.5 bg-primary text-white hover:bg-primary-container rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
                <span>Submit a Problem</span>
              </button>

              <button
                onClick={() => navigate('/citizen/track')}
                className="px-5 py-3.5 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-high text-on-surface rounded-full font-bold text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-primary">track_changes</span>
                <span>Track Status</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="pt-2">
              <div className="relative max-w-xl mx-auto lg:mx-0">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search challenges by keyword, district, or ID (e.g. Bokaro, Water, JH-8921)..."
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Hero Visual Card / Quick Role Gateways */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-xl border border-white/60 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Quick Access Portals</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => switchRole('citizen')}
                  className="w-full p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/80 hover:border-primary hover:shadow-md transition-all flex items-center justify-between group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">Citizen &amp; Innovators</h4>
                      <p className="text-xs text-on-surface-variant">Report issues &amp; track solutions</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>

                <button
                  onClick={() => switchRole('admin')}
                  className="w-full p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/80 hover:border-primary hover:shadow-md transition-all flex items-center justify-between group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined">admin_panel_settings</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">Govt Department Admin</h4>
                      <p className="text-xs text-on-surface-variant">Evaluate, triage &amp; assign grants</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>

                <button
                  onClick={() => switchRole('university')}
                  className="w-full p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/80 hover:border-primary hover:shadow-md transition-all flex items-center justify-between group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined">school</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">Universities &amp; R&amp;D Cells</h4>
                      <p className="text-xs text-on-surface-variant">Build prototypes &amp; deploy pilots</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>

                <button
                  onClick={() => switchRole('industry')}
                  className="w-full p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/80 hover:border-primary hover:shadow-md transition-all flex items-center justify-between group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined">business</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">Industry &amp; CSR Partners</h4>
                      <p className="text-xs text-on-surface-variant">Pledge funds &amp; scale prototypes</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Statistics Bento Counter */}
      <section className="py-10 bg-surface border-b border-outline-variant/40 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col">
            <span className="text-3xl sm:text-4xl font-extrabold text-primary">148+</span>
            <span className="text-xs font-bold text-on-surface mt-1">Challenges Solved</span>
            <span className="text-[11px] text-on-surface-variant">Across 24 districts</span>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col">
            <span className="text-3xl sm:text-4xl font-extrabold text-secondary">38</span>
            <span className="text-xs font-bold text-on-surface mt-1">Active University Pilots</span>
            <span className="text-[11px] text-on-surface-variant">BIT, IIT ISM, NIT &amp; BAU</span>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col">
            <span className="text-3xl sm:text-4xl font-extrabold text-tertiary-container">₹2.4 Cr</span>
            <span className="text-xs font-bold text-on-surface mt-1">CSR Funds Committed</span>
            <span className="text-[11px] text-on-surface-variant">Tata Steel, CCL &amp; JSW</span>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col">
            <span className="text-3xl sm:text-4xl font-extrabold text-indigo-700">100%</span>
            <span className="text-xs font-bold text-on-surface mt-1">Digital Transparency</span>
            <span className="text-[11px] text-on-surface-variant">Real-time status tracking</span>
          </div>
        </div>
      </section>

      {/* Focus Sectors & Filter Pills */}
      <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {/* Interactive Impact Map Callout Banner */}
        <div className="mb-10 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 z-10">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              24-District Interactive GIS
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Explore Deployed Societal Outcomes on the Impact Map
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Filter by 10 societal domains, toggle interactive Before/After photo comparisons, and inspect university pilot deliverables across Jharkhand.
            </p>
          </div>
          <button
            onClick={() => navigate('/impact-map')}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full font-bold text-xs sm:text-sm shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer z-10"
          >
            <span className="material-symbols-outlined text-lg">explore</span>
            <span>Launch Impact Map</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">State Priority Areas</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">Explore Civic Innovation Challenges</h2>
          </div>

          {/* Sector filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {sectors.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSector(s.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedSector === s.name
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map(c => (
            <div
              key={c.id}
              className="bg-surface-container-lowest border border-outline-variant/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group lift-on-hover"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold text-primary">{c.id}</span>
                  <StatusBadge status={c.status} size="sm" />
                </div>

                <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-2">
                  {c.title}
                </h3>

                <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed mb-4">
                  {c.description}
                </p>
              </div>

              <div className="pt-4 border-t border-outline-variant/40 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-red-500">location_on</span>
                    {c.district} ({c.block})
                  </span>
                  <span className="font-semibold text-on-surface">{c.category}</span>
                </div>

                {c.assignedUniversity && (
                  <div className="p-2 bg-primary-fixed/30 rounded-lg text-xs flex items-center justify-between">
                    <span className="text-on-primary-fixed-variant font-medium">Assigned to:</span>
                    <span className="font-bold text-primary">{c.assignedUniversity}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      setSelectedChallengeId(c.id);
                      navigate('/citizen/track');
                    }}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>View Solution Timeline</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>

                  <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">thumb_up</span>
                    <span className="font-bold">{c.upvotes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works 5-Step Process */}
      <section className="py-16 bg-surface-container-low px-4 md:px-8 border-y border-outline-variant/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Collaborative Lifecycle</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">
              How SICP Bridges Problems to Deployed Solutions
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
              A transparent, accountable workflow empowering grassroots citizens with cutting-edge academic innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-3 font-bold">1</div>
              <h4 className="text-sm font-bold text-on-surface mb-1">Citizen Submits</h4>
              <p className="text-xs text-on-surface-variant">Civic challenge reported with photos, GPS, &amp; urgency metrics.</p>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mb-3 font-bold">2</div>
              <h4 className="text-sm font-bold text-on-surface mb-1">AI Triage &amp; Admin</h4>
              <p className="text-xs text-on-surface-variant">AI detects duplicates &amp; department admin approves state grant.</p>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 font-bold">3</div>
              <h4 className="text-sm font-bold text-on-surface mb-1">University Matching</h4>
              <p className="text-xs text-on-surface-variant">Matched with premier labs (BIT, IIT, NIT) based on R&amp;D fit.</p>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-3 font-bold">4</div>
              <h4 className="text-sm font-bold text-on-surface mb-1">Prototype &amp; CSR</h4>
              <p className="text-xs text-on-surface-variant">Student teams build prototypes co-funded by Corporate CSR.</p>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mb-3 font-bold">5</div>
              <h4 className="text-sm font-bold text-on-surface mb-1">Field Deployment</h4>
              <p className="text-xs text-on-surface-variant">Piloted in target panchayat &amp; handed over to department.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-inverse-surface text-inverse-on-surface py-12 px-4 md:px-8 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed text-2xl">account_balance</span>
              <span className="text-lg font-bold text-white">SICP Jharkhand</span>
            </div>
            <p className="text-xs text-outline-variant leading-relaxed">
              State Innovation &amp; Collaboration Platform, Department of Higher Education &amp; Planning, Government of Jharkhand.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Portals</h5>
            <ul className="space-y-2 text-xs text-outline-variant">
              <li><button onClick={() => switchRole('citizen')} className="hover:text-white">Citizen Portal</button></li>
              <li><button onClick={() => switchRole('admin')} className="hover:text-white">Admin Triage</button></li>
              <li><button onClick={() => switchRole('university')} className="hover:text-white">University Hub</button></li>
              <li><button onClick={() => switchRole('industry')} className="hover:text-white">Industry CSR</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">R&amp;D Network</h5>
            <ul className="space-y-2 text-xs text-outline-variant">
              <li>BIT Mesra Ranchi</li>
              <li>IIT (ISM) Dhanbad</li>
              <li>NIT Jamshedpur</li>
              <li>Birsa Agricultural University</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Emergency &amp; Support</h5>
            <p className="text-xs text-outline-variant">Toll Free Helpline: 1800-345-6789</p>
            <p className="text-xs text-outline-variant mt-1">Email: support-sicp@jharkhand.gov.in</p>
            <p className="text-xs text-outline-variant mt-2">Ranchi, Jharkhand - 834001</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
