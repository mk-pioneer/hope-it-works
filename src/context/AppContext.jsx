import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchChallengesApi,
  createChallengeApi,
  assignChallengeApi,
  updateMilestoneApi,
  pledgeCsrApi,
  upvoteChallengeApi,
  fetchUniversitiesApi,
  fetchIndustryPledgesApi,
  subscribeToRealtimeUpdates
} from '../services/api';
import { isSupabaseConfigured, checkSupabaseConnection } from '../services/supabaseClient';

const AppContext = createContext();

const initialChallenges = [
  {
    id: "JH-2026-CHAL-8921",
    title: "Groundwater Fluoride & Arsenic Contamination in Rural Bokaro Tube Wells",
    description: "Deep borewells across 14 panchayats in Peterwar block have recorded fluoride levels exceeding 3.2 mg/L (WHO standard: 1.5 mg/L), causing severe dental and skeletal fluorosis among children and elderly citizens. Standard RO units clog rapidly due to high turbidity.",
    category: "Water & Sanitation",
    district: "Bokaro",
    block: "Peterwar",
    village: "Chas-Bokaro Border",
    severity: "Critical",
    urgency: "High",
    status: "Prototyping",
    submittedBy: "Rajeshwar Mahato",
    submittedPhone: "+91 98351 44820",
    submittedAt: "2026-08-12",
    assignedUniversity: "BIT Mesra",
    assignedFaculty: "Dr. Anirban Mukherjee (Dept. of Chemical & Bio-Engineering)",
    studentTeam: "Team Jal-Shuddhi (4 M.Tech Researchers)",
    grantAllocated: 450000,
    grantDisbursed: 270000,
    upvotes: 342,
    duplicatesDetected: 4,
    aiCategoryScore: 98,
    aiSeverityScore: 94,
    attachments: [
      { name: "Water_Quality_Lab_Report_Bokaro.pdf", size: "2.4 MB", type: "pdf" },
      { name: "Tube_Well_Site_Photo_1.jpg", size: "3.8 MB", type: "image" }
    ],
    milestones: [
      { title: "Field Sampling & Spectrometry Analysis", status: "completed", date: "2026-08-18", notes: "Samples collected from 22 borewells" },
      { title: "Low-Cost Nano-Adsorbent Cartridge Synthesis", status: "completed", date: "2026-08-25", notes: "Achieved 99.1% fluoride extraction at lab scale" },
      { title: "Gravity-Fed Community Filter Pilot Unit", status: "in-progress", date: "2026-09-05", notes: "Fabrication of 500 LPH pilot unit underway" },
      { title: "Field Trial & Water Testing at Peterwar PHC", status: "pending", date: "2026-09-20", notes: "15-day continuous run validation" },
      { title: "State-wide Scalability & Manufacturing Handover", status: "pending", date: "2026-10-15", notes: "CSR scaling partner tie-up" }
    ],
    industryCollaborators: ["Tata Steel CSR Foundation"],
    csrPledged: 300000,
    updates: [
      { timestamp: "2026-08-26 14:30", message: "BIT Mesra lab tests confirm 0.4 mg/L residual fluoride from 3.8 mg/L inlet water using novel bauxite-derived matrix.", author: "Dr. Anirban Mukherjee" },
      { timestamp: "2026-08-20 11:15", message: "Initial state grant of ₹2.7 Lakhs released to BIT Mesra Innovation Cell.", author: "Dept. of Drinking Water & Sanitation" },
      { timestamp: "2026-08-14 09:00", message: "Challenge validated and approved by Admin for University R&D matching.", author: "SICP Admin" }
    ]
  },
  {
    id: "JH-2026-CHAL-8922",
    title: "Solar-Powered Cold Storage & Lac Resin Drying Units for Tribal Farmers",
    description: "Tribal lac cultivators in Khunti & Simdega face over 35% post-harvest spoilage and quality degradation due to high humidity and lack of decentralized drying infrastructure. Cultivators are forced to distress-sell raw lac to middlemen at low prices.",
    category: "AgriTech & Livelihoods",
    district: "Khunti",
    block: "Murhu",
    village: "Bandgaon",
    severity: "High",
    urgency: "High",
    status: "Under Review",
    submittedBy: "Sunita Munda",
    submittedPhone: "+91 87890 12345",
    submittedAt: "2026-08-24",
    assignedUniversity: null,
    assignedFaculty: null,
    studentTeam: null,
    grantAllocated: 0,
    grantDisbursed: 0,
    upvotes: 189,
    duplicatesDetected: 2,
    aiCategoryScore: 96,
    aiSeverityScore: 88,
    attachments: [
      { name: "Khunti_Lac_Production_Stats.pdf", size: "1.8 MB", type: "pdf" }
    ],
    milestones: [],
    industryCollaborators: [],
    csrPledged: 0,
    updates: [
      { timestamp: "2026-08-24 16:45", message: "Challenge submitted and tagged under AgriTech & Tribal Livelihood by AI.", author: "AI Triage System" }
    ]
  },
  {
    id: "JH-2026-CHAL-8923",
    title: "Low-cost Tele-ECG & AI Diagnosis Unit for Primary Health Centers (PHCs)",
    description: "Rural PHCs in Saranda forest zone (West Singhbhum) lack cardiologists. Patients experiencing acute myocardial infarction travel 90km to Chaibasa or Jamshedpur, losing the crucial golden hour. Need portable 12-lead ECG with GSM telemetry and automated arrhythmia alert.",
    category: "Healthcare",
    district: "West Singhbhum",
    block: "Manoharpur",
    village: "Chiria",
    severity: "Critical",
    urgency: "Critical",
    status: "Assigned",
    submittedBy: "Dr. Alok Verma (Medical Officer)",
    submittedPhone: "+91 94311 77210",
    submittedAt: "2026-08-16",
    assignedUniversity: "IIT (ISM) Dhanbad",
    assignedFaculty: "Prof. Sudeshna Roy (Dept. of Electronics & Biomedical)",
    studentTeam: "CardioAI Innovations",
    grantAllocated: 600000,
    grantDisbursed: 300000,
    upvotes: 412,
    duplicatesDetected: 1,
    aiCategoryScore: 99,
    aiSeverityScore: 97,
    attachments: [
      { name: "PHC_Emergency_Referral_Log.pdf", size: "1.2 MB", type: "pdf" }
    ],
    milestones: [
      { title: "Compact 12-lead Hardware PCB Prototyping", status: "completed", date: "2026-08-22", notes: "Low-noise amplifier and Bluetooth/GSM microcontroller assembled" },
      { title: "Edge-AI Arrhythmia Detection Neural Net Training", status: "in-progress", date: "2026-09-08", notes: "Model trained on PTB-XL database achieving 97.4% precision" },
      { title: "Clinical Trial at Dhanbad Medical College Hospital", status: "pending", date: "2026-09-28", notes: "Dual verification against standard GE Healthcare ECG" },
      { title: "5 PHC Pilot Rollout in West Singhbhum", status: "pending", date: "2026-10-20", notes: "Device deployment with paramedic training" }
    ],
    industryCollaborators: ["JSW Foundation"],
    csrPledged: 250000,
    updates: [
      { timestamp: "2026-08-22 10:00", message: "Hardware schematic approved by state health innovation council.", author: "IIT ISM Innovation Cell" }
    ]
  },
  {
    id: "JH-2026-CHAL-8924",
    title: "Smart IoT Water Distribution & Leakage Monitoring in Ranchi Municipal Area",
    description: "Non-Revenue Water (NRW) in Ranchi urban zones accounts for 42% loss due to unmonitored underground pipeline bursts and illegal tapping, leading to severe shortages in Harmu and Doranda localities during summer months.",
    category: "Smart Urban Infra",
    district: "Ranchi",
    block: "Ranchi Urban",
    village: "Doranda & Harmu",
    severity: "Medium",
    urgency: "Medium",
    status: "Field Pilot",
    submittedBy: "Citizens Welfare Forum Ranchi",
    submittedPhone: "+91 97714 55601",
    submittedAt: "2026-07-28",
    assignedUniversity: "NIT Jamshedpur",
    assignedFaculty: "Dr. K. S. Raman (Dept. of Civil & IoT)",
    studentTeam: "SmartFlow NITJ",
    grantAllocated: 800000,
    grantDisbursed: 650000,
    upvotes: 560,
    duplicatesDetected: 6,
    aiCategoryScore: 95,
    aiSeverityScore: 82,
    attachments: [
      { name: "RMC_Pipeline_Layout_Map.pdf", size: "4.1 MB", type: "pdf" }
    ],
    milestones: [
      { title: "Acoustic & Pressure IoT Sensor Nodes Fabricated", status: "completed", date: "2026-08-05", notes: "40 solar-assisted NB-IoT sensor modules built" },
      { title: "Cloud Telemetry & GIS Dashboard Integration", status: "completed", date: "2026-08-15", notes: "Live pressure contour mapping activated" },
      { title: "Ward 12 & 14 Pilot Pipeline Installation", status: "completed", date: "2026-08-25", notes: "3 major leakages pinpointed within 48 hours" },
      { title: "RMC Control Room Integration & SOP Transfer", status: "in-progress", date: "2026-09-12", notes: "Automated valve shutoff trigger calibration" }
    ],
    industryCollaborators: ["Coal India Ltd / CCL CSR", "Tata Steel"],
    csrPledged: 500000,
    updates: [
      { timestamp: "2026-08-25 18:00", message: "Pilot sensor network successfully detected 2 underground leakages saving estimated 80,000 liters/day.", author: "NIT Jamshedpur" }
    ]
  },
  {
    id: "JH-2026-CHAL-8925",
    title: "Eco-Friendly Biomass Briquetting from Mahua Flower & Sal Leaf Processing Waste",
    description: "Over 60,000 quintals of organic residue from Mahua collection and Sal leaf plate manufacture is openly burnt or dumped in Santhal Pargana, causing particulate pollution while rural brick kilns continue to burn low-grade coal.",
    category: "Clean Energy",
    district: "Dumka",
    block: "Jama",
    village: "Barmasia",
    severity: "Medium",
    urgency: "Medium",
    status: "Submitted",
    submittedBy: "Tribal SHG Federation Dumka",
    submittedPhone: "+91 93041 88902",
    submittedAt: "2026-08-27",
    assignedUniversity: null,
    assignedFaculty: null,
    studentTeam: null,
    grantAllocated: 0,
    grantDisbursed: 0,
    upvotes: 95,
    duplicatesDetected: 0,
    aiCategoryScore: 94,
    aiSeverityScore: 78,
    attachments: [],
    milestones: [],
    industryCollaborators: [],
    csrPledged: 0,
    updates: [
      { timestamp: "2026-08-27 11:20", message: "New submission received via SICP Citizen Portal.", author: "System" }
    ]
  },
  {
    id: "JH-2026-CHAL-8926",
    title: "Real-Time Acid Mine Drainage & Heavy Metal Detection in Damodar River Basin",
    description: "Continuous coal washing runoff and overburden leachate in Jharia and Katras coalfields leads to high sulfate and heavy metal acidity in Damodar tributaries. Local agricultural irrigation is impaired.",
    category: "Environment & Mining",
    district: "Dhanbad",
    block: "Jharia",
    village: "Katras-Jharia Belt",
    severity: "Critical",
    urgency: "High",
    status: "Duplicate Cluster",
    submittedBy: "Pravin Kishore (Environmental Activist)",
    submittedPhone: "+91 98350 99124",
    submittedAt: "2026-08-26",
    assignedUniversity: null,
    assignedFaculty: null,
    studentTeam: null,
    grantAllocated: 0,
    grantDisbursed: 0,
    upvotes: 215,
    duplicatesDetected: 5,
    aiCategoryScore: 97,
    aiSeverityScore: 93,
    attachments: [],
    milestones: [],
    industryCollaborators: [],
    csrPledged: 0,
    updates: [
      { timestamp: "2026-08-26 15:10", message: "AI Duplicate Engine clustered 5 similar reports across Dhanbad & Bokaro borders.", author: "AI Intelligence" }
    ]
  }
];

