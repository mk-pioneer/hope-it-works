import React, { useState } from 'react';
import { DemoBar } from './DemoBar';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useApp } from '../../context/AppContext';

export const AppLayout = ({ children, showSidebar = true }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { activeRoute } = useApp();

  // Certain full-width public pages like landing page, impact map, or login can choose whether to hide sidebar
  const isPublicStandalone = activeRoute === '/' || activeRoute === '/login' || activeRoute.startsWith('/impact-map');
  const displaySidebar = showSidebar && !isPublicStandalone;

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans">
      {/* 1. Top Demo Role Switcher Bar */}
      <DemoBar />

      {/* 2. Primary Navigation TopBar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* 3. Main Body Container with Sidebar + Content */}
      <div className="flex-1 flex w-full">
        {displaySidebar && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        <main className={`flex-1 flex flex-col min-w-0 transition-all ${
          displaySidebar ? 'md:max-w-[calc(100vw-288px)]' : 'w-full'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
};
