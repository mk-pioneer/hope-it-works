-- ===================================================================================
-- SICP Jharkhand: State Innovation & Collaboration Platform
-- Database Schema for Supabase (PostgreSQL 15+)
-- ===================================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------------
-- 1. TABLE: UNIVERSITIES & ACADEMIC LABS
-- -----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    focal_areas TEXT[] DEFAULT '{}',
    active_projects INTEGER DEFAULT 0,
    completed_pilots INTEGER DEFAULT 0,
    grants_received NUMERIC DEFAULT 0,
    faculty_roster INTEGER DEFAULT 0,
    student_innovators INTEGER DEFAULT 0,
    performance_rating NUMERIC(3, 2) DEFAULT 4.50,
    dean_contact VARCHAR(255),
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------------
-- 2. TABLE: CIVIC CHALLENGES & PROBLEMS
-- -----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    custom_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    block VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    severity VARCHAR(50) DEFAULT 'Medium',
    urgency VARCHAR(50) DEFAULT 'Medium',
    status VARCHAR(50) DEFAULT 'Submitted',
    submitted_by VARCHAR(255) NOT NULL,
    submitted_phone VARCHAR(50) NOT NULL,
    submitted_at DATE DEFAULT CURRENT_DATE,
    assigned_university VARCHAR(255),
    assigned_faculty VARCHAR(255),
    student_team VARCHAR(255),
    grant_allocated NUMERIC DEFAULT 0,
    grant_disbursed NUMERIC DEFAULT 0,
    upvotes INTEGER DEFAULT 1,
    duplicates_detected INTEGER DEFAULT 0,
    ai_category_score INTEGER DEFAULT 95,
    ai_severity_score INTEGER DEFAULT 80,
    csr_pledged NUMERIC DEFAULT 0,
    industry_collaborators TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------------
-- 3. TABLE: PROJECT MILESTONES
-- -----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'completed', 'in-progress', 'pending'
    target_date VARCHAR(50),
    notes TEXT,
    order_idx INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------------
-- 4. TABLE: CHALLENGE UPDATES & TIMELINE LOGS
-- -----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS challenge_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    author VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp_str VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------------
-- 5. TABLE: INDUSTRY & CSR PARTNERS
-- -----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS industry_pledges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    focus_area VARCHAR(255) NOT NULL,
    total_committed NUMERIC DEFAULT 0,
    disbursed NUMERIC DEFAULT 0,
    active_collabs INTEGER DEFAULT 0,
    lead_contact VARCHAR(255) NOT NULL,
    csr_pillar VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------------
-- 6. TABLE: CSR PROJECT CONTRIBUTIONS
-- -----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS csr_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    amount NUMERIC NOT NULL,
    contact_person VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pledged',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------------
-- 7. TABLE: AI NOTIFICATIONS & TRIAGE ALERTS
-- -----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notif_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'info',
    challenge_id VARCHAR(50),
    is_read BOOLEAN DEFAULT false,
    timestamp_str VARCHAR(100) DEFAULT 'Just now',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------------
-- 8. TABLE: COMMUNITY COMMENTS & FIELD LOGS
-- -----------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS community_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id VARCHAR(50) NOT NULL,
    author VARCHAR(255) NOT NULL,
    comment_text TEXT NOT NULL,
    time_str VARCHAR(100) DEFAULT 'Just now',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------------
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_pledges ENABLE ROW LEVEL SECURITY;
ALTER TABLE csr_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access on All Portals
CREATE POLICY "Public Read Universities" ON universities FOR SELECT USING (true);
CREATE POLICY "Public Read Challenges" ON challenges FOR SELECT USING (true);
CREATE POLICY "Public Insert Challenges" ON challenges FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Challenges" ON challenges FOR UPDATE USING (true);

CREATE POLICY "Public Read Milestones" ON milestones FOR SELECT USING (true);
CREATE POLICY "Public Write Milestones" ON milestones FOR ALL USING (true);

