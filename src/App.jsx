import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// 12 Integrated Page Views
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { CitizenSubmitChallenge } from './pages/citizen/CitizenSubmitChallenge';
import { CitizenTrackStatus } from './pages/citizen/CitizenTrackStatus';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminInboxReview } from './pages/admin/AdminInboxReview';
import { AdminAINotifications } from './pages/admin/AdminAINotifications';
import { AdminUniversityAssignment } from './pages/admin/AdminUniversityAssignment';
import { UniversityDashboard } from './pages/university/UniversityDashboard';
import { UniversityProjectWorkspace } from './pages/university/UniversityProjectWorkspace';
import { IndustryPortal } from './pages/industry/IndustryPortal';
import { SuperadminAnalyticsDashboard } from './pages/superadmin/SuperadminAnalyticsDashboard';
import { ImpactMapPage } from './pages/public/ImpactMapPage';

export const App = () => {
  const { activeRoute, navigate } = useApp();

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      navigate(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  // Route Resolver
  const renderRoute = () => {
    if (activeRoute === '/' || activeRoute === '') {
      return <LandingPage />;
    }
    if (activeRoute === '/impact-map' || activeRoute.startsWith('/impact-map')) {
      return <ImpactMapPage />;
    }
    if (activeRoute === '/login') {
      return <LoginPage />;
    }
    if (activeRoute === '/citizen/submit') {
      return <CitizenSubmitChallenge />;
    }
    if (activeRoute === '/citizen/track' || activeRoute.startsWith('/citizen/track')) {
      return <CitizenTrackStatus />;
    }
    if (activeRoute === '/admin/dashboard') {
      return <AdminDashboard />;
    }
    if (activeRoute === '/admin/inbox') {
      return <AdminInboxReview />;
    }
    if (activeRoute === '/admin/ai-notifications') {
      return <AdminAINotifications />;
    }
    if (activeRoute === '/admin/assign') {
      return <AdminUniversityAssignment />;
    }
    if (activeRoute === '/university/dashboard') {
      return <UniversityDashboard />;
    }
    if (activeRoute.startsWith('/university/workspace')) {
      return <UniversityProjectWorkspace />;
    }
    if (activeRoute === '/industry/portal') {
      return <IndustryPortal />;
    }
    if (activeRoute === '/superadmin/analytics') {
      return <SuperadminAnalyticsDashboard />;
    }

    // Default fallback
    return <LandingPage />;
  };

  return (
    <AppLayout>
      {renderRoute()}
    </AppLayout>
  );
};

export default App;
