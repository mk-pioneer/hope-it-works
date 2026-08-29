import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const CitizenSubmitChallenge = () => {
  const { submitChallenge, navigate, setSelectedChallengeId } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [submittedId, setSubmittedId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: 'High Arsenic & Turbidity in Panchayat Tube Wells',
    category: 'Water & Sanitation',
    district: 'Bokaro',
    block: 'Peterwar',
    village: 'Chas Gram Panchayat',
    severity: 'High',
    urgency: 'High',
    submittedBy: 'Rajeshwar Mahato',
    submittedPhone: '+91 98351 44820',
    description: 'Borewells drilled deeper than 180ft in our panchayat have shown severe brownish discoloration and yellow precipitate. Over 300 families are suffering from skin keratosis and stomach ailments. Existing hand-pump mesh filters get blocked in 2 days.',
    populationAffected: '1,200+ villagers across 4 hamlets',
    currentWorkaround: 'Buying commercial 20L plastic jars from private vendors at ₹30/day, which is unaffordable for daily wage earners.',
    attachments: [
      { name: 'Water_Discoloration_Sample.jpg', size: '2.8 MB', type: 'image' },
      { name: 'PHC_Health_Doctor_Report.pdf', size: '1.4 MB', type: 'pdf' }
    ]
  });

  const districts = [
    "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum",
    "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara",
    "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu",
    "Ramgarh", "Ranchi", "Sahebganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"
  ];

  const categories = [
    "Water & Sanitation",
    "AgriTech & Livelihoods",
    "Healthcare",
    "Clean Energy",
    "Smart Urban Infra",
    "Environment & Mining",
    "Tribal Crafts & Automation",
    "Disaster Management & Safety"
  ];

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        type: f.type.includes('image') ? 'image' : 'pdf'
      }));
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = submitChallenge(formData);
    setSubmittedId(newId);
    setSelectedChallengeId(newId);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 md:px-8 py-8 w-full">
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Civic Problem Submission Portal</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">Submit a Societal Challenge</h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
          Provide complete problem context to enable state AI triage and university research lab allocation.
        </p>
      </div>

      {/* Stepper Wizard Indicator */}
      <div className="mb-8">
        <div className="grid grid-cols-4 gap-2 relative">
          {[
            { step: 1, label: "Basic Info", icon: "badge" },
            { step: 2, label: "Impact Details", icon: "description" },
            { step: 3, label: "Evidence / Media", icon: "cloud_upload" },
            { step: 4, label: "AI Review & Submit", icon: "psychology" }
          ].map(s => {
            const isCompleted = currentStep > s.step;
            const isActive = currentStep === s.step;
            return (
              <div
                key={s.step}
                onClick={() => !submittedId && setCurrentStep(s.step)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  isActive
                    ? 'border-primary bg-primary text-white shadow-md'
                    : isCompleted
                    ? 'border-emerald-500/50 bg-emerald-50 text-emerald-800'
                    : 'border-outline-variant/60 bg-surface-container-low text-on-surface-variant'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">
                    {isCompleted ? 'check_circle' : s.icon}
                  </span>
                  <span className="text-xs font-bold">Step {s.step}</span>
                </div>
                <span className="text-[11px] truncate hidden sm:inline">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission Success View Modal / Screen */}
      {submittedId ? (
        <div className="bg-surface-container-lowest border border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-xl text-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">verified</span>
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Problem Registered Successfully
          </span>

          <h2 className="text-2xl font-extrabold text-on-surface mt-3">Challenge Received by SICP System</h2>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto mt-2 leading-relaxed">
            Your problem statement has been assigned a permanent state tracking identifier and queued for automated AI duplicate checks and administrative department evaluation.
          </p>

          <div className="my-6 p-4 bg-surface-container-low rounded-2xl border border-outline-variant max-w-md mx-auto">
            <p className="text-xs text-on-surface-variant uppercase font-bold">Your Official Tracking ID</p>
            <p className="text-2xl font-mono font-extrabold text-primary my-1">{submittedId}</p>
            <p className="text-[11px] text-on-surface-variant">SMS confirmation sent to {formData.submittedPhone}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedChallengeId(submittedId);
                navigate('/citizen/track');
              }}
              className="px-6 py-3 bg-primary text-white rounded-full font-bold text-xs sm:text-sm hover:bg-primary-container shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">track_changes</span>
              <span>Track Challenge Status Live</span>
            </button>

            <button
              onClick={() => {
                setSubmittedId(null);
                setCurrentStep(1);
              }}
              className="px-6 py-3 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-high rounded-full font-bold text-xs sm:text-sm text-on-surface flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Submit Another Problem</span>
            </button>
          </div>
        </div>
      ) : (
        /* Multi-step Form Box */
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit}>
            {/* STEP 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-outline-variant/60 pb-3">
                  <h3 className="text-base font-bold text-on-surface">Step 1: Challenge Identification &amp; Location</h3>
                  <p className="text-xs text-on-surface-variant">Define the title, sector category, and administrative geography.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1.5">Problem Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g. Solar Cold Storage for Lac Cultivators or Arsenic in Water..."
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1.5">Sector Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      {categories.map((cat, i) => (
                        <option key={i} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1.5">District (Jharkhand) *</label>
                    <select
                      value={formData.district}
                      onChange={(e) => handleChange('district', e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      {districts.map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1.5">Block / Tehsil *</label>
                    <input
                      type="text"
                      required
                      value={formData.block}
                      onChange={(e) => handleChange('block', e.target.value)}
                      placeholder="e.g. Peterwar / Murhu / Manoharpur"
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1.5">Village / Gram Panchayat *</label>
                    <input
                      type="text"
                      required
                      value={formData.village}
                      onChange={(e) => handleChange('village', e.target.value)}
                      placeholder="e.g. Bandgaon / Chas Panchayat"
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.submittedBy}
                      onChange={(e) => handleChange('submittedBy', e.target.value)}
                      placeholder="Rajeshwar Mahato"
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1.5">Contact Phone (for SMS updates) *</label>
                    <input
                      type="tel"
                      required
                      value={formData.submittedPhone}
                      onChange={(e) => handleChange('submittedPhone', e.target.value)}
                      placeholder="+91 98351 44820"
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-primary-container shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Impact Details</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Problem Description & Impact */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-outline-variant/60 pb-3">
                  <h3 className="text-base font-bold text-on-surface">Step 2: Problem Description &amp; Societal Impact</h3>
                  <p className="text-xs text-on-surface-variant">Explain the roots of the issue, who is affected, and current challenges.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1.5">Detailed Problem Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe what is failing, when it happens, and what kind of technical or scientific solution is required..."
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1.5">Estimated Population Affected *</label>
                    <input
                      type="text"
                      required
                      value={formData.populationAffected}
                      onChange={(e) => handleChange('populationAffected', e.target.value)}
                      placeholder="e.g. 500 households / 2,000 farmers"
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1.5">Severity &amp; Risk Level *</label>
                    <select
                      value={formData.severity}
                      onChange={(e) => handleChange('severity', e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="Critical">Critical (Direct Health / Life / Safety Risk)</option>
                      <option value="High">High (Major Economic / Livelihood Loss)</option>
                      <option value="Medium">Medium (Chronic Inefficiency / Distress)</option>
                      <option value="Low">Low (Convenience / Incremental Improvement)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1.5">Current Workaround or Temporary Fix (if any)</label>
                  <input
                    type="text"
                    value={formData.currentWorkaround}
                    onChange={(e) => handleChange('currentWorkaround', e.target.value)}
                    placeholder="e.g. Buying water jars at high cost, manually boiling water..."
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 border border-outline-variant font-semibold rounded-xl text-xs text-on-surface hover:bg-surface-container-high"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-primary-container shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Evidence Upload</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Supporting Evidence & Media */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-outline-variant/60 pb-3">
                  <h3 className="text-base font-bold text-on-surface">Step 3: Upload Evidence &amp; Field Media</h3>
                  <p className="text-xs text-on-surface-variant">Attach lab tests, site photographs, videos, or GPS coordinates.</p>
                </div>

                {/* File Dropzone */}
                <div className="border-2 border-dashed border-outline-variant hover:border-primary rounded-2xl p-6 text-center bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2">cloud_upload</span>
                  <p className="text-xs sm:text-sm font-bold text-on-surface">Drag and drop files here, or browse from computer</p>
                  <p className="text-[11px] text-on-surface-variant mt-1">Supports JPG, PNG, PDF, DOCX up to 25MB each</p>
                  <label className="mt-3 inline-block px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs font-bold text-primary hover:bg-surface-container-high cursor-pointer shadow-xs">
                    Choose Files
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Uploaded Files List */}
                {formData.attachments.length > 0 && (
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-2">Attached Documents &amp; Photos ({formData.attachments.length})</label>
                    <div className="space-y-2">
                      {formData.attachments.map((att, idx) => (
                        <div key={idx} className="p-2.5 bg-surface rounded-xl border border-outline-variant flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[18px]">
                              {att.type === 'pdf' ? 'picture_as_pdf' : 'image'}
                            </span>
                            <span className="text-xs font-medium text-on-surface">{att.name}</span>
                            <span className="text-[10px] text-on-surface-variant">({att.size})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                attachments: prev.attachments.filter((_, i) => i !== idx)
                              }));
                            }}
                            className="text-error hover:bg-error/10 p-1 rounded-lg"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* GPS Location Simulation Tag */}
                <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-700">my_location</span>
                    <span>GPS Geotag: <strong>23.6693° N, 85.9592° E</strong> ({formData.village}, {formData.district})</span>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-200/80 px-2 py-0.5 rounded text-blue-800">Auto-Tagged</span>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 border border-outline-variant font-semibold rounded-xl text-xs text-on-surface hover:bg-surface-container-high"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-primary-container shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to AI Triage Preview</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: AI Pre-Evaluation & Review */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-outline-variant/60 pb-3">
                  <h3 className="text-base font-bold text-on-surface">Step 4: Real-time AI Triage &amp; Review</h3>
                  <p className="text-xs text-on-surface-variant">Review preliminary AI matching scores and submit for department approval.</p>
                </div>

                {/* AI Intelligence Card */}
                <div className="p-4 bg-primary-fixed/40 border border-primary-fixed-dim rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                    <h4 className="text-xs font-bold text-on-primary-fixed uppercase tracking-wider">AI Pre-Evaluation Assessment</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-surface-container-lowest p-3 rounded-xl">
                      <span className="text-[11px] text-on-surface-variant block">Category Match</span>
                      <strong className="text-primary font-bold">{formData.category} (98% confidence)</strong>
                    </div>
                    <div className="bg-surface-container-lowest p-3 rounded-xl">
                      <span className="text-[11px] text-on-surface-variant block">Severity Score</span>
                      <strong className="text-amber-700 font-bold">92 / 100 ({formData.severity})</strong>
                    </div>
                    <div className="bg-surface-container-lowest p-3 rounded-xl">
                      <span className="text-[11px] text-on-surface-variant block">Recommended Lab</span>
                      <strong className="text-emerald-700 font-bold">BIT Mesra / IIT ISM</strong>
                    </div>
                  </div>
                </div>

                {/* Summary Recap */}
                <div className="bg-surface p-4 rounded-2xl border border-outline-variant space-y-3 text-xs">
                  <div>
                    <span className="text-on-surface-variant">Title:</span>
                    <p className="font-bold text-on-surface text-sm mt-0.5">{formData.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-on-surface-variant">Location:</span>
                      <p className="font-semibold text-on-surface">{formData.village}, {formData.block}, {formData.district}</p>
                    </div>
                    <div>
                      <span className="text-on-surface-variant">Submitted By:</span>
                      <p className="font-semibold text-on-surface">{formData.submittedBy} ({formData.submittedPhone})</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-on-surface-variant">Problem Summary:</span>
                    <p className="text-on-surface leading-relaxed mt-0.5">{formData.description}</p>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2.5 border border-outline-variant font-semibold rounded-xl text-xs text-on-surface hover:bg-surface-container-high"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-secondary text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-secondary-container shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">check</span>
                    <span>Confirm &amp; Submit Challenge</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