const initialUniversities = [
  {
    id: "univ-bit-mesra",
    name: "BIT Mesra (Birla Institute of Technology)",
    location: "Ranchi, Jharkhand",
    type: "Deemed University / Institute of National Repute",
    focalAreas: ["Water Purification", "Robotics & IoT", "Bio-Engineering", "Remote Sensing"],
    activeProjects: 8,
    completedPilots: 14,
    grantsReceived: 3850000,
    facultyRoster: 42,
    studentInnovators: 180,
    performanceRating: 4.9,
    deanContact: "Prof. S. K. Ghorai (Dean R&D & Innovation)",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVKSoxm6Jg6NjlHp9Qw8MP29E2Oh_zZNa8mkZDESeprpdod0TbqE9-Ozldtu2dyD2nmmj7wbtqf7W-2ti15A5Nl9OoDS8Z8MazRtZbljBLmvRWTaneM-5lsb7YBAQZFRigNYKu9tiWSkbFy4fkdvj5vdvyJ-z0h1OKlsebKLjl70Y8pbin5V88r2ramssJxeHFP1Qht0mjjSGGXs8L_KR0Lru3vkCAEKY5qZO5MwfhLSNo8L8lQv3AAQ"
  },
  {
    id: "univ-iit-dhanbad",
    name: "IIT (ISM) Dhanbad",
    location: "Dhanbad, Jharkhand",
    type: "Institute of National Importance",
    focalAreas: ["Clean Energy & Minerals", "Biomedical Devices", "AI & Telemetry", "Groundwater Hydrology"],
    activeProjects: 12,
    completedPilots: 22,
    grantsReceived: 6200000,
    facultyRoster: 65,
    studentInnovators: 290,
    performanceRating: 4.95,
    deanContact: "Prof. Sagar Pal (Dean R&D)",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHR8MGWxzND1IrC13wjyrzYjTl-d8aHewREhcePNIo-JeOA8x7m5SEQY-_fdDfYadnHLj_Lvqy9KEqHZ91ojjK9_ug9l1AZ70dayD1ef2nYz_OQWxmhmzE_sigw_YsneAOc1GpGHKN4KfNkTLznzM7pg9x4vEcPmYHOC_65_TLjTf2WWoJFi8xIFkfv0EEwSjQHyfZWl_D2JmVOfCLErskMWuVsGx_7fS6HBiUu8tMBhlQ59c1EBwGdg"
  },
  {
    id: "univ-nit-jamshedpur",
    name: "NIT Jamshedpur",
    location: "Jamshedpur, Jharkhand",
    type: "National Institute of Technology",
    focalAreas: ["Smart Urban Infrastructure", "Electric Vehicles", "Structural Health", "Industrial Automation"],
    activeProjects: 6,
    completedPilots: 11,
    grantsReceived: 2900000,
    facultyRoster: 38,
    studentInnovators: 140,
    performanceRating: 4.8,
    deanContact: "Prof. Sanjay Kumar (Dean Academic & Innovation)",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHrnhkGJBXVcZiVylN4dlK_P5DYadi39QQ15iC3IDUkVSmsePuItLrrlCPLnOQy4UOaZQWEw7Gr7Oc2E7IdaXouzWU4bobueCgctXHWcreqqPQXHjkLOSCET8Mw7mDVb6sVWxzlFuA5DXkrhj9ErvG6pRgKkUMFkBTOKOtm4jw2C7C62EdcJfuuABduM4x6gTsyT1NlRmY06_oifyciewSkHu7Q_pQirSZNIAmVqEjxB77KLN1sWTwJQ"
  },
  {
    id: "univ-bau-ranchi",
    name: "Birsa Agricultural University (BAU)",
    location: "Kanke, Ranchi",
    type: "State Agricultural University",
    focalAreas: ["Post-Harvest AgriTech", "Tribal Livelihoods", "Organic Biostimulants", "Drought Resistance Crops"],
    activeProjects: 5,
    completedPilots: 9,
    grantsReceived: 2100000,
    facultyRoster: 29,
    studentInnovators: 95,
    performanceRating: 4.7,
    deanContact: "Dr. P. K. Singh (Director of Research)",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6GvNwijB_EX06T1ejjM1ifX7iVQhESt0MIsAs8l9JX6s_RgMfzFWrwBJvbfzKpOh5r97SZ5O143GPEKi8-UYBrGHHlN7xEIQaHSj_uIw6oFk4Gu7PXXdJfriE8Q-IIcNEBLj6VYUuT-Ccs02yle5ozulir95WigocuKmIx9qMWrON208uc-Ly9E5wkzn81L6oG3-A7f6SdYYkmNI1YVkKWC4qKCsRaIXnE-9-NHrEf3yv0Onpxp4FMw"
  },
  {
    id: "univ-ranchi-tribal",
    name: "Ranchi University - Centre for Tribal & Societal Innovation",
    location: "Ranchi, Jharkhand",
    type: "State University Innovation Centre",
    focalAreas: ["Indigenous Medicinal Plant Processing", "Lac & Silk Technology", "Rural Ergonomics"],
    activeProjects: 4,
    completedPilots: 6,
    grantsReceived: 1400000,
    facultyRoster: 22,
    studentInnovators: 75,
    performanceRating: 4.65,
    deanContact: "Prof. Jyoti Kumar (Coordinator Innovation Cell)",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjc8IGFZ25tuO9HPur_WKca58FzoB_jVbsBdzSOR7Bt3lhRiQonKFaVK09_ixLKjW2Hbes9p4fyS9t3PeH1tzP9aZAQD3XdErfkBBEYGGwhivRPaBahR9FY_IrlbdGmdEqBUFZ_hfKwy_E9lqHL_s2T5zje89Q5H7A0cPv5HG9u1Di9Kqm3XXwnzDipXKaYaKM7FkkvX4zcechtsx1E3qcbyD0BXuCrjfTtQUz01pUfcSBTo7-788p1A"
  }
];

