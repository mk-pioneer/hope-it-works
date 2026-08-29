import React, { useState } from 'react';

export const JharkhandVectorMap = ({
  problems = [],
  selectedProblemId = null,
  onSelectProblem,
  onOpenStoryModal,
  zoomLevel = 1,
  setZoomLevel
}) => {
  const [mapStyle, setMapStyle] = useState('institutional'); // 'institutional', 'topographic', 'satellite'
  const [clusteringEnabled, setClusteringEnabled] = useState(true);
  const [hoveredPinId, setHoveredPinId] = useState(null);

  // Group pins by cluster regions if clustering enabled and zoomed out (zoomLevel === 1)
  const shouldCluster = clusteringEnabled && zoomLevel === 1;

  const clusterRegions = [
    { name: "Palamu Region (NW)", x: 26, y: 30, items: problems.filter(p => p.clusterRegion === "Palamu") },
    { name: "North Chota Nagpur (N)", x: 58, y: 32, items: problems.filter(p => p.clusterRegion === "North Chota Nagpur") },
    { name: "Santhal Pargana (NE)", x: 82, y: 26, items: problems.filter(p => p.clusterRegion === "Santhal Pargana") },
    { name: "South Chota Nagpur (Central)", x: 45, y: 64, items: problems.filter(p => p.clusterRegion === "South Chota Nagpur") },
    { name: "Kolhan (South)", x: 62, y: 82, items: problems.filter(p => p.clusterRegion === "Kolhan") }
  ].filter(c => c.items.length > 0);

  const activeProblem = problems.find(p => p.id === selectedProblemId);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    onSelectProblem(null);
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] lg:h-full min-h-[520px] bg-slate-900 overflow-hidden rounded-3xl border border-outline-variant shadow-lg select-none">
      {/* Background Topo & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-indigo-950/60 pointer-events-none" />

      {/* Floating Map Controls Top-Right */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="flex items-center bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-2xl p-1 shadow-lg">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-white hover:bg-slate-700 transition-colors font-bold text-lg cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <span className="text-[11px] font-mono text-slate-300 px-2 font-bold">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-white hover:bg-slate-700 transition-colors font-bold text-lg cursor-pointer"
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2.5 py-1 text-[11px] rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-colors font-semibold cursor-pointer border-l border-slate-700"
            title="Reset to Full State View"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center gap-1 bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-2xl p-1 shadow-lg text-[11px]">
          <button
            onClick={() => setClusteringEnabled(!clusteringEnabled)}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
              clusteringEnabled
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">bubble_chart</span>
            <span>Clusters</span>
          </button>
          <button
            onClick={() => setMapStyle(mapStyle === 'institutional' ? 'topographic' : 'institutional')}
            className="px-2.5 py-1 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-all font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">layers</span>
            <span className="capitalize">{mapStyle}</span>
          </button>
        </div>
      </div>

      {/* Floating State Watermark */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
            State Impact GIS Engine
          </span>
        </div>
        <h3 className="text-base font-extrabold text-white tracking-tight mt-0.5">
          Jharkhand State Territory (24 Districts)
        </h3>
        <p className="text-[11px] text-slate-400 font-medium">
          Coordinates calibrated to WGS-84 civic geofences
        </p>
      </div>

      {/* Transformable Canvas with Zoom & Pan */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
        style={{
          transform: `scale(${zoomLevel}) ${
            activeProblem && zoomLevel > 1
              ? `translate(${(50 - activeProblem.coordinates.x) * 0.4}%, ${(50 - activeProblem.coordinates.y) * 0.4}%)`
              : 'translate(0, 0)'
          }`
        }}
      >
        <div className="relative w-[92%] max-w-[840px] aspect-[4/3] max-h-[500px]">
          
          {/* Custom Stylized Jharkhand SVG State Outline */}
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Institutional Gradient */}
              <linearGradient id="jharkhandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>

              {/* Topographic Relief Gradient */}
              <linearGradient id="topoGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#064e3b" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#1e293b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#312e81" stopOpacity="0.8" />
              </linearGradient>

              {/* Glowing Outer Boundary Filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#38bdf8" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* State Base Polygon Outline (Stylized accurate geometry of Jharkhand) */}
            <path
              d="M 120 120 
                 C 160 90, 240 100, 310 110 
                 C 380 90, 440 80, 520 90 
                 C 600 70, 680 80, 740 110 
                 C 780 140, 770 200, 760 250 
                 C 750 300, 700 340, 680 390 
                 C 660 450, 630 520, 570 550 
                 C 500 580, 420 540, 360 520 
                 C 300 550, 240 560, 190 510 
                 C 150 460, 180 390, 160 330 
                 C 140 280, 90 230, 95 180 
                 Z"
              fill={mapStyle === 'topographic' ? 'url(#topoGradient)' : 'url(#jharkhandGradient)'}
              stroke="#38bdf8"
              strokeWidth="2.5"
              filter="url(#glow)"
              className="transition-colors duration-500"
            />

            {/* Major Rivers Network: Damodar & Subarnarekha */}
            <path
              d="M 220 280 Q 380 290 520 330 T 720 360"
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="4 2"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M 380 400 Q 480 440 600 490 T 660 540"
              stroke="#0284c7"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              fill="none"
              opacity="0.5"
            />

            {/* Internal Regional Boundary Lines */}
            {/* North Chota Nagpur / Santhal Pargana Border */}
            <path d="M 520 90 Q 560 220 580 320" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            {/* South Chota Nagpur / Kolhan Border */}
            <path d="M 360 450 Q 480 440 660 450" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            {/* Palamu / Chota Nagpur Border */}
            <path d="M 310 110 Q 300 280 330 420" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

            {/* District Territory Labels on Map */}
            <g className="text-[11px] font-mono fill-slate-400 font-bold tracking-wider select-none pointer-events-none opacity-50">
              <text x="180" y="190">GARHWA</text>
              <text x="240" y="230">PALAMU</text>
              <text x="320" y="200">CHATRA</text>
              <text x="420" y="240">HAZARIBAGH</text>
              <text x="450" y="160">KODERMA</text>
              <text x="540" y="190">GIRIDIH</text>
              <text x="610" y="170">DEOGHAR</text>
              <text x="690" y="220">DUMKA</text>
              <text x="560" y="320">DHANBAD</text>
              <text x="510" y="370">BOKARO</text>
              <text x="410" y="440">RANCHI</text>
              <text x="390" y="520">KHUNTI</text>
              <text x="280" y="490">GUMLA</text>
              <text x="280" y="550">SIMDEGA</text>
              <text x="580" y="510">EAST SINGHBHUM</text>
              <text x="440" y="550">WEST SINGHBHUM</text>
            </g>
          </svg>

          {/* CLUSTERED VIEW: Count Bubbles on Regions */}
          {shouldCluster ? (
            clusterRegions.map((cluster, idx) => {
              const resolvedCount = cluster.items.filter(p => p.status === 'Resolved').length;
              const activeCount = cluster.items.filter(p => p.status === 'Active').length;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setZoomLevel(2);
                    onSelectProblem(cluster.items[0].id);
                  }}
                  style={{ left: `${cluster.x}%`, top: `${cluster.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group animate-in zoom-in-75 duration-300"
                >
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing Aura */}
                    <div className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping opacity-60 pointer-events-none" />
                    
                    {/* Main Cluster Bubble */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.5)] flex flex-col items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-sm font-extrabold font-mono text-emerald-300">
                        {cluster.items.length}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-slate-300 tracking-tighter -mt-0.5">
                        Impacts
                      </span>
                    </div>

                    {/* Badge Split (Resolved/Active) */}
                    <div className="absolute -bottom-2 flex items-center gap-1 bg-slate-950/90 px-2 py-0.5 rounded-full border border-slate-700 text-[9px] font-bold shadow-md">
                      <span className="text-emerald-400">{resolvedCount} ✓</span>
                      {activeCount > 0 && <span className="text-amber-400">• {activeCount} ⏳</span>}
                    </div>

                    {/* Hover Region Name Label */}
                    <div className="absolute top-14 whitespace-nowrap bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {cluster.name} • Click to Zoom In
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* EXPANDED PINS VIEW: Individual Pins */
            problems.map((prob) => {
              const isSelected = selectedProblemId === prob.id;
              const isHovered = hoveredPinId === prob.id;
              const isResolved = prob.status === 'Resolved';

              return (
                <div
                  key={prob.id}
                  style={{ left: `${prob.coordinates.x}%`, top: `${prob.coordinates.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  onMouseEnter={() => setHoveredPinId(prob.id)}
                  onMouseLeave={() => setHoveredPinId(null)}
                >
                  <button
                    onClick={() => onSelectProblem(prob.id)}
                    className={`relative flex items-center justify-center transition-transform cursor-pointer focus:outline-none ${
                      isSelected ? 'scale-135 z-40' : 'hover:scale-120'
                    }`}
                  >
                    {/* Ring Glow when selected or hovered */}
                    {(isSelected || isHovered) && (
                      <span className={`absolute -inset-3 rounded-full animate-ping opacity-75 ${
                        isResolved ? 'bg-emerald-400' : 'bg-amber-400'
                      }`} />
                    )}

                    {/* The Marker Pin SVG & Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xl border-2 transition-all ${
                      isResolved
                        ? 'bg-emerald-600 border-emerald-200 text-white shadow-emerald-500/50'
                        : 'bg-amber-500 border-amber-100 text-slate-950 shadow-amber-500/50'
                    } ${isSelected ? 'ring-4 ring-white shadow-2xl' : ''}`}>
                      <span className="material-symbols-outlined text-[16px]">
                        {prob.domain === 'Water' ? 'water_drop' :
                         prob.domain === 'Healthcare' ? 'medical_services' :
                         prob.domain === 'Agriculture' ? 'agriculture' :
                         prob.domain === 'Environment' ? 'forest' :
                         prob.domain === 'Energy' ? 'solar_power' :
                         prob.domain === 'Education' ? 'school' :
                         prob.domain === 'Accessibility' ? 'accessible' :
                         prob.domain === 'Public Admin' ? 'account_balance' : 'handshake'}
                      </span>
                    </div>

                    {/* Pin Status Dot */}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${
                      isResolved ? 'bg-emerald-300' : 'bg-amber-300 animate-pulse'
                    }`} />
                  </button>

                  {/* Hover Tag (When not selected) */}
                  {!isSelected && isHovered && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-10 bg-slate-900/95 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl border border-slate-700 whitespace-nowrap z-50 animate-in fade-in">
                      <p className="font-bold">{prob.district}: {prob.title}</p>
                      <span className="text-[10px] text-emerald-400 font-semibold">{prob.domain} • {prob.status}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* FLOATING SELECTED PIN POPUP MODAL/TOOLTIP */}
          {activeProblem && (
            <div
              style={{
                left: `${Math.min(Math.max(activeProblem.coordinates.x, 25), 75)}%`,
                top: `${activeProblem.coordinates.y > 60 ? activeProblem.coordinates.y - 18 : activeProblem.coordinates.y + 18}%`
              }}
              className="absolute -translate-x-1/2 z-50 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-3xl p-4 shadow-2xl text-white animate-in zoom-in-95 duration-200"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    activeProblem.status === 'Resolved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {activeProblem.status === 'Resolved' ? '✓ Resolved' : '⏳ Active in Pilot'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">{activeProblem.district}</span>
                </div>
                <button
                  onClick={() => onSelectProblem(null)}
                  className="text-slate-400 hover:text-white p-0.5 rounded-md"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 mb-1.5">
                {activeProblem.title}
              </h4>

              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-3">
                {activeProblem.outcomeSummary}
              </p>

              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/80 text-[11px] mb-3">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-400">Key Outcome:</span>
                  <span className="text-emerald-400 font-bold">{activeProblem.keyMetric}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>Lab: {activeProblem.academicPartner.split('(')[0]}</span>
                  <span>{activeProblem.resolvedDate || activeProblem.status}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenStoryModal(activeProblem)}
                  className="flex-1 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>View Case Study Story</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Map Legend Overlay on Bottom-Right */}
      <div className="absolute bottom-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl p-3 shadow-xl text-white text-xs space-y-1.5 hidden sm:block">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Impact Map Legend</span>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-200 shadow-xs" />
          <span className="text-[11px] font-medium text-slate-200">Resolved Solution (Field Deployed)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-amber-200 shadow-xs" />
          <span className="text-[11px] font-medium text-slate-200">Active Lab / Pilot Prototyping</span>
        </div>
      </div>
    </div>
  );
};
