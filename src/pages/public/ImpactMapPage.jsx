import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { IMPACT_PROBLEMS, IMPACT_DOMAINS, JHARKHAND_DISTRICTS } from '../../data/impactProblemsData';
import { LeafletImpactMap } from '../../components/impact/LeafletImpactMap';
import { JharkhandVectorMap } from '../../components/impact/JharkhandVectorMap';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { StoryCard } from '../../components/impact/StoryCard';
import { CaseStudyModal } from '../../components/impact/CaseStudyModal';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ImpactMapPage = () => {
  const { navigate } = useApp();

  // Filters State
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All', 'Resolved', 'Active'
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'story'

  // Map & Selection State
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [activeStoryModal, setActiveStoryModal] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Read URL query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const domainParam = params.get('domain');
    const districtParam = params.get('district');
    const statusParam = params.get('status');
    const storyParam = params.get('story');
    const viewParam = params.get('view');

    if (domainParam) setSelectedDomain(domainParam);
    if (districtParam) setSelectedDistrict(districtParam);
    if (statusParam) setSelectedStatus(statusParam);
    if (viewParam === 'story') setViewMode('story');

    if (storyParam) {
      const found = IMPACT_PROBLEMS.find(p => p.id === storyParam);
      if (found) {
        setActiveStoryModal(found);
        setSelectedProblemId(found.id);
      }
    }

    // Simulate quick initial skeleton load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  // Filter logic
  const filteredProblems = useMemo(() => {
    return IMPACT_PROBLEMS.filter(p => {
      const matchesDomain = selectedDomain === 'All' || p.domain === selectedDomain;
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
      const matchesDistrict = selectedDistrict === 'All' || p.district === selectedDistrict;

      let matchesDate = true;
      if (selectedDateRange === '30days') matchesDate = p.resolvedDate?.includes('August') || p.submissionDate?.includes('May') || p.submissionDate?.includes('Jun');
      else if (selectedDateRange === '6months') matchesDate = true;
      else if (selectedDateRange === '1year') matchesDate = true;

      const matchesSearch = searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.outcomeSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.panchayat.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDomain && matchesStatus && matchesDistrict && matchesDate && matchesSearch;
    });
  }, [selectedDomain, selectedStatus, selectedDistrict, selectedDateRange, searchQuery]);

  // Story view is strictly resolved items
  const resolvedStories = useMemo(() => {
    return filteredProblems.filter(p => p.status === 'Resolved');
  }, [filteredProblems]);

  const clearFilters = () => {
    setSelectedDomain('All');
    setSelectedStatus('All');
    setSelectedDistrict('All');
    setSelectedDateRange('All');
    setSearchQuery('');
    setSelectedProblemId(null);
  };

  const handleCardClick = (probId) => {
    setSelectedProblemId(probId);
    setZoomLevel(1.5);
  };

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      
      {/* Top Banner & Summary Stats Callouts */}
      <section className="bg-gradient-to-b from-surface-container-low via-surface to-background border-b border-outline-variant/60 pt-8 pb-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                  Public Innovation Telemetry
                </span>
                <span className="text-xs text-on-surface-variant font-semibold hidden sm:inline">
                  • 100% Real-World Verified
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-on-surface mt-2 tracking-tight">
                Jharkhand Societal Impact Map
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
                Explore real civic solutions engineered by premier research labs (BIT Mesra, IIT Dhanbad, NIT Jamshedpur) and deployed across all 24 districts of Jharkhand.
              </p>
            </div>

            {/* View Mode Toggle Pill (Map View vs Story View) */}
            <div className="flex items-center bg-surface-container-high p-1 rounded-2xl border border-outline-variant shadow-xs self-start md:self-auto">
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">map</span>
                <span>Map View</span>
              </button>

              <button
                onClick={() => setViewMode('story')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'story'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">auto_stories</span>
                <span>Story Gallery</span>
              </button>
            </div>
          </div>

          {/* 3 Large Summary Stats Callouts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">explore</span>
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Districts Covered</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-on-surface">21 / 24</h3>
                  <span className="text-xs font-bold text-blue-700">88% Statewide</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">Active field deployments</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">task_alt</span>
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Resolved</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-700">421</h3>
                  <span className="text-xs font-bold text-emerald-800">+48 In Pilot</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">Permanent community solutions</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">groups</span>
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Communities Impacted</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-purple-700">185,000+</h3>
                  <span className="text-xs font-bold text-purple-800">Citizens</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">Across tribal &amp; rural panchayats</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-surface-container-lowest border-b border-outline-variant/60 py-4 px-4 md:px-8 sticky top-[97px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Main Dropdowns & Status */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Domain Dropdown */}
            <div className="relative">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="pl-3 pr-8 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All">All Domains (10)</option>
                {IMPACT_DOMAINS.map(d => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
              <span className="material-symbols-outlined text-base absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Status Filter Pill Tabs */}
            <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant">
              {[
                { id: 'All', label: 'All Status' },
                { id: 'Resolved', label: 'Resolved (✓)' },
                { id: 'Active', label: 'Active (⏳)' }
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStatus(s.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedStatus === s.id
                      ? s.id === 'Resolved' ? 'bg-emerald-600 text-white shadow-xs' : s.id === 'Active' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-primary text-white shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* District Dropdown (24 Districts) */}
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="pl-3 pr-8 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All">All 24 Districts</option>
                {JHARKHAND_DISTRICTS.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
              <span className="material-symbols-outlined text-base absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Date Range Selector */}
            <div className="relative">
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="pl-3 pr-8 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All">All Time</option>
                <option value="30days">Past 30 Days</option>
                <option value="6months">Past 6 Months</option>
                <option value="1year">Past 1 Year</option>
              </select>
              <span className="material-symbols-outlined text-base absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Search Input & Reset Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined text-lg absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search outcomes, panchayats..."
                className="w-full pl-9 pr-4 py-2 bg-surface border border-outline-variant rounded-xl text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {(selectedDomain !== 'All' || selectedStatus !== 'All' || selectedDistrict !== 'All' || selectedDateRange !== 'All' || searchQuery !== '') && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 bg-surface-container-high hover:bg-error/10 hover:text-error text-on-surface-variant rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                title="Reset all filters"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>

        </div>
      </section>

      {/* Main Content Area: Map View vs Story View */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        
        {viewMode === 'map' ? (
          /* MAP VIEW: Synced Left List Panel + Full-Width Jharkhand Map */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
            
            {/* Left Synced List Panel (Scrollable cards) */}
            <div className="lg:col-span-5 flex flex-col h-[520px] sm:h-[620px] lg:h-[720px] bg-surface-container-lowest border border-outline-variant rounded-3xl p-4 sm:p-5 shadow-xs overflow-hidden">
              
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60 shrink-0 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-on-surface">
                    Impact Problem Stories ({filteredProblems.length})
                  </h3>
                  <p className="text-[11px] text-on-surface-variant">
                    Click any card to pinpoint &amp; inspect on map
                  </p>
                </div>

                <button
                  onClick={() => setViewMode('story')}
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Gallery</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>

              {/* Scrollable Problem Cards List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {isLoading ? (
                  /* Skeleton Loading State */
                  [1, 2, 3, 4].map(n => (
                    <div key={n} className="p-3.5 rounded-2xl border border-outline-variant/50 animate-pulse space-y-2.5">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-xl bg-surface-container-high shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-surface-container-high rounded w-3/4" />
                          <div className="h-2.5 bg-surface-container-high rounded w-1/2" />
                          <div className="h-2 bg-surface-container-high rounded w-full" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : filteredProblems.length === 0 ? (
                  /* Empty State */
                  <div className="p-8 text-center flex flex-col items-center justify-center h-full text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">search_off</span>
                    <h4 className="text-sm font-bold text-on-surface">No impact stories found</h4>
                    <p className="text-xs text-on-surface-variant max-w-xs mt-1">
                      Try resetting your domain or district filters to discover more societal outcomes.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  filteredProblems.map(prob => {
                    const isSelected = selectedProblemId === prob.id;
                    const isResolved = prob.status === 'Resolved';

                    return (
                      <div
                        key={prob.id}
                        onClick={() => handleCardClick(prob.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 group ${
                          isSelected
                            ? 'border-primary bg-primary-fixed/20 shadow-md ring-2 ring-primary/40'
                            : 'border-outline-variant/70 bg-surface hover:bg-surface-container-low hover:border-outline-variant'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
                          <img
                            src={prob.photos.thumbnail}
                            alt={prob.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <span className={`absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold text-white uppercase ${
                            isResolved ? 'bg-emerald-600' : 'bg-amber-600'
                          }`}>
                            {isResolved ? 'Resolved' : 'Active'}
                          </span>
                        </div>

                        {/* Card Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                              {prob.domain}
                            </span>
                            <span className="text-[10px] font-mono text-on-surface-variant">
                              {prob.district}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                            {prob.title}
                          </h4>

                          <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                            {prob.outcomeSummary}
                          </p>

                          <div className="flex items-center justify-between pt-1 text-[10px]">
                            <span className="text-emerald-700 font-bold truncate">
                              ★ {prob.keyMetric}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveStoryModal(prob);
                              }}
                              className="text-primary font-bold hover:underline shrink-0"
                            >
                              Story →
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Map Canvas (Leaflet 2.0-alpha + OpenTiles) */}
            <div className="lg:col-span-7 h-[520px] sm:h-[620px] lg:h-[720px] sticky top-24">
              <ErrorBoundary
                fallback={
                  <JharkhandVectorMap
                    problems={filteredProblems}
                    selectedProblemId={selectedProblemId}
                    onSelectProblem={setSelectedProblemId}
                    onOpenStoryModal={setActiveStoryModal}
                    zoomLevel={zoomLevel}
                    setZoomLevel={setZoomLevel}
                  />
                }
              >
                <LeafletImpactMap
                  problems={filteredProblems}
                  selectedProblemId={selectedProblemId}
                  onSelectProblem={setSelectedProblemId}
                  onOpenStoryModal={setActiveStoryModal}
                  zoomLevel={zoomLevel}
                  setZoomLevel={setZoomLevel}
                />
              </ErrorBoundary>
            </div>

          </div>
        ) : (
          /* STORY VIEW: Responsive Grid of Resolved Case Studies */
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/60">
              <div>
                <h3 className="text-base font-bold text-on-surface">
                  Verified Innovation Case Studies ({resolvedStories.length})
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Interactive Before &amp; After photo sliders and ground impact reports.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('map')}
                  className="px-4 py-2 bg-surface hover:bg-surface-container-high border border-outline-variant rounded-xl text-xs font-bold text-on-surface flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">map</span>
                  <span>Switch to Map View</span>
                </button>
              </div>
            </div>

            {resolvedStories.length === 0 ? (
              <div className="p-12 text-center bg-surface-container-lowest border border-outline-variant rounded-3xl">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">menu_book</span>
                <h4 className="text-base font-bold text-on-surface">No resolved case studies match your criteria</h4>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto mt-1">
                  Adjust your filters or switch to Map View to see ongoing research projects.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resolvedStories.map(story => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onOpenModal={setActiveStoryModal}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Case Study Full Modal */}
      {activeStoryModal && (
        <CaseStudyModal
          story={activeStoryModal}
          onClose={() => setActiveStoryModal(null)}
        />
      )}

    </div>
  );
};
