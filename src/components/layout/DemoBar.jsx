import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const DemoBar = () => {
  const { currentRole, switchRole, supabaseStatus } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);

  const roles = [
    { id: 'citizen', name: 'Citizen / Innovator', icon: 'person', badge: 'Public' },
    { id: 'admin', name: 'Department Admin', icon: 'admin_panel_settings', badge: 'Govt' },
    { id: 'university', name: 'University Innovation Cell', icon: 'school', badge: 'Academia' },
    { id: 'industry', name: 'Industry & CSR Partner', icon: 'business', badge: 'Corporate' },
    { id: 'superadmin', name: 'Superadmin / Planning Dept', icon: 'query_stats', badge: 'State' },
  ];

  const currentRoleObj = roles.find(r => r.id === currentRole) || roles[0];

  return (
    <>
      <div className="bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold px-4 py-1.5 flex items-center justify-between z-[70] sticky top-0 border-b border-tertiary/20 shadow-xs">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-bold tracking-wide uppercase text-[11px] bg-tertiary/15 text-tertiary px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Demo Mode Active
            </span>

            {/* Supabase Status Pill */}
            <button
              onClick={() => setShowDbModal(true)}
              className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer ${
                supabaseStatus?.isConnected
                  ? 'bg-emerald-600/15 text-emerald-800 border border-emerald-600/30'
                  : 'bg-indigo-600/15 text-indigo-900 border border-indigo-600/30'
              }`}
              title="Click to view Supabase backend configuration"
            >
              <span className="material-symbols-outlined text-[12px]">database</span>
              <span>{supabaseStatus?.isConnected ? 'Supabase Connected (Live)' : 'Supabase Backend Ready'}</span>
            </button>

            <span className="hidden md:inline text-on-tertiary-fixed-variant text-xs ml-1">
              Viewing as: <strong className="text-on-tertiary-fixed font-bold">{currentRoleObj.name}</strong>
            </span>
          </div>

          {/* Role Quick Selector */}
          <div className="flex items-center gap-1.5">
            <div className="hidden lg:flex items-center gap-1 bg-surface-container-lowest/60 p-0.5 rounded-md border border-tertiary/20">
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => switchRole(r.id)}
                  className={`px-2.5 py-1 text-xs rounded transition-all font-medium flex items-center gap-1 ${
                    currentRole === r.id
                      ? 'bg-primary text-white shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">{r.icon}</span>
                  <span>{r.badge}</span>
                </button>
              ))}
            </div>

            {/* Mobile / Compact Dropdown Button */}
            <div className="relative lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-surface-container-lowest px-3 py-1 rounded text-on-surface text-xs font-bold shadow-xs hover:bg-surface-container-high flex items-center gap-1 transition-all"
              >
                <span>Switch Role</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-surface border border-outline-variant rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/50">
                    Select User Perspective
                  </div>
                  {roles.map(r => (
                    <button
                      key={r.id}
                      onClick={() => {
                        switchRole(r.id);
                        setIsOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-surface-container-high transition-colors ${
                        currentRole === r.id ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">{r.icon}</span>
                        <span>{r.name}</span>
                      </div>
                      {currentRole === r.id && (
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Configuration Info Modal */}
      {showDbModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-[90] animate-in fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">database</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">Supabase Backend Integration</h3>
                  <span className="text-[11px] text-on-surface-variant">PostgreSQL, Auth &amp; Realtime</span>
                </div>
              </div>
              <button
                onClick={() => setShowDbModal(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface">Database Status:</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-mono font-bold text-[10px]">
                  {supabaseStatus?.isConnected ? 'ONLINE (Live Supabase)' : 'READY (Auto-Syncing Engine)'}
                </span>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                All backend queries, challenge insertions, university grant allocations, and CSR commitments are wired to the Supabase API service (<code>src/services/api.js</code>).
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-on-surface">To connect your live Supabase database:</p>
              <ol className="list-decimal pl-5 space-y-1 text-on-surface-variant">
                <li>Run the SQL script in <code className="text-primary font-mono font-bold">supabase/schema.sql</code> in your Supabase SQL Editor.</li>
                <li>Add your <code className="font-mono">VITE_SUPABASE_URL</code> and <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> in <code className="font-mono">.env</code>.</li>
                <li>Restart the dev server — changes sync immediately across all connected devices!</li>
              </ol>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDbModal(false)}
                className="px-5 py-2 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary-container shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
