import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Backend API Service Layer for SICP Jharkhand
 * Provides seamless integration with Supabase PostgreSQL and Realtime Channels,
 * with automatic resilient caching if Supabase credentials are in demo mode.
 */

// -----------------------------------------------------------------------------------
// 1. CHALLENGES API
// -----------------------------------------------------------------------------------

export const fetchChallengesApi = async (fallbackData = []) => {
  if (!isSupabaseConfigured || !supabase) {
    return fallbackData;
  }

  try {
    const { data, error } = await supabase
      .from('challenges')
      .select(`
        *,
        milestones (*),
        challenge_updates (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(item => ({
        id: item.custom_id,
        db_id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        district: item.district,
        block: item.block,
        village: item.village,
        severity: item.severity,
        urgency: item.urgency,
        status: item.status,
        submittedBy: item.submitted_by,
        submittedPhone: item.submitted_phone,
        submittedAt: item.submitted_at,
        assignedUniversity: item.assigned_university,
        assignedFaculty: item.assigned_faculty,
        studentTeam: item.student_team,
        grantAllocated: Number(item.grant_allocated) || 0,
        grantDisbursed: Number(item.grant_disbursed) || 0,
        upvotes: item.upvotes || 0,
        duplicatesDetected: item.duplicates_detected || 0,
        aiCategoryScore: item.ai_category_score || 95,
        aiSeverityScore: item.ai_severity_score || 80,
        csrPledged: Number(item.csr_pledged) || 0,
        industryCollaborators: item.industry_collaborators || [],
        milestones: item.milestones?.map(m => ({
          id: m.id,
          title: m.title,
          status: m.status,
          date: m.target_date,
          notes: m.notes,
          order: m.order_idx
        })) || [],
        updates: item.challenge_updates?.map(u => ({
          id: u.id,
          timestamp: u.timestamp_str,
          message: u.message,
          author: u.author
        })) || []
      }));
    }
    return fallbackData;
  } catch (err) {
    console.warn('[Supabase API] fetchChallenges fallback:', err.message);
    return fallbackData;
  }
};

export const createChallengeApi = async (challengeData) => {
  const customId = `JH-2026-CHAL-${Math.floor(1000 + Math.random() * 9000)}`;

  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        custom_id: customId,
        title: challengeData.title,
        description: challengeData.description,
        category: challengeData.category || "General Societal Need",
        district: challengeData.district || "Ranchi",
        block: challengeData.block || "Sadar",
        village: challengeData.village || "Local Panchayat",
        severity: challengeData.severity || "Medium",
        urgency: challengeData.urgency || "Medium",
        status: "Submitted",
        submitted_by: challengeData.submittedBy || "Citizen User",
        submitted_phone: challengeData.submittedPhone || "+91 98765 43210",
        ai_category_score: 95,
        ai_severity_score: challengeData.severity === "Critical" ? 96 : challengeData.severity === "High" ? 85 : 70
      };

      const { data, error } = await supabase.from('challenges').insert([payload]).select().single();
      if (error) throw error;

      // Add initial update log
      if (data?.id) {
        await supabase.from('challenge_updates').insert([{
          challenge_id: data.id,
          author: "Citizen Portal",
          message: "Problem challenge submitted successfully via SICP Jharkhand Citizen portal.",
          timestamp_str: new Date().toLocaleString()
        }]);

        // Add AI Notification
        await supabase.from('ai_notifications').insert([{
          notif_type: 'new_submission',
          title: `New Challenge: ${payload.title.substring(0, 45)}...`,
          description: `Submitted by ${payload.submitted_by} from ${payload.district}. Auto-classified as ${payload.category}.`,
          severity: payload.severity === 'Critical' ? 'critical' : 'info',
          challenge_id: customId,
          timestamp_str: 'Just now'
        }]);
      }
    } catch (err) {
      console.warn('[Supabase API] createChallenge fallback:', err.message);
    }
  }

  return customId;
};

export const assignChallengeApi = async (challengeId, universityName, grantAmount, facultyGuide) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: challenge } = await supabase
        .from('challenges')
        .select('id')
        .eq('custom_id', challengeId)
        .single();

      if (challenge?.id) {
        // Update challenge
        await supabase.from('challenges').update({
          status: 'Assigned',
          assigned_university: universityName,
          assigned_faculty: facultyGuide || 'Faculty Lead & Innovation Cell',
          grant_allocated: Number(grantAmount) || 400000,
          grant_disbursed: Number(grantAmount) * 0.5 || 200000,
          updated_at: new Date().toISOString()
        }).eq('id', challenge.id);

        // Insert default milestones
        const defaultMilestones = [
          { challenge_id: challenge.id, title: "Literature Review & Problem Formulation", status: "completed", target_date: new Date().toISOString().split('T')[0], notes: "Institutional R&D approval", order_idx: 1 },
          { challenge_id: challenge.id, title: "Hardware / Software Prototype Build", status: "in-progress", target_date: "Upcoming (4 weeks)", notes: "Lab experimentation", order_idx: 2 },
          { challenge_id: challenge.id, title: "Field Testing & Panchayat Pilot", status: "pending", target_date: "Upcoming (8 weeks)", notes: "Community trial", order_idx: 3 },
          { challenge_id: challenge.id, title: "Final Evaluation & Deployment", status: "pending", target_date: "Upcoming (12 weeks)", notes: "Handover to department", order_idx: 4 }
        ];
        await supabase.from('milestones').insert(defaultMilestones);

        // Add timeline update
        await supabase.from('challenge_updates').insert([{
          challenge_id: challenge.id,
          author: "SICP Admin",
          message: `Assigned to ${universityName} with State Innovation Grant of ₹${(Number(grantAmount) / 100000).toFixed(1)} Lakhs.`,
          timestamp_str: new Date().toLocaleString()
        }]);

        // Add AI Notification
        await supabase.from('ai_notifications').insert([{
          notif_type: 'assignment_dispatched',
          title: `Challenge ${challengeId} Assigned to ${universityName}`,
          description: `Grant allocation of ₹${(Number(grantAmount) / 100000).toFixed(1)} Lakhs issued. Notification dispatched to Dean of R&D.`,
          severity: 'success',
          challenge_id: challengeId,
          timestamp_str: 'Just now'
        }]);
      }
    } catch (err) {
      console.warn('[Supabase API] assignChallenge fallback:', err.message);
    }
  }
};

export const updateMilestoneApi = async (challengeId, milestoneIdx, newStatus, notes) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: challenge } = await supabase
        .from('challenges')
        .select('id')
        .eq('custom_id', challengeId)
        .single();

      if (challenge?.id) {
        const { data: milestones } = await supabase
          .from('milestones')
          .select('id')
          .eq('challenge_id', challenge.id)
          .order('order_idx', { ascending: true });

        if (milestones && milestones[milestoneIdx]) {
          await supabase.from('milestones').update({
            status: newStatus,
            notes: notes || undefined,
            updated_at: new Date().toISOString()
          }).eq('id', milestones[milestoneIdx].id);
        }

        // Add log
        await supabase.from('challenge_updates').insert([{
          challenge_id: challenge.id,
          author: "University Innovation Cell",
          message: `Milestone updated to ${newStatus}.`,
          timestamp_str: new Date().toLocaleString()
        }]);
      }
    } catch (err) {
      console.warn('[Supabase API] updateMilestone fallback:', err.message);
    }
  }
};

export const pledgeCsrApi = async (challengeId, companyName, amount, contactPerson) => {
  const pledgeVal = Number(amount) || 200000;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: challenge } = await supabase
        .from('challenges')
        .select('id, csr_pledged, industry_collaborators')
        .eq('custom_id', challengeId)
        .single();

      if (challenge?.id) {
        const collabs = challenge.industry_collaborators || [];
        const updatedCollabs = collabs.includes(companyName) ? collabs : [...collabs, companyName];

        await supabase.from('challenges').update({
          csr_pledged: (Number(challenge.csr_pledged) || 0) + pledgeVal,
          industry_collaborators: updatedCollabs,
          updated_at: new Date().toISOString()
        }).eq('id', challenge.id);

        await supabase.from('csr_contributions').insert([{
          challenge_id: challenge.id,
          company_name: companyName,
          amount: pledgeVal,
          contact_person: contactPerson || 'CSR Lead'
        }]);

        await supabase.from('challenge_updates').insert([{
          challenge_id: challenge.id,
          author: "Industry CSR Hub",
          message: `${companyName} pledged CSR grant of ₹${(pledgeVal / 100000).toFixed(1)} Lakhs.`,
          timestamp_str: new Date().toLocaleString()
        }]);
      }
    } catch (err) {
      console.warn('[Supabase API] pledgeCsr fallback:', err.message);
    }
  }
};

export const upvoteChallengeApi = async (challengeId) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from('challenges')
        .select('id, upvotes')
        .eq('custom_id', challengeId)
        .single();

      if (data?.id) {
        await supabase.from('challenges').update({
          upvotes: (data.upvotes || 0) + 1
        }).eq('id', data.id);
      }
    } catch (err) {
      console.warn('[Supabase API] upvoteChallenge fallback:', err.message);
    }
  }
};

// -----------------------------------------------------------------------------------
// 2. UNIVERSITIES & INDUSTRY API
// -----------------------------------------------------------------------------------

export const fetchUniversitiesApi = async (fallbackData = []) => {
  if (!isSupabaseConfigured || !supabase) return fallbackData;

  try {
    const { data, error } = await supabase.from('universities').select('*').order('name');
    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(u => ({
        id: u.code,
        db_id: u.id,
        name: u.name,
        location: u.location,
        type: u.type,
        focalAreas: u.focal_areas || [],
        activeProjects: u.active_projects || 0,
        completedPilots: u.completed_pilots || 0,
        grantsReceived: Number(u.grants_received) || 0,
        facultyRoster: u.faculty_roster || 0,
        studentInnovators: u.student_innovators || 0,
        performanceRating: Number(u.performance_rating) || 4.5,
        deanContact: u.dean_contact,
        logo: u.logo_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDVKSoxm6Jg6NjlHp9Qw8MP29E2Oh_zZNa8mkZDESeprpdod0TbqE9-Ozldtu2dyD2nmmj7wbtqf7W-2ti15A5Nl9OoDS8Z8MazRtZbljBLmvRWTaneM-5lsb7YBAQZFRigNYKu9tiWSkbFy4fkdvj5vdvyJ-z0h1OKlsebKLjl70Y8pbin5V88r2ramssJxeHFP1Qht0mjjSGGXs8L_KR0Lru3vkCAEKY5qZO5MwfhLSNo8L8lQv3AAQ"
      }));
    }
    return fallbackData;
  } catch (err) {
    console.warn('[Supabase API] fetchUniversities fallback:', err.message);
    return fallbackData;
  }
};

export const fetchIndustryPledgesApi = async (fallbackData = []) => {
  if (!isSupabaseConfigured || !supabase) return fallbackData;

  try {
    const { data, error } = await supabase.from('industry_pledges').select('*').order('created_at');
    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(p => ({
        id: p.id,
        company: p.company_name,
        focus: p.focus_area,
        totalCommitted: Number(p.total_committed) || 0,
        disbursed: Number(p.disbursed) || 0,
        activeCollabs: p.active_collabs || 0,
        leadContact: p.lead_contact,
        csrPillar: p.csr_pillar
      }));
    }
    return fallbackData;
  } catch (err) {
    console.warn('[Supabase API] fetchIndustryPledges fallback:', err.message);
    return fallbackData;
  }
};

// -----------------------------------------------------------------------------------
// 3. REALTIME SUBSCRIPTIONS
// -----------------------------------------------------------------------------------

export const subscribeToRealtimeUpdates = (onChallengeChange, onNotificationChange) => {
  if (!isSupabaseConfigured || !supabase) {
    return () => {};
  }

  try {
    const channel = supabase
      .channel('public:sicp_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges' }, payload => {
        if (onChallengeChange) onChallengeChange(payload);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_notifications' }, payload => {
        if (onNotificationChange) onNotificationChange(payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('[Supabase API] Realtime subscription error:', err.message);
    return () => {};
  }
};
