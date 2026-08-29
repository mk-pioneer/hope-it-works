import React from 'react';

export const StatusBadge = ({ status, size = "md" }) => {
  const getStyle = () => {
    switch (status) {
      case 'Submitted':
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200';
      case 'Under Review':
      case 'In Review':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200';
      case 'Approved':
      case 'Assigned':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-200';
      case 'Prototyping':
      case 'In Prototyping':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-200';
      case 'Field Pilot':
        return 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950 dark:text-teal-200';
      case 'Deployed':
      case 'Completed':
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200';
      case 'Duplicate Cluster':
      case 'Duplicate Detected':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'Submitted':
      case 'New':
        return 'send';
      case 'Under Review':
      case 'In Review':
        return 'rate_review';
      case 'Approved':
      case 'Assigned':
        return 'school';
      case 'Prototyping':
      case 'In Prototyping':
        return 'biotech';
      case 'Field Pilot':
        return 'science';
      case 'Deployed':
      case 'Completed':
      case 'Resolved':
        return 'verified';
      case 'Duplicate Cluster':
      case 'Duplicate Detected':
        return 'psychology';
      default:
        return 'info';
    }
  };

  const pad = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${getStyle()} ${pad}`}>
      <span className="material-symbols-outlined text-[14px]">{getIcon()}</span>
      <span>{status}</span>
    </span>
  );
};