const initialIndustryPledges = [
  {
    id: "pledge-tata-01",
    company: "Tata Steel Foundation",
    focus: "Water Purification & Tribal Rural Health",
    totalCommitted: 4500000,
    disbursed: 2800000,
    activeCollabs: 6,
    leadContact: "Sourav Roy (Chief CSR, Tata Steel)",
    csrPillar: "National Schedule VII - Healthcare & Safe Drinking Water"
  },
  {
    id: "pledge-ccl-02",
    company: "Central Coalfields Limited (CCL) CSR",
    focus: "Clean Energy, Mine Water Remediation & Education",
    totalCommitted: 3800000,
    disbursed: 2100000,
    activeCollabs: 4,
    leadContact: "B. S. Meena (GM CSR, CCL Ranchi)",
    csrPillar: "Environmental Sustainability & Clean Tech"
  },
  {
    id: "pledge-jsw-03",
    company: "JSW Foundation",
    focus: "Rural Tele-Medicine & Women Livelihoods",
    totalCommitted: 2500000,
    disbursed: 1500000,
    activeCollabs: 3,
    leadContact: "Pooja Sharma (Head CSR Projects)",
    csrPillar: "Affordable Rural Healthcare Innovation"
  }
];

const initialAINotifications = [
  {
    id: "notif-ai-01",
    type: "duplicate_cluster",
    title: "Cluster Alert: 5 Duplicate Fluoride/Water Reports Detected",
    description: "AI pattern analysis identified 5 similar citizen submissions from Bokaro and Ramgarh districts matching JH-2026-CHAL-8921. Recommended: Merge into single regional R&D project.",
    severity: "medium",
    timestamp: "10 mins ago",
    challengeId: "JH-2026-CHAL-8921",
    read: false
  },
  {
    id: "notif-ai-02",
    type: "urgency_escalation",
    title: "Urgency Escalation: Bridge Abutment Scour in Chaibasa",
    description: "Citizen report indicates imminent risk to bridge during monsoon runoff. Priority escalated to CRITICAL by State AI Triage Model.",
    severity: "critical",
    timestamp: "45 mins ago",
    challengeId: "JH-2026-CHAL-8923",
    read: false
  },
  {
    id: "notif-ai-03",
    type: "milestone_ready",
    title: "Milestone Achieved: BIT Mesra Nano-Adsorbent Testing",
    description: "Lab verification report uploaded by BIT Mesra Team. Ready for Admin validation and Phase 2 grant release of ₹1.8 Lakhs.",
    severity: "info",
    timestamp: "2 hours ago",
    challengeId: "JH-2026-CHAL-8921",
    read: true
  },
  {
    id: "notif-ai-04",
    type: "csr_pledge",
    title: "New CSR Commitment: ₹3.0 Lakhs from Tata Steel",
    description: "Tata Steel CSR pledged matching co-funding for the Bokaro Water Purification project pilot.",
    severity: "success",
    timestamp: "5 hours ago",
    challengeId: "JH-2026-CHAL-8921",
    read: true
  }
];

