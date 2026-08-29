import React, { useState } from 'react';

export const CaseStudyModal = ({ story, onClose }) => {
  if (!story) return null;

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/impact-map?story=${story.id}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareText = `Civic Innovation Case Study: ${story.title} (${story.district}, Jharkhand). Outcome: ${story.keyMetric}! Full story: ${window.location.origin}/impact-map?story=${story.id}`;

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[90] animate-in fade-in">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-surface-container-low border-b border-outline-variant flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              {story.domain}
            </span>
            <span className="text-xs font-mono font-bold text-on-surface-variant">• {story.id}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md hidden sm:inline">
              ✓ {story.status} ({story.resolvedDate || "2026"})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-6 text-on-surface">
          {/* Headline Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface leading-tight">
              {story.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1 font-semibold text-on-surface">
                <span className="material-symbols-outlined text-red-500 text-[16px]">location_on</span>
                {story.panchayat}, {story.block}, {story.district}
              </span>
              <span>• Submitted: {story.submissionDate}</span>
              <span>• Deployed: {story.resolvedDate}</span>
            </div>
          </div>

          {/* Before & After Dual Picture Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border border-outline-variant/80 bg-surface-container-low flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={story.photos.before}
                  alt="Before condition"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2.5 py-1 bg-amber-500 text-slate-950 text-xs font-extrabold rounded-lg shadow-md">
                  BEFORE INTERVENTION
                </span>
              </div>
              <p className="p-3 text-xs text-on-surface-variant leading-relaxed">
                {story.photos.beforeCaption}
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-emerald-500/40 bg-emerald-50/30 flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={story.photos.after}
                  alt="After solution"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2.5 py-1 bg-emerald-600 text-white text-xs font-extrabold rounded-lg shadow-md">
                  AFTER DEPLOYMENT
                </span>
              </div>
              <p className="p-3 text-xs text-emerald-900 leading-relaxed font-medium">
                {story.photos.afterCaption}
              </p>
            </div>
          </div>

          {/* Key Impact Metric Box */}
          <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-300 dark:border-emerald-700/60 rounded-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-surface-container-lowest/80 p-3 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Primary Outcome</span>
              <strong className="text-sm sm:text-base font-extrabold text-emerald-700">{story.keyMetric}</strong>
            </div>
            <div className="bg-surface-container-lowest/80 p-3 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Beneficiaries</span>
              <strong className="text-sm sm:text-base font-extrabold text-primary">{story.communitiesImpacted}</strong>
            </div>
            <div className="bg-surface-container-lowest/80 p-3 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Total State Grant</span>
              <strong className="text-sm sm:text-base font-extrabold text-purple-700">{story.grantAmount || "₹4.5L"}</strong>
            </div>
          </div>

          {/* Detailed Narrative & Scientific Methodology */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-on-surface">
              Case Study &amp; Technical Solution Architecture
            </h4>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {story.detailedStory}
            </p>
          </div>

          {/* Institutional Collaborative Partners */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/60 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Academic Research Lead</span>
              <strong className="text-on-surface text-sm">{story.academicPartner}</strong>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Faculty Lead, Student Cohort &amp; Laboratory testing</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Industry &amp; CSR Co-Sponsor</span>
              <strong className="text-emerald-700 text-sm">{story.csrPartner}</strong>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Schedule VII Co-funding &amp; field equipment</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Sticky Bar */}
        <div className="p-4 sm:p-6 bg-surface-container-low border-t border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky bottom-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface">Share Case Study:</span>
            <button
              onClick={shareWhatsApp}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>WhatsApp</span>
            </button>
            <button
              onClick={shareTwitter}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span>X (Twitter)</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-surface border border-outline-variant hover:bg-surface-container-high rounded-xl text-xs font-bold text-on-surface flex items-center gap-1.5 cursor-pointer relative"
            >
              <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'link'}</span>
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-primary-container shadow-xs cursor-pointer"
          >
            Close Story
          </button>
        </div>

      </div>
    </div>
  );
};