CREATE POLICY "Public Read Updates" ON challenge_updates FOR SELECT USING (true);
CREATE POLICY "Public Insert Updates" ON challenge_updates FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Industry" ON industry_pledges FOR SELECT USING (true);
CREATE POLICY "Public Write Industry" ON industry_pledges FOR ALL USING (true);

CREATE POLICY "Public Read CSR" ON csr_contributions FOR SELECT USING (true);
CREATE POLICY "Public Insert CSR" ON csr_contributions FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Notifications" ON ai_notifications FOR SELECT USING (true);
CREATE POLICY "Public Write Notifications" ON ai_notifications FOR ALL USING (true);

CREATE POLICY "Public Read Comments" ON community_comments FOR SELECT USING (true);
CREATE POLICY "Public Insert Comments" ON community_comments FOR INSERT WITH CHECK (true);

-- -----------------------------------------------------------------------------------
-- SEED DATA INITIALIZATION
-- -----------------------------------------------------------------------------------

INSERT INTO universities (code, name, location, type, focal_areas, active_projects, completed_pilots, grants_received, faculty_roster, student_innovators, performance_rating, dean_contact)
VALUES
('univ-bit-mesra', 'BIT Mesra (Birla Institute of Technology)', 'Ranchi, Jharkhand', 'Deemed University', ARRAY['Water Purification', 'Robotics & IoT', 'Bio-Engineering'], 8, 14, 3850000, 42, 180, 4.90, 'Prof. S. K. Ghorai (Dean R&D)'),
('univ-iit-dhanbad', 'IIT (ISM) Dhanbad', 'Dhanbad, Jharkhand', 'Institute of National Importance', ARRAY['Clean Energy & Minerals', 'Biomedical Devices', 'AI & Telemetry'], 12, 22, 6200000, 65, 290, 4.95, 'Prof. Sagar Pal (Dean R&D)'),
('univ-nit-jamshedpur', 'NIT Jamshedpur', 'Jamshedpur, Jharkhand', 'National Institute of Technology', ARRAY['Smart Urban Infrastructure', 'Electric Vehicles', 'Structural Health'], 6, 11, 2900000, 38, 140, 4.80, 'Prof. Sanjay Kumar (Dean Academic)'),
('univ-bau-ranchi', 'Birsa Agricultural University (BAU)', 'Kanke, Ranchi', 'State Agricultural University', ARRAY['Post-Harvest AgriTech', 'Tribal Livelihoods', 'Organic Biostimulants'], 5, 9, 2100000, 29, 95, 4.70, 'Dr. P. K. Singh (Director Research)'),
('univ-ranchi-tribal', 'Ranchi University - Centre for Tribal Innovation', 'Ranchi, Jharkhand', 'State University Innovation Centre', ARRAY['Indigenous Medicinal Plants', 'Lac & Silk Technology', 'Rural Ergonomics'], 4, 6, 1400000, 22, 75, 4.65, 'Prof. Jyoti Kumar (Coordinator)')
ON CONFLICT (code) DO NOTHING;

INSERT INTO industry_pledges (company_name, focus_area, total_committed, disbursed, active_collabs, lead_contact, csr_pillar)
VALUES
('Tata Steel Foundation', 'Water Purification & Tribal Rural Health', 4500000, 2800000, 6, 'Sourav Roy (Chief CSR)', 'Schedule VII Healthcare & Drinking Water'),
('Central Coalfields Limited (CCL) CSR', 'Clean Energy, Mine Water Remediation & Education', 3800000, 2100000, 4, 'B. S. Meena (GM CSR Ranchi)', 'Environmental Sustainability'),
('JSW Foundation', 'Rural Tele-Medicine & Women Livelihoods', 2500000, 1500000, 3, 'Pooja Sharma (Head CSR)', 'Affordable Rural Healthcare Innovation')
ON CONFLICT DO NOTHING;