export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('sicp_role') || 'citizen';
  });

  const [challenges, setChallenges] = useState(() => {
    const saved = localStorage.getItem('sicp_challenges');
    return saved ? JSON.parse(saved) : initialChallenges;
  });

  const [universities, setUniversities] = useState(() => {
    const saved = localStorage.getItem('sicp_universities');
    return saved ? JSON.parse(saved) : initialUniversities;
  });

  const [industryPledges, setIndustryPledges] = useState(() => {
    const saved = localStorage.getItem('sicp_pledges');
    return saved ? JSON.parse(saved) : initialIndustryPledges;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('sicp_notifications');
    return saved ? JSON.parse(saved) : initialAINotifications;
  });

  const [activeRoute, setActiveRoute] = useState(() => {
    return window.location.pathname || '/';
  });

  const [selectedChallengeId, setSelectedChallengeId] = useState("JH-2026-CHAL-8921");
  const [theme, setTheme] = useState("light");
  const [supabaseStatus, setSupabaseStatus] = useState({
    isConfigured: isSupabaseConfigured,
    isConnected: false,
    label: isSupabaseConfigured ? 'Supabase Live' : 'Supabase Backend Ready (Local Cache)'
  });

  // Check Supabase Health and load data on mount
  useEffect(() => {
    const initBackend = async () => {
      const health = await checkSupabaseConnection();
      setSupabaseStatus({
        isConfigured: isSupabaseConfigured,
        isConnected: health.connected,
        label: health.connected ? 'Supabase Connected (Live)' : 'Supabase Ready (Local Cache)'
      });

      if (health.connected) {
        const remoteChallenges = await fetchChallengesApi(challenges);
        const remoteUniversities = await fetchUniversitiesApi(universities);
        const remotePledges = await fetchIndustryPledgesApi(industryPledges);
        setChallenges(remoteChallenges);
        setUniversities(remoteUniversities);
        setIndustryPledges(remotePledges);
      }
    };

    initBackend();

    // Subscribe to Realtime Updates
    const unsubscribe = subscribeToRealtimeUpdates(
      (challengePayload) => {
        console.log('[Supabase Realtime] Challenge updated:', challengePayload);
        fetchChallengesApi(challenges).then(data => setChallenges(data));
      },
      (notifPayload) => {
        console.log('[Supabase Realtime] AI Notification:', notifPayload);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sicp_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('sicp_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('sicp_universities', JSON.stringify(universities));
  }, [universities]);

  useEffect(() => {
    localStorage.setItem('sicp_pledges', JSON.stringify(industryPledges));
  }, [industryPledges]);

  useEffect(() => {
    localStorage.setItem('sicp_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Navigate helper
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setActiveRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch Role helper
  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    if (newRole === 'citizen') {
      navigate('/citizen/submit');
    } else if (newRole === 'admin') {
      navigate('/admin/dashboard');
    } else if (newRole === 'university') {
      navigate('/university/dashboard');
    } else if (newRole === 'industry') {
      navigate('/industry/portal');
    } else if (newRole === 'superadmin') {
      navigate('/superadmin/analytics');
    }
  };

  // Submit Challenge (Optimistic + Supabase)
  const submitChallenge = (formData) => {
    const newId = `JH-2026-CHAL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newChallenge = {
      id: newId,
      title: formData.title,
      description: formData.description,
      category: formData.category || "General Societal Need",
      district: formData.district || "Ranchi",
      block: formData.block || "Sadar",
      village: formData.village || "Local Panchayat",
      severity: formData.severity || "Medium",
      urgency: formData.urgency || "Medium",
      status: "Under Review",
      submittedBy: formData.submittedBy || "Citizen User",
      submittedPhone: formData.submittedPhone || "+91 98765 43210",
      submittedAt: new Date().toISOString().split('T')[0],
      assignedUniversity: null,
      assignedFaculty: null,
      studentTeam: null,
      grantAllocated: 0,
      grantDisbursed: 0,
      upvotes: 1,
      duplicatesDetected: 0,
      aiCategoryScore: 95,
      aiSeverityScore: formData.severity === "Critical" ? 96 : formData.severity === "High" ? 85 : 70,
      attachments: formData.attachments || [],
      milestones: [],
      industryCollaborators: [],
      csrPledged: 0,
      updates: [
        {
          timestamp: new Date().toLocaleString(),
          message: "Problem challenge submitted successfully via SICP Jharkhand Citizen portal.",
          author: "Citizen Portal"
        }
      ]
    };

    setChallenges(prev => [newChallenge, ...prev]);

    // Push AI Notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      type: "new_submission",
      title: `New Challenge: ${newChallenge.title.substring(0, 45)}...`,
      description: `Submitted by ${newChallenge.submittedBy} from ${newChallenge.district}. Auto-classified as ${newChallenge.category}.`,
      severity: newChallenge.severity === 'Critical' ? 'critical' : 'info',
      timestamp: "Just now",
      challengeId: newId,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Send to Supabase Backend
    createChallengeApi(formData).catch(err => console.warn(err));

    return newId;
  };

  // Assign Challenge to University
  const assignChallengeToUniversity = (challengeId, universityName, grantAmount, facultyGuide) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId) {
        return {
          ...c,
          status: "Assigned",
          assignedUniversity: universityName,
          assignedFaculty: facultyGuide || "Faculty Lead & Innovation Cell",
          grantAllocated: Number(grantAmount) || 400000,
          grantDisbursed: Number(grantAmount) * 0.5 || 200000,
          milestones: [
            { title: "Literature Review & Problem Formulation", status: "completed", date: new Date().toISOString().split('T')[0], notes: "Institutional R&D approval" },
            { title: "Hardware / Software Prototype Build", status: "in-progress", date: "Upcoming (4 weeks)", notes: "Lab experimentation" },
            { title: "Field Testing & Panchayat Pilot", status: "pending", date: "Upcoming (8 weeks)", notes: "Community trial" },
            { title: "Final Evaluation & Deployment", status: "pending", date: "Upcoming (12 weeks)", notes: "Handover to department" }
          ],
          updates: [
            {
              timestamp: new Date().toLocaleString(),
              message: `Assigned to ${universityName} with State Innovation Grant of ₹${(Number(grantAmount) / 100000).toFixed(1)} Lakhs.`,
              author: "SICP Admin"
            },
            ...c.updates
          ]
        };
      }
      return c;
    }));

    setUniversities(prev => prev.map(u => {
      if (u.name.includes(universityName) || universityName.includes(u.name)) {
        return {
          ...u,
          activeProjects: u.activeProjects + 1,
          grantsReceived: u.grantsReceived + (Number(grantAmount) || 400000)
        };
      }
      return u;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: "assignment_dispatched",
        title: `Challenge ${challengeId} Assigned to ${universityName}`,
        description: `Grant allocation of ₹${(Number(grantAmount) / 100000).toFixed(1)} Lakhs issued. Notification dispatched to Dean of R&D.`,
        severity: "success",
        timestamp: "Just now",
        challengeId,
        read: false
      },
      ...prev
    ]);

    // Send to Supabase Backend
    assignChallengeApi(challengeId, universityName, grantAmount, facultyGuide).catch(err => console.warn(err));
  };

  // Update Milestone
  const updateMilestone = (challengeId, milestoneIndex, newStatus, notes) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId && c.milestones && c.milestones[milestoneIndex]) {
        const updatedMilestones = [...c.milestones];
        updatedMilestones[milestoneIndex] = {
          ...updatedMilestones[milestoneIndex],
          status: newStatus,
          notes: notes || updatedMilestones[milestoneIndex].notes
        };

        let newStatusLabel = c.status;
        const allCompleted = updatedMilestones.every(m => m.status === 'completed');
        const anyInProgress = updatedMilestones.some(m => m.status === 'in-progress');
        if (allCompleted) newStatusLabel = "Deployed";
        else if (anyInProgress && c.status === 'Assigned') newStatusLabel = "Prototyping";

        return {
          ...c,
          status: newStatusLabel,
          milestones: updatedMilestones,
          updates: [
            {
              timestamp: new Date().toLocaleString(),
              message: `Milestone "${updatedMilestones[milestoneIndex].title}" updated to ${newStatus}.`,
              author: c.assignedUniversity || "University Innovation Cell"
            },
            ...c.updates
          ]
        };
      }
      return c;
    }));

    // Send to Supabase Backend
    updateMilestoneApi(challengeId, milestoneIndex, newStatus, notes).catch(err => console.warn(err));
  };

  // Pledge CSR Funds
  const pledgeCSR = (challengeId, companyName, amount, contactPerson) => {
    const pledgeVal = Number(amount) || 200000;
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId) {
        const existingCollabs = c.industryCollaborators || [];
        return {
          ...c,
          csrPledged: (c.csrPledged || 0) + pledgeVal,
          industryCollaborators: existingCollabs.includes(companyName) ? existingCollabs : [...existingCollabs, companyName],
          updates: [
            {
              timestamp: new Date().toLocaleString(),
              message: `${companyName} pledged CSR grant of ₹${(pledgeVal / 100000).toFixed(1)} Lakhs.`,
              author: "Industry CSR Hub"
            },
            ...c.updates
          ]
        };
      }
      return c;
    }));

    setIndustryPledges(prev => {
      const existing = prev.find(p => p.company.toLowerCase().includes(companyName.toLowerCase()));
      if (existing) {
        return prev.map(p => p.id === existing.id ? { ...p, totalCommitted: p.totalCommitted + pledgeVal, activeCollabs: p.activeCollabs + 1 } : p);
      }
      return [
        ...prev,
        {
          id: `pledge-${Date.now()}`,
          company: companyName,
          focus: "Societal Innovation & Co-Development",
          totalCommitted: pledgeVal,
          disbursed: 0,
          activeCollabs: 1,
          leadContact: contactPerson || "CSR Officer",
          csrPillar: "Schedule VII Rural Development"
        }
      ];
    });

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: "csr_pledged",
        title: `CSR Pledge: ₹${(pledgeVal / 100000).toFixed(1)} Lakhs from ${companyName}`,
        description: `Pledged towards project ${challengeId}.`,
        severity: "success",
        timestamp: "Just now",
        challengeId,
        read: false
      },
      ...prev
    ]);

    // Send to Supabase Backend
    pledgeCsrApi(challengeId, companyName, amount, contactPerson).catch(err => console.warn(err));
  };

  // Upvote challenge
  const upvoteChallenge = (challengeId) => {
    setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, upvotes: (c.upvotes || 0) + 1 } : c));
    upvoteChallengeApi(challengeId).catch(err => console.warn(err));
  };

  // Merge Duplicates
  const mergeDuplicates = (primaryId, duplicateIds) => {
    setChallenges(prev => {
      const primary = prev.find(c => c.id === primaryId);
      if (!primary) return prev;
      return prev.map(c => {
        if (c.id === primaryId) {
          return {
            ...c,
            upvotes: c.upvotes + 45,
            duplicatesDetected: 0,
            updates: [
              {
                timestamp: new Date().toLocaleString(),
                message: `Merged ${duplicateIds.length} duplicate citizen reports into this primary challenge.`,
                author: "Admin AI Triage"
              },
              ...c.updates
            ]
          };
        }
        return c;
      });
    });

    setNotifications(prev => prev.filter(n => n.challengeId !== primaryId || n.type !== 'duplicate_cluster'));
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        switchRole,
        setCurrentRole,
        challenges,
        universities,
        industryPledges,
        notifications,
        setNotifications,
        activeRoute,
        navigate,
        selectedChallengeId,
        setSelectedChallengeId,
        theme,
        setTheme,
        supabaseStatus,
        submitChallenge,
        assignChallengeToUniversity,
        updateMilestone,
        pledgeCSR,
        upvoteChallenge,
        mergeDuplicates
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
