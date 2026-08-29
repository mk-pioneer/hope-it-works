import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const LoginPage = () => {
  const { switchRole, navigate } = useApp();
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [authMode, setAuthMode] = useState('otp'); // 'otp' or 'password'
  const [identifier, setIdentifier] = useState('');
  const [secret, setSecret] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const roleConfigs = {
    citizen: {
      title: "Citizen & Community Innovator",
      desc: "Submit societal challenges, upload local evidence, and track university R&D progress.",
      icon: "person",
      placeholder: "+91 98765 43210 (Mobile Number)",
      color: "bg-blue-600"
    },
    admin: {
      title: "Department Admin / State Evaluator",
      desc: "Triage citizen problems, verify AI duplicate alerts, and approve state innovation grants.",
      icon: "admin_panel_settings",
      placeholder: "admin.jharkhand@gov.in (Govt Email)",
      color: "bg-purple-700"
    },
    university: {
      title: "University & Academic Innovation Cell",
      desc: "Accept assigned state challenges, form student researcher teams, and update prototype milestones.",
      icon: "school",
      placeholder: "dean.rd@bitmesra.ac.in (Institutional Email)",
      color: "bg-emerald-700"
    },
    industry: {
      title: "Industry Partner & CSR Foundation",
      desc: "Browse validated university prototypes, pledge CSR grants, and mentor student innovators.",
      icon: "business",
      placeholder: "csr.head@tatasteel.com (Corporate Email)",
      color: "bg-amber-700"
    },
    superadmin: {
      title: "State Planning Dept / Superadmin",
      desc: "Macro-level district analytics, budget utilization tracking, and policy decision intelligence.",
      icon: "query_stats",
      placeholder: "superadmin.sicp@jharkhand.gov.in",
      color: "bg-indigo-800"
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    switchRole(selectedRole);
  };

  const handleQuickDemo = (roleId) => {
    switchRole(roleId);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 bg-gradient-to-br from-surface-container-low via-background to-surface">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left / Main Login Form */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-container text-white flex items-center justify-center font-bold shadow-xs">
                <span className="material-symbols-outlined text-2xl">account_balance</span>
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-on-surface">SICP Jharkhand</h2>
                <p className="text-xs text-on-surface-variant">Unified Institutional Authentication</p>
              </div>
            </div>

            {/* Role Tab Selector */}
            <div className="mb-6">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                Select Your Portal Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.keys(roleConfigs).map(roleKey => {
                  const r = roleConfigs[roleKey];
                  const isSelected = selectedRole === roleKey;
                  return (
                    <button
                      key={roleKey}
                      type="button"
                      onClick={() => setSelectedRole(roleKey)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                          : 'border-outline-variant/70 hover:bg-surface-container-high text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{r.icon}</span>
                      <span className="text-xs truncate capitalize">{roleKey}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role Header Info */}
            <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/60 mb-6 flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl ${roleConfigs[selectedRole].color} text-white flex items-center justify-center shrink-0 mt-0.5`}>
                <span className="material-symbols-outlined text-[18px]">{roleConfigs[selectedRole].icon}</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-on-surface">{roleConfigs[selectedRole].title}</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5">
                  {roleConfigs[selectedRole].desc}
                </p>
              </div>
            </div>

            {/* Auth Mode Toggle */}
            <div className="flex rounded-xl bg-surface-container-low p-1 mb-5 border border-outline-variant/60">
              <button
                type="button"
                onClick={() => setAuthMode('otp')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'otp' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant'
                }`}
              >
                OTP Verification (SMS)
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('password')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'password' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant'
                }`}
              >
                Password / SSO Login
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1.5">
                  {authMode === 'otp' ? 'Registered Mobile Number' : 'Official Email Address'}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                    {authMode === 'otp' ? 'phone_iphone' : 'mail'}
                  </span>
                  <input
                    type={authMode === 'otp' ? 'tel' : 'email'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={roleConfigs[selectedRole].placeholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {authMode === 'otp' ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-on-surface">Enter 6-Digit OTP</label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(true)}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      {otpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder={otpSent ? "Enter 123456 (Demo Code)" : "Click 'Send OTP' first"}
                    className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono tracking-widest text-center"
                  />
                  {otpSent && (
                    <p className="text-[11px] text-emerald-700 mt-1 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      OTP sent to registered phone! Use any 6 digits for demo.
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1.5">Password</label>
                  <input
                    type="password"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Enter account password..."
                    className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-container shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Log In to {roleConfigs[selectedRole].title.split(' ')[0]} Portal</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>
          </div>

          <div className="pt-6 mt-6 border-t border-outline-variant/60 flex items-center justify-between text-xs text-on-surface-variant">
            <button onClick={() => navigate('/')} className="hover:text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Public Homepage</span>
            </button>
            <span>Govt. of Jharkhand SICP</span>
          </div>
        </div>

        {/* Right / Instant 1-Click Demo Profiles */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-amber-600 text-xl">bolt</span>
              <h3 className="text-sm font-bold text-on-surface">1-Click Instant Demo Access</h3>
            </div>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
              Explore the fully functional platform without entering login credentials. Select any persona below:
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => handleQuickDemo('citizen')}
                className="w-full p-3 rounded-xl border border-outline-variant/70 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between group transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    C
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-on-surface">Citizen Persona</h5>
                    <p className="text-[11px] text-on-surface-variant">Rajeshwar Mahato (Bokaro)</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">Launch →</span>
              </button>

              <button
                onClick={() => handleQuickDemo('admin')}
                className="w-full p-3 rounded-xl border border-outline-variant/70 hover:border-purple-500 hover:bg-purple-50/50 flex items-center justify-between group transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    A
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-on-surface">Dept Admin Persona</h5>
                    <p className="text-[11px] text-on-surface-variant">Dr. Vandana Dadel (Planning Dept)</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">Launch →</span>
              </button>

              <button
                onClick={() => handleQuickDemo('university')}
                className="w-full p-3 rounded-xl border border-outline-variant/70 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center justify-between group transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    U
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-on-surface">University Lead Persona</h5>
                    <p className="text-[11px] text-on-surface-variant">Prof. A. Mukherjee (BIT Mesra)</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">Launch →</span>
              </button>

              <button
                onClick={() => handleQuickDemo('industry')}
                className="w-full p-3 rounded-xl border border-outline-variant/70 hover:border-amber-500 hover:bg-amber-50/50 flex items-center justify-between group transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    I
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-on-surface">Corporate CSR Persona</h5>
                    <p className="text-[11px] text-on-surface-variant">Tata Steel Foundation CSR</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">Launch →</span>
              </button>

              <button
                onClick={() => handleQuickDemo('superadmin')}
                className="w-full p-3 rounded-xl border border-outline-variant/70 hover:border-indigo-500 hover:bg-indigo-50/50 flex items-center justify-between group transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                    S
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-on-surface">Superadmin Persona</h5>
                    <p className="text-[11px] text-on-surface-variant">State Macro Innovation Council</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-700 group-hover:translate-x-1 transition-transform">Launch →</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-primary-fixed/40 rounded-2xl border border-primary-fixed-dim text-xs text-on-primary-fixed-variant">
            <p className="font-bold mb-1">State Security Protocol Notice</p>
            <p>Access is restricted to authorized stakeholders in accordance with Jharkhand IT &amp; e-Governance Policy 2026.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