INSERT INTO challenges (custom_id, title, description, category, district, block, village, severity, urgency, status, submitted_by, submitted_phone, submitted_at, assigned_university, assigned_faculty, student_team, grant_allocated, grant_disbursed, upvotes, duplicates_detected, ai_category_score, ai_severity_score, csr_pledged, industry_collaborators)
VALUES
('JH-2026-CHAL-8921', 'Groundwater Fluoride & Arsenic Contamination in Rural Bokaro Tube Wells', 'Deep borewells across 14 panchayats in Peterwar block have recorded fluoride levels exceeding 3.2 mg/L, causing severe dental and skeletal fluorosis among children.', 'Water & Sanitation', 'Bokaro', 'Peterwar', 'Chas-Bokaro Border', 'Critical', 'High', 'Prototyping', 'Rajeshwar Mahato', '+91 98351 44820', '2026-08-12', 'BIT Mesra', 'Dr. Anirban Mukherjee (Dept. of Chemical & Bio-Engineering)', 'Team Jal-Shuddhi (4 M.Tech Researchers)', 450000, 270000, 342, 4, 98, 94, 300000, ARRAY['Tata Steel CSR Foundation']),
('JH-2026-CHAL-8922', 'Solar-Powered Cold Storage & Lac Resin Drying Units for Tribal Farmers', 'Tribal lac cultivators in Khunti face over 35% post-harvest spoilage and quality degradation due to high humidity and lack of decentralized drying infrastructure.', 'AgriTech & Livelihoods', 'Khunti', 'Murhu', 'Bandgaon', 'High', 'High', 'Under Review', 'Sunita Munda', '+91 87890 12345', '2026-08-24', NULL, NULL, NULL, 0, 0, 189, 2, 96, 88, 0, '{}'),
('JH-2026-CHAL-8923', 'Low-cost Tele-ECG & AI Diagnosis Unit for Primary Health Centers (PHCs)', 'Rural PHCs in Saranda forest zone lack cardiologists. Patients experiencing acute myocardial infarction travel 90km losing crucial golden hour.', 'Healthcare', 'West Singhbhum', 'Manoharpur', 'Chiria', 'Critical', 'Critical', 'Assigned', 'Dr. Alok Verma', '+91 94311 77210', '2026-08-16', 'IIT (ISM) Dhanbad', 'Prof. Sudeshna Roy (Dept. of Electronics & Biomedical)', 'CardioAI Innovations', 600000, 300000, 412, 1, 99, 97, 250000, ARRAY['JSW Foundation']),
('JH-2026-CHAL-8924', 'Smart IoT Water Distribution & Leakage Monitoring in Ranchi Municipal Area', 'Non-Revenue Water in Ranchi urban zones accounts for 42% loss due to unmonitored underground pipeline bursts and illegal tapping.', 'Smart Urban Infra', 'Ranchi', 'Ranchi Urban', 'Doranda & Harmu', 'Medium', 'Medium', 'Field Pilot', 'Citizens Welfare Forum Ranchi', '+91 97714 55601', '2026-07-28', 'NIT Jamshedpur', 'Dr. K. S. Raman (Dept. of Civil & IoT)', 'SmartFlow NITJ', 800000, 650000, 560, 6, 95, 82, 500000, ARRAY['Coal India Ltd / CCL CSR', 'Tata Steel']),
('JH-2026-CHAL-8925', 'Eco-Friendly Biomass Briquetting from Mahua Flower & Sal Leaf Processing Waste', 'Over 60,000 quintals of organic residue from Mahua collection is openly burnt or dumped in Santhal Pargana.', 'Clean Energy', 'Dumka', 'Jama', 'Barmasia', 'Medium', 'Medium', 'Submitted', 'Tribal SHG Federation Dumka', '+91 93041 88902', '2026-08-27', NULL, NULL, NULL, 0, 0, 95, 0, 94, 78, 0, '{}')
ON CONFLICT (custom_id) DO NOTHING;
