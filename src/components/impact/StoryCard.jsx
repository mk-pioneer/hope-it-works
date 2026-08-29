import React, { useState } from 'react';

export const StoryCard = ({ story, onOpenModal }) => {
  const [activePhotoTab, setActivePhotoTab] = useState('after'); // 'before' or 'after' or 'split'
  const [sliderPosition, setSliderPosition] = useState(50);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/impact-map?story=${story.id}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareText = `Check out this civic innovation outcome in Jharkhand: ${story.title} - ${story.keyMetric}! Read on SICP Jharkhand: ${window.location.origin}/impact-map?story=${story.id}`;

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group lift-on-hover">
      
      {/* Top Media: Interactive Before / After Image Section */}
      <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden select-none">
        
        {/* Photos with toggle/slider */}
        {activePhotoTab === 'split' ? (
          /* Interactive Drag / Hover Slider */
          <div className="relative w-full h-full">
            {/* After Image (Full Background) */}
            <img
              src={story.photos.after}
              alt="After solution"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Before Image (Clipped Left Layer) */}
            <div
              className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-2xl"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={story.photos.before}
                alt="Before issue"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%', minWidth: '350px' }}
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/75 text-amber-300 text-[10px] font-bold rounded-md">
                BEFORE
              </span>
            </div>
            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/75 text-emerald-300 text-[10px] font-bold rounded-md">
              AFTER
            </span>

            {/* Slider Range Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              title="Drag to compare Before and After"
            />
          </div>
        ) : (
          /* Single Image with Toggle */
          <div className="relative w-full h-full">
            <img
              src={activePhotoTab === 'before' ? story.photos.before : story.photos.after}
              alt={activePhotoTab === 'before' ? story.photos.beforeCaption : story.photos.afterCaption}
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <p className="absolute bottom-2 left-3 right-3 text-white text-[11px] font-medium drop-shadow-md line-clamp-1 pointer-events-none">
              {activePhotoTab === 'before' ? story.photos.beforeCaption : story.photos.afterCaption}
            </p>
          </div>
        )}

        {/* Before / After / Split Mode Switcher Pills */}
        <div className="absolute top-3 left-3 z-10 flex items-center bg-black/60 backdrop-blur-md rounded-full p-0.5 border border-white/20">
          <button
            onClick={() => setActivePhotoTab('before')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
              activePhotoTab === 'before' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-white/80 hover:text-white'
            }`}
          >
            Before
          </button>
          <button
            onClick={() => setActivePhotoTab('after')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
              activePhotoTab === 'after' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-white/80 hover:text-white'
            }`}
          >
            After
          </button>
          <button
            onClick={() => setActivePhotoTab('split')}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
              activePhotoTab === 'split' ? 'bg-primary text-white font-extrabold' : 'text-white/80 hover:text-white'
            }`}
          >
            Slider ↔
          </button>
        </div>

        {/* District Geotag Badge */}
        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-white/20 flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px] text-red-400">location_on</span>
          <span>{story.district}</span>
        </span>
      </div>

      {/* Story Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Domain and Resolved Date */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              {story.domain}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              {story.resolvedDate}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2">
            {story.title}
          </h3>

          {/* 2-3 Line Outcome Case-Study Summary */}
          <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3 mb-3">
            {story.detailedStory}
          </p>

          {/* Key Impact Metric Callout Box */}
          <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-800 dark:text-emerald-300 block">
              Verified Public Outcome
            </span>
            <p className="text-xs font-extrabold text-emerald-950 dark:text-emerald-100 mt-0.5">
              {story.keyMetric}
            </p>
            <span className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 font-medium block mt-0.5">
              {story.communitiesImpacted}
            </span>
          </div>
        </div>

        {/* Bottom Actions: Academic Lab, Social Shares & Case Study Trigger */}
        <div className="pt-3 border-t border-outline-variant/60 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>R&amp;D: <strong>{story.academicPartner.split('(')[0]}</strong></span>
            <span>CSR: <strong>{story.csrPartner.split(' ')[0]}</strong></span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => onOpenModal(story)}
              className="flex-1 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Read Full Case Study</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={shareWhatsApp}
                className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 flex items-center justify-center transition-colors cursor-pointer"
                title="Share on WhatsApp"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
              </button>

              <button
                onClick={shareTwitter}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                title="Share on X / Twitter"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-8 h-8 rounded-xl bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest flex items-center justify-center transition-colors cursor-pointer relative"
                title="Copy Story Link"
              >
                <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'link'}</span>
                {copied && (
                  <span className="absolute -top-7 whitespace-nowrap bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
