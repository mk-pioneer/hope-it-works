import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { currentRole, activeRoute, navigate, notifications, setNotifications } = useApp();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getRoleTitle = () => {
    switch (currentRole) {
      case 'admin': return 'Govt Admin Portal';
      case 'university': return 'University Innovation Cell';
      case 'industry': return 'Industry & CSR Portal';
      case 'superadmin': return 'State Planning Analytics';
      default: return 'Citizen & Public Portal';
    }
  };

  return (
    <header className="bg-surface dark:bg-inverse-surface border-b border-outline-variant dark:border-outline shadow-xs flex justify-between items-center w-full h-16 px-4 md:px-8 z-40 sticky top-[33px]">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high md:hidden transition-colors"
          aria-label="Toggle Navigation"
        >
          <span className="material-symbols-outlined">{isSidebarOpen ? 'close' : 'menu'}</span>
        </button>

        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl">account_balance</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary dark:text-inverse-primary tracking-tight">
                SICP Jharkhand
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase tracking-wider hidden sm:inline">
                Govt. of Jharkhand
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium leading-none mt-0.5">
              {getRoleTitle()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Top Nav Links for Public Mode */}
      <nav className="hidden lg:flex items-center gap-1">
        <button
          onClick={() => navigate('/')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeRoute === '/' ? 'text-primary font-bold bg-primary-container/10' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => navigate('/impact-map')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
            activeRoute === '/impact-map' ? 'text-primary font-bold bg-primary-container/10' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-emerald-600">explore</span>
          <span>Impact Map</span>
        </button>
        <button
          onClick={() => navigate('/citizen/submit')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeRoute === '/citizen/submit' ? 'text-primary font-bold bg-primary-container/10' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          Submit Challenge
        </button>
        <button
          onClick={() => navigate('/citizen/track')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeRoute === '/citizen/track' ? 'text-primary font-bold bg-primary-container/10' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          Track Status
        </button>
        <button
          onClick={() => navigate('/industry/portal')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeRoute === '/industry/portal' ? 'text-primary font-bold bg-primary-container/10' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          CSR &amp; Industry
        </button>
        <button
          onClick={() => navigate('/superadmin/analytics')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeRoute === '/superadmin/analytics' ? 'text-primary font-bold bg-primary-container/10' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          State Analytics
        </button>
      </nav>

      {/* Right Action Icons: Notifications, Direct Portal Switch, Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Notification Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-3 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-on-surface">System &amp; AI Alerts</span>
                  <span className="text-[11px] px-2 py-0.5 bg-primary-container text-on-primary-container rounded-full font-bold">
                    {unreadCount} unread
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/40">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-on-surface-variant">No alerts at this moment</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.type === 'duplicate_cluster') navigate('/admin/ai-notifications');
                        else if (n.type === 'assignment_dispatched') navigate('/university/dashboard');
                        else if (n.type === 'csr_pledged') navigate('/industry/portal');
                        else navigate('/admin/inbox');
                        setShowNotifMenu(false);
                      }}
                      className={`p-3 hover:bg-surface-container-low transition-colors cursor-pointer flex gap-3 ${
                        !n.read ? 'bg-primary-fixed/30' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        n.severity === 'critical' ? 'bg-error/15 text-error' :
                        n.severity === 'success' ? 'bg-secondary/15 text-secondary' :
                        n.type === 'duplicate_cluster' ? 'bg-amber-500/15 text-amber-600' :
                        'bg-primary/15 text-primary'
                      }`}>
                        <span className="material-symbols-outlined text-[18px]">
                          {n.severity === 'critical' ? 'warning' :
                           n.severity === 'success' ? 'verified' :
                           n.type === 'duplicate_cluster' ? 'psychology' : 'info'}
                        </span>
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="font-bold text-on-surface flex items-center justify-between">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-on-surface-variant font-normal">{n.timestamp}</span>
                        </div>
                        <p className="text-on-surface-variant mt-0.5 line-clamp-2 leading-relaxed">
                          {n.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 bg-surface-container-low border-t border-outline-variant text-center">
                <button
                  onClick={() => {
                    navigate('/admin/ai-notifications');
                    setShowNotifMenu(false);
                  }}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View AI Intelligence &amp; Duplicate Center →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Quick Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifMenu(false);
            }}
            className="flex items-center gap-2 p-1 pl-2 rounded-full border border-outline-variant hover:bg-surface-container-high transition-all"
          >
            <span className="text-xs font-semibold text-on-surface hidden sm:inline capitalize">
              {currentRole}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
              {currentRole[0]}
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-surface border border-outline-variant rounded-xl shadow-xl py-1 z-50">
              <div className="px-4 py-2 border-b border-outline-variant/60">
                <p className="text-xs font-bold text-on-surface capitalize">{currentRole} User</p>
                <p className="text-[11px] text-on-surface-variant">SICP Jharkhand Portal</p>
              </div>
              <button
                onClick={() => {
                  navigate('/login');
                  setShowUserMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-xs text-on-surface hover:bg-surface-container-high flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">switch_account</span>
                <span>Switch Portal / Login</span>
              </button>
              <button
                onClick={() => {
                  navigate('/citizen/submit');
                  setShowUserMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-xs text-on-surface hover:bg-surface-container-high flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Submit New Problem</span>
              </button>
              <div className="border-t border-outline-variant/60 my-1"></div>
              <button
                onClick={() => {
                  navigate('/');
                  setShowUserMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-xs text-error hover:bg-error/10 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Back to Home</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
