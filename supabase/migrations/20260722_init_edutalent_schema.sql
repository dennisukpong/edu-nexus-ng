-- EduTalent NG Schema: Nigerian Educational Talent Recruitment Platform
-- Migration 20260722: Initial schema with RLS policies and seed data

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLES

-- Organizations (schools / educational institutions)
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  institution_type TEXT NOT NULL CHECK (institution_type IN ('Primary', 'Secondary', 'Tertiary', 'EdTech')),
  state TEXT NOT NULL,
  lga TEXT,
  verified BOOLEAN DEFAULT false,
  contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Talents (educators / job seekers)
CREATE TABLE public.talents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role_title TEXT,
  role_type TEXT NOT NULL CHECK (role_type IN ('Teaching', 'Non-Teaching', 'Admin')),
  qualification TEXT,
  nysc_status TEXT NOT NULL CHECK (nysc_status IN ('Completed', 'Exempted', 'Ongoing')),
  trcn_registered BOOLEAN DEFAULT false,
  experience_years INT,
  state TEXT,
  lga TEXT,
  subjects TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Jobs (vacancies posted by organizations)
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('Full-time', 'Part-time', 'Contract')),
  category TEXT NOT NULL CHECK (category IN ('Teaching', 'Non-Teaching', 'Leadership')),
  state TEXT NOT NULL,
  lga TEXT,
  salary_range TEXT,
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Applications (job applications from talents)
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  talent_id UUID REFERENCES public.talents(id) ON DELETE SET NULL,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  nysc_status TEXT CHECK (nysc_status IN ('Completed', 'Exempted', 'Ongoing')),
  trcn_number TEXT,
  cover_letter TEXT,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'reviewing', 'shortlisted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. INDEXES
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_state ON public.jobs(state);
CREATE INDEX idx_jobs_organization_id ON public.jobs(organization_id);
CREATE INDEX idx_jobs_category ON public.jobs(category);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX idx_applications_job_id ON public.applications(job_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_organizations_verified ON public.organizations(verified);
CREATE INDEX idx_talents_role_type ON public.talents(role_type);
CREATE INDEX idx_talents_nysc_status ON public.talents(nysc_status);

-- 4. RLS POLICIES
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Organizations: public read for verified, auth users can insert/update their own
CREATE POLICY "Anyone can view verified organizations"
  ON public.organizations FOR SELECT
  USING (verified = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert their organization"
  ON public.organizations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own organization"
  ON public.organizations FOR UPDATE
  USING (auth.uid() = id);

-- Talents: public read for all, auth users can insert/update their own
CREATE POLICY "Anyone can view talent profiles"
  ON public.talents FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert their talent profile"
  ON public.talents FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own talent profile"
  ON public.talents FOR UPDATE
  USING (auth.uid() = id);

-- Jobs: public read for open jobs, auth orgs can CRUD their own
CREATE POLICY "Anyone can view open jobs"
  ON public.jobs FOR SELECT
  USING (status = 'open' OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert jobs for their org"
  ON public.jobs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Organizations can update their own jobs"
  ON public.jobs FOR UPDATE
  USING (auth.uid() = organization_id);

CREATE POLICY "Organizations can delete their own jobs"
  ON public.jobs FOR DELETE
  USING (auth.uid() = organization_id);

-- Applications: talents can insert & view their own; orgs can view apps for their jobs
CREATE POLICY "Anyone can insert applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Applicants can view their own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = talent_id OR auth.role() = 'authenticated');

-- 5. SEED DATA

-- Organizations (Nigerian schools)
INSERT INTO public.organizations (id, name, logo_url, institution_type, state, lga, verified, contact_email) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Lagos Preparatory School', NULL, 'Secondary', 'Lagos', 'Ikeja', true, 'hr@lagosprep.edu.ng'),
  ('a0000000-0000-0000-0000-000000000002', 'Sunrise Montessori Academy', NULL, 'Primary', 'Abuja', 'Gwarinpa', true, 'info@sunrisemontessori.ng'),
  ('a0000000-0000-0000-0000-000000000003', 'Gracehill International College', NULL, 'Secondary', 'Rivers', 'Port Harcourt', true, 'careers@gracehill.edu.ng'),
  ('a0000000-0000-0000-0000-000000000004', 'Royal Crown College', NULL, 'Secondary', 'Oyo', 'Ibadan', true, 'admin@royalcrown.edu.ng'),
  ('a0000000-0000-0000-0000-000000000005', 'Excel International School', NULL, 'Secondary', 'Enugu', 'Enugu', true, 'hiring@excelschool.edu.ng'),
  ('a0000000-0000-0000-0000-000000000006', 'STEM Academy Lagos', NULL, 'EdTech', 'Lagos', 'Lekki', true, 'team@stemaacademy.ng'),
  ('a0000000-0000-0000-0000-000000000007', 'Northern Lights Academy', NULL, 'Secondary', 'Kano', 'Kano', true, 'info@northernlights.edu.ng'),
  ('a0000000-0000-0000-0000-000000000008', 'Inclusive Learning Centre', NULL, 'Primary', 'Abuja', 'Maitama', true, 'hello@inclusivelearning.ng'),
  ('a0000000-0000-0000-0000-000000000009', 'University of Lagos Staff School', NULL, 'Primary', 'Lagos', 'Akoka', true, 'admin@unilagstaffschool.edu.ng'),
  ('a0000000-0000-0000-0000-00000000000a', 'Adeola Odutola College', NULL, 'Secondary', 'Ogun', 'Ijebu-Ode', true, 'hr@adeolacollege.edu.ng')
ON CONFLICT (id) DO NOTHING;

-- Talents (educator profiles)
INSERT INTO public.talents (id, full_name, role_title, role_type, qualification, nysc_status, trcn_registered, experience_years, state, lga, subjects) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Chinwe Okafor', 'Senior Mathematics Teacher', 'Teaching', 'B.Ed Mathematics', 'Completed', true, 8, 'Lagos', 'Ikeja', ARRAY['Mathematics', 'Further Mathematics', 'Statistics']),
  ('b0000000-0000-0000-0000-000000000002', 'Emeka Nwosu', 'Early Childhood Educator', 'Teaching', 'NCE ECE', 'Completed', true, 4, 'Abuja', 'Gwarinpa', ARRAY['Early Literacy', 'Numeracy', 'Creative Arts']),
  ('b0000000-0000-0000-0000-000000000003', 'Folashade Adeyemi', 'ICT Instructor', 'Teaching', 'B.Sc Computer Science', 'Exempted', true, 6, 'Lagos', 'Lekki', ARRAY['Python', 'Scratch', 'Web Development', 'Computer Science']),
  ('b0000000-0000-0000-0000-000000000004', 'Tunde Bakare', 'English Teacher', 'Teaching', 'B.A English', 'Completed', true, 10, 'Oyo', 'Ibadan', ARRAY['English Language', 'Literature', 'IGCSE English']),
  ('b0000000-0000-0000-0000-000000000005', 'Ngozi Eze', 'School Counselor', 'Non-Teaching', 'M.Sc Guidance & Counseling', 'Completed', false, 7, 'Enugu', 'Enugu', ARRAY['Counseling', 'Wellness', 'Career Guidance']),
  ('b0000000-0000-0000-0000-000000000006', 'Amina Yusuf', 'Physics Teacher', 'Teaching', 'B.Sc Physics', 'Ongoing', false, 2, 'Lagos', 'Lagos Island', ARRAY['Physics', 'Basic Science']),
  ('b0000000-0000-0000-0000-000000000007', 'Suleiman Abdullahi', 'Hausa Language Teacher', 'Teaching', 'B.A Hausa Linguistics', 'Completed', true, 5, 'Kano', 'Kano', ARRAY['Hausa Language', 'Hausa Literature', 'Translation']),
  ('b0000000-0000-0000-0000-000000000008', 'Kelechi Obi', 'Special Needs Educator', 'Teaching', 'B.Ed Special Education', 'Completed', true, 6, 'Abuja', 'Maitama', ARRAY['Special Education', 'IEP Development', 'Assistive Technology']),
  ('b0000000-0000-0000-0000-000000000009', 'Yetunde Alabi', 'School Administrator', 'Admin', 'M.Ed Educational Management', 'Exempted', true, 12, 'Lagos', 'Victoria Island', ARRAY['School Administration', 'HR Management', 'Curriculum Planning']),
  ('b0000000-0000-0000-0000-00000000000a', 'Ibrahim Danjuma', 'Biology Teacher', 'Teaching', 'B.Sc Biology', 'Completed', true, 3, 'Kaduna', 'Kaduna', ARRAY['Biology', 'Health Science', 'Agricultural Science'])
ON CONFLICT (id) DO NOTHING;

-- Jobs (vacancies)
INSERT INTO public.jobs (id, organization_id, title, job_type, category, state, lga, salary_range, description, requirements, status) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Senior Mathematics Teacher', 'Full-time', 'Teaching', 'Lagos', 'Ikeja', '₦350,000 – ₦500,000/mo', 'We are seeking an experienced Mathematics teacher to join our outstanding faculty. The ideal candidate will have a passion for inspiring young minds and a strong background in the Nigerian curriculum.', ARRAY['B.Ed or B.Sc in Mathematics', '5+ years teaching experience', 'TRCN certification', 'Excellent communication skills'], 'open'),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'Early Childhood Educator', 'Full-time', 'Teaching', 'Abuja', 'Gwarinpa', '₦200,000 – ₦300,000/mo', 'Sunrise Montessori is looking for a warm, nurturing educator to lead our preschool classroom. Montessori training preferred but not required — we provide full training.', ARRAY['NCE or B.Ed in ECE', 'Patience and creativity', 'First aid certification', 'Montessori certification (preferred)'], 'open'),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'ICT / Computer Science Instructor', 'Full-time', 'Teaching', 'Rivers', 'Port Harcourt', '₦300,000 – ₦450,000/mo', 'Teach computer science from JSS1 to SS3. Must be proficient in Python, Scratch, and basic web development. We have a modern computer lab with 40 workstations.', ARRAY['B.Sc Computer Science', '2+ years teaching', 'Python & Scratch proficiency', 'Curriculum development experience'], 'open'),
  ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'English Language & Literature Teacher', 'Full-time', 'Teaching', 'Oyo', 'Ibadan', '₦250,000 – ₦380,000/mo', 'Join our thriving English department. We are looking for a teacher who can inspire a love of literature and language in students from JSS to A-Levels.', ARRAY['B.A English / Literature', 'Teaching qualification', 'IELTS or equivalent', 'IGCSE experience preferred'], 'open'),
  ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'School Counselor', 'Full-time', 'Non-Teaching', 'Enugu', 'Enugu', '₦280,000 – ₦400,000/mo', 'Provide holistic counseling support to students aged 11-18. You will lead our wellbeing program and work closely with parents and teachers.', ARRAY['M.Sc Guidance & Counseling', '3+ years school experience', 'Nigerian license', 'Empathy & discretion'], 'open'),
  ('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'Physics Teacher (Part-Time)', 'Part-time', 'Teaching', 'Lagos', 'Lekki', '₦150,000 – ₦200,000/mo', 'Part-time Physics teacher for our Saturday STEM program and exam prep classes. Perfect for a postgraduate student or early-career teacher.', ARRAY['B.Sc Physics (ongoing M.Sc ok)', 'Teaching interest', 'Lab safety knowledge', 'Weekend availability'], 'open'),
  ('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000007', 'Hausa Language Teacher', 'Full-time', 'Teaching', 'Kano', 'Kano', '₦220,000 – ₦350,000/mo', 'Teach Hausa language and literature to students at all levels. Promote cultural appreciation and fluency in reading, writing, and speaking.', ARRAY['B.A Hausa / Linguistics', 'TRCN certified', 'Curriculum design skills', 'Fluency in English'], 'open'),
  ('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000008', 'Special Needs Educator', 'Full-time', 'Teaching', 'Abuja', 'Maitama', '₦300,000 – ₦450,000/mo', 'Work with students with diverse learning needs in a purpose-built inclusive school. Small class sizes, excellent support staff, and ongoing training provided.', ARRAY['B.Ed Special Education', 'Patience & adaptability', 'IEP experience', 'Team collaboration'], 'open'),
  ('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000009', 'Primary School Teacher', 'Full-time', 'Teaching', 'Lagos', 'Akoka', '₦180,000 – ₦280,000/mo', 'Teach core subjects to primary pupils in a well-established staff school. Small class sizes and supportive environment.', ARRAY['NCE or B.Ed', 'Primary teaching experience', 'Child safeguarding certification', 'Creative teaching approach'], 'open'),
  ('c0000000-0000-0000-0000-00000000000a', 'a0000000-0000-0000-0000-000000000008', 'School Administrator', 'Full-time', 'Leadership', 'Abuja', 'Maitama', '₦400,000 – ₦600,000/mo', 'Oversee daily operations of our inclusive school. Manage staff scheduling, parent communication, and regulatory compliance.', ARRAY['M.Ed or MBA', '5+ years school admin experience', 'Leadership skills', 'Nigerian education policy knowledge'], 'open')
ON CONFLICT (id) DO NOTHING;