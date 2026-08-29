import React from 'react';
import { useApp } from '../../context/AppContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { currentRole, activeRoute, navigate, challenges } = useApp();

  const pendingAdminCount = challenges.filter(c => c.status === 'Under Review' || c.status === 'Submitted').length;
  const duplicateAlertCount = challenges.filter(c => c.duplicatesDetected > 0).length;
  const activeUnivCount = challenges.filter(c => c.status === 'Assigned' || c.status === 'Prototyping').length;

  const getMenuItems = () => {
    switch (currentRole) {
      case 'admin':
        return [
          { label: 'Overview Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
          { label: 'Problem Inbox & Triage', icon: 'inbox', path: '/admin/inbox', badge: pendingAdminCount },
          { label: 'AI Duplicate & Alerts', icon: 'psychology', path: '/admin/ai-notifications', badge: duplicateAlertCount, badgeColor: 'bg-amber-500 text-white' },
          { label: 'University Matching', icon: 'assignment', path: '/admin/assign' },
          { label: 'State Macro Analytics', icon: 'analytics', path: '/superadmin/analytics' },
          { label: 'Public Portal View', icon: 'public', path: '/' },
        ];
      case 'university':
        return [
          { label: 'Innovation Cell Hub', icon: 'school', path: '/university/dashboard' },
          { label: 'Assigned Challenges', icon: 'inbox', path: '/university/dashboard', badge: activeUnivCount },
          { label: 'Active R&D Workspace', icon: 'biotech', path: '/university/workspace/JH-2026-CHAL-8921' },
          { label: 'CSR Marketplace', icon: 'handshake', path: '/industry/portal' },
          { label: 'Track Public Progress', icon: 'visibility', path: '/citizen/track' },
        ];
      case 'industry':
        return [
          { label: 'CSR Collaboration Hub', icon: 'business', path: '/industry/portal' },
          { label: 'Browse Prototypes', icon: 'lightbulb', path: '/industry/portal' },
          { label: 'Public Challenges', icon: 'psychology', path: '/citizen/track' },
          { label: 'State Impact Reports', icon: 'analytics', path: '/superadmin/analytics' },
          { label: 'Portal Home', icon: 'home', path: '/' },
        ];
      case 'superadmin':
        return [
          { label: 'State Macro Analytics', icon: 'query_stats', path: '/superadmin/analytics' },
          { label: 'Admin Triage Hub', icon: 'inbox', path: '/admin/inbox' },
          { label: 'AI Duplicate Center', icon: 'psychology', path: '/admin/ai-notifications' },
          { label: 'University Assignments', icon: 'assignment', path: '/admin/assign' },
          { label: 'CSR & Industry Hub', icon: 'business', path: '/industry/portal' },
          { label: 'Public Portal', icon: 'public', path: '/' },
        ];
      default: // Citizen
        return [
          { label: 'Portal Home', icon: 'home', path: '/' },
          { label: 'State Impact Map', icon: 'explore', path: '/impact-map', highlight: true },
          { label: 'Submit Problem', icon: 'add_circle', path: '/citizen/submit' },
          { label: 'Track Challenge Status', icon: 'track_changes', path: '/citizen/track' },
          { label: 'Innovation Showcase', icon: 'lightbulb', path: '/industry/portal' },
          { label: 'State Impact Insights', icon: 'insights', path: '/superadmin/analytics' },
        ];
    }
  };

  const menuItems = getMenuItems();

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-[33px] md:top-[97px] left-0 h-[calc(100vh-33px)] md:h-[calc(100vh-97px)] w-72 bg-surface dark:bg-inverse-surface border-r border-outline-variant dark:border-outline shadow-sm z-40 flex flex-col p-4 transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Role Badge Indicator */}
        <div className="mb-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">
              {currentRole === 'admin' ? 'admin_panel_settings' :
               currentRole === 'university' ? 'school' :
               currentRole === 'industry' ? 'business' :
               currentRole === 'superadmin' ? 'query_stats' : 'person'}
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Active Mode</p>
              <p className="text-xs font-bold text-on-surface capitalize">{currentRole} Interface</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {menuItems.map((item, idx) => {
            const isActive = activeRoute === item.path || (item.path !== '/' && activeRoute.startsWith(item.path));
            return (
              <button
                key={idx}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-primary-container text-white shadow-xs'
                    : item.highlight
                    ? 'bg-primary/10 text-primary hover:bg-primary/20 font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-xl transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-on-surface-variant'
                  }`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || (isActive ? 'bg-white text-primary' : 'bg-primary-container text-white')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Help & Switch Footer */}
        <div className="pt-4 border-t border-outline-variant/60 space-y-1">
          <button
            onClick={() => handleNav('/login')}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-full text-xs font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-lg">switch_account</span>
            <span>Switch Role / Login</span>
          </button>
          <div className="px-3.5 py-2 text-[11px] text-on-surface-variant/80 bg-surface-container-lowest/50 rounded-lg">
            <p className="font-semibold text-primary">SICP Jharkhand v2.4</p>
            <p>State Innovation Mission</p>
          </div>
        </div>
      </aside>
    </>
  );
};
