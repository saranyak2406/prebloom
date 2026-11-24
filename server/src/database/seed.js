const bcrypt = require('bcryptjs');
const { query, initDb } = require('./db');

async function seed() {
  console.log('🌱 Starting database seeding for PrepBloom...');
  await initDb();

  // Check if users already seeded
  const check = await query('SELECT COUNT(*) as count FROM users');
  if (parseInt(check.rows[0].count) > 0) {
    console.log('⚡ Database already has data. Skipping seed.');
    return;
  }

  // 1. Users
  const salt = await bcrypt.genSalt(10);
  const studentPassword = await bcrypt.hash('student123', salt);
  const adminPassword = await bcrypt.hash('admin123', salt);

  const studentRes = await query(`
    INSERT INTO users (name, email, password_hash, role, avatar, phone, bio, target_exam, streak_count)
    VALUES 
    ($1, $2, $3, 'student', 'https://api.dicebear.com/7.x/notionists/svg?seed=Saranya', '+91 9876543210', 'Passionate government exam aspirant aiming for UPSC Civil Services 2027 and APPSC Group 1.', 'UPSC Civil Services', 14),
    ($4, $5, $6, 'admin', 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminOfficer', '+91 9123456789', 'Chief Academic Coordinator at PrepBloom. Overseeing curriculum & mock tests.', 'UPSC Civil Services', 45)
    RETURNING id, role, email;
  `, [
    'Saranya Kumar', 'student@prepbloom.com', studentPassword,
    'PrepBloom Admin', 'admin@prepbloom.com', adminPassword
  ]);

  const studentId = studentRes.rows[0].id;
  console.log('✅ Users seeded');

  // 2. Exam Categories
  const catQueries = [
    ['upsc', 'UPSC', 'Award', 'Union Public Service Commission - All India Services, Civil Services & Central Services', 1],
    ['ssc', 'SSC', 'BookCheck', 'Staff Selection Commission - Combined Graduate, Higher Secondary & Technical cadres', 2],
    ['railway', 'Railways (RRB)', 'Train', 'Railway Recruitment Board - NTPC, Group D, ALP & Technical Posts', 3],
    ['state-psc', 'State PSC', 'Landmark', 'State Public Service Commissions (APPSC Group 1-4, TSPSC, TNPSC & Others)', 4],
    ['banking', 'Banking & Insurance', 'Building2', 'IBPS PO/Clerk, SBI PO/Clerk, RBI Grade B & Insurance examinations', 5],
    ['defence', 'Defence Services', 'ShieldAlert', 'National Defence Academy, CDS, AFCAT, Indian Coast Guard & Agniveer', 6],
    ['police', 'Police Recruitment', 'BadgeCheck', 'State Police Sub-Inspectors, Constables, SSC CPO & CAPF', 7],
    ['other', 'Other Recruitment', 'GraduationCap', 'Teaching (CTET/TET), Court Recrutiment, Postal & Statutory bodies', 8]
  ];

  const categories = {};
  for (const cat of catQueries) {
    const res = await query(
      'INSERT INTO exam_categories (slug, name, icon, description, display_order) VALUES ($1, $2, $3, $4, $5) RETURNING id, slug',
      cat
    );
    categories[res.rows[0].slug] = res.rows[0].id;
  }
  console.log('✅ Exam Categories seeded');

  // 3. Exams
  const examsData = [
    {
      category: 'upsc',
      slug: 'upsc-civil-services',
      title: 'UPSC Civil Services Examination (IAS / IPS / IFS)',
      code: 'CSE-2026',
      overview: 'The premier competitive examination in India conducted by UPSC for recruitment to higher civil services including Indian Administrative Service (IAS), Indian Police Service (IPS), and Indian Foreign Service (IFS).',
      eligibility: 'Must be a Citizen of India (for IAS/IPS). Any recognized Bachelor degree.',
      age_criteria: '21 to 32 years (Relaxations: OBC - 3 years, SC/ST - 5 years, PwD - 10 years). Maximum 6 attempts for General category.',
      educational_qualification: 'Graduate from any recognized university in any discipline. Final year students are also eligible to apply.',
      selection_process: 'Three-stage selection: 1. Preliminary Examination (Objective) 2. Main Examination (Written Descriptive) 3. Personality Test / Interview.',
      exam_pattern: {
        stages: [
          { name: 'Prelims GS-1', questions: 100, marks: 200, duration: '2 Hours', negative: '0.66 marks' },
          { name: 'Prelims CSAT', questions: 80, marks: 200, duration: '2 Hours', qualifying: '33% (66 marks)', negative: '0.83 marks' },
          { name: 'Mains Written', papers: 9, marks: 1750, duration: 'Descriptive' },
          { name: 'Personality Test', marks: 275, duration: '30-40 Mins' }
        ]
      },
      detailed_syllabus: {
        prelims_gs1: ['Current Events of National and International Importance', 'History of India and Indian National Movement', 'Indian and World Geography', 'Indian Polity and Governance (Constitution, Panchayati Raj, Public Policy)', 'Economic and Social Development', 'General Science & Environment Ecology'],
        csat: ['Reading Comprehension', 'Interpersonal skills', 'Logical reasoning and analytical ability', 'Decision-making and problem solving', 'General mental ability', 'Basic numeracy (Class X level)']
      },
      official_notification_link: 'https://upsc.gov.in',
      notification_status: 'active',
      notification_date: '2026-02-14',
      application_deadline: '2026-03-05',
      vacancies: 1056,
      salary_range: '₹56,100 - ₹2,50,000 (Level 10 to Cabinet Secretary)',
      is_featured: true
    },
    {
      category: 'upsc',
      slug: 'upsc-nda',
      title: 'UPSC NDA & NA Examination',
      code: 'NDA-I-2026',
      overview: 'National Defence Academy and Naval Academy examination for young aspirants straight after 10+2 to enter the Indian Army, Navy, and Air Force officer cadres.',
      eligibility: 'Unmarried Indian male/female candidates who have passed or appearing in Class 12 examination.',
      age_criteria: '16.5 to 19.5 years.',
      educational_qualification: 'Class 12th pass (Physics, Chemistry & Math compulsory for Air Force and Navy Wings).',
      selection_process: 'Written Examination (900 marks) followed by 5-day SSB Interview & Medical Examination.',
      exam_pattern: {
        stages: [
          { name: 'Mathematics', questions: 120, marks: 300, duration: '2.5 Hours' },
          { name: 'General Ability Test (GAT)', questions: 150, marks: 600, duration: '2.5 Hours' },
          { name: 'SSB Interview', marks: 900, duration: '5 Days' }
        ]
      },
      detailed_syllabus: {
        maths: ['Algebra', 'Matrices and Determinants', 'Trigonometry', 'Analytical Geometry', 'Differential Calculus', 'Vector Algebra', 'Statistics and Probability'],
        gat: ['Part A: English (200 marks)', 'Part B: General Knowledge - Physics, Chemistry, General Science, History, Geography, Current Events (400 marks)']
      },
      official_notification_link: 'https://upsc.gov.in',
      notification_status: 'active',
      notification_date: '2025-12-20',
      application_deadline: '2026-01-09',
      vacancies: 400,
      salary_range: '₹56,100 - ₹1,77,500 + Military Service Pay',
      is_featured: false
    },
    {
      category: 'ssc',
      slug: 'ssc-cgl',
      title: 'SSC CGL (Combined Graduate Level)',
      code: 'CGL-2026',
      overview: 'The highest civilian group B & C staff recruitment in ministries and government departments including Income Tax Inspector, GST Inspector, ED, CBI Sub-Inspector, and Assistant Section Officer.',
      eligibility: 'Citizen of India holding any Bachelor Degree from a recognized university.',
      age_criteria: '18 to 32 years (varies per post, with statutory category age relaxations).',
      educational_qualification: 'Bachelor’s Degree in any discipline from a recognized University or equivalent.',
      selection_process: 'Computer-Based Examination Tier-I (Qualifying) followed by Tier-II (Merit deciding) and Document Verification / Computer Knowledge Test.',
      exam_pattern: {
        stages: [
          { name: 'Tier-I (CBT)', questions: 100, marks: 200, duration: '60 Mins', sections: ['General Intelligence', 'General Awareness', 'Quantitative Aptitude', 'English Comprehension'] },
          { name: 'Tier-II (CBT)', marks: 390, duration: '2 Hours 15 Mins', sections: ['Maths & Reasoning (180)', 'English & GA (210)', 'Computer Module & Data Entry'] }
        ]
      },
      detailed_syllabus: {
        tier1: ['Analogy, Classification, Series, Coding-Decoding', 'History, Culture, Geography, Economic Scene, General Policy', 'Number Systems, Percentages, Ratio, Algebra, Geometry, Trigonometry', 'Vocabulary, Grammar, Sentence Structure, Synonyms, Comprehension']
      },
      official_notification_link: 'https://ssc.gov.in',
      notification_status: 'upcoming',
      notification_date: '2026-06-11',
      application_deadline: '2026-07-10',
      vacancies: 17727,
      salary_range: '₹44,900 - ₹1,42,400 (Pay Level 7/8)',
      is_featured: true
    },
    {
      category: 'ssc',
      slug: 'ssc-chsl',
      title: 'SSC CHSL (10+2 Combined Higher Secondary)',
      code: 'CHSL-2026',
      overview: 'Recruitment for Lower Divisional Clerk (LDC), Junior Secretariat Assistant (JSA), and Data Entry Operator (DEO) across Central Government ministries.',
      eligibility: 'Must have passed 12th Standard or equivalent examination from a recognized Board.',
      age_criteria: '18 to 27 years.',
      educational_qualification: '12th Standard Pass from a recognized Board or University.',
      selection_process: 'Tier-I (Objective CBT) + Tier-II (Objective CBT & Skill / Typing Test).',
      exam_pattern: {
        stages: [
          { name: 'Tier-I', questions: 100, marks: 200, duration: '60 Minutes' },
          { name: 'Tier-II', sections: ['Mathematical Abilities', 'Reasoning', 'English Language', 'General Awareness', 'Skill / Typing Test'] }
        ]
      },
      detailed_syllabus: {
        topics: ['Arithmetic, Algebra, Geometry, Mensuration', 'General Intelligence & Reasoning', 'English Language and Grammar', 'General Awareness']
      },
      official_notification_link: 'https://ssc.gov.in',
      notification_status: 'active',
      notification_date: '2026-04-02',
      application_deadline: '2026-05-01',
      vacancies: 3712,
      salary_range: '₹19,900 - ₹63,200 (Pay Level 2 to 4)',
      is_featured: false
    },
    {
      category: 'state-psc',
      slug: 'appsc-group-1',
      title: 'APPSC Group 1 Services (Andhra Pradesh)',
      code: 'APPSC-GRP1-2026',
      overview: 'State executive services in Andhra Pradesh including Deputy Collector, Deputy Superintendent of Police (DSP), Commercial Tax Officer (CTO), and Municipal Commissioner.',
      eligibility: 'Degree of a University in India established or incorporated by or under a Central Act, or State Act.',
      age_criteria: '18 to 42 years (Relaxations: SC/ST/BC - 5 years, Ex-Servicemen - 3 years).',
      educational_qualification: 'Bachelor’s degree in any discipline.',
      selection_process: 'Screening Test (Prelims Objective) -> Mains (Written Descriptive 7 papers) -> Oral Test (Interview).',
      exam_pattern: {
        stages: [
          { name: 'Screening Test Paper-I (General Studies)', questions: 120, marks: 120, duration: '120 Mins' },
          { name: 'Screening Test Paper-II (General Aptitude)', questions: 120, marks: 120, duration: '120 Mins' },
          { name: 'Mains Written', papers: 5, marks: 750, duration: 'Descriptive' }
        ]
      },
      detailed_syllabus: {
        prelims: ['History and Culture (focus on Andhra Pradesh History)', 'Constitution, Polity, Social Justice and International Relations', 'Indian and Andhra Pradesh Economy & Planning', 'Geography of India and Andhra Pradesh', 'General Mental Ability & Science/Technology']
      },
      official_notification_link: 'https://psc.ap.gov.in',
      notification_status: 'active',
      notification_date: '2026-01-10',
      application_deadline: '2026-02-15',
      vacancies: 181,
      salary_range: '₹54,060 - ₹1,33,630',
      is_featured: true
    },
    {
      category: 'state-psc',
      slug: 'appsc-group-2',
      title: 'APPSC Group 2 Services (Andhra Pradesh)',
      code: 'APPSC-GRP2-2026',
      overview: 'Prestigious executive and non-executive posts in Andhra Pradesh such as Assistant Section Officer (ASO), Deputy Tahsildar, Sub-Registrar Grade-II, and Municipal Commissioner Grade-III.',
      eligibility: 'Bachelor’s degree from any recognized university in India.',
      age_criteria: '18 to 42 years as per AP State Govt norms.',
      educational_qualification: 'Graduation in any stream.',
      selection_process: 'Screening Test (Prelims 150 Marks) -> Mains Examination (300 Marks) -> Computer Proficiency Test (CPT).',
      exam_pattern: {
        stages: [
          { name: 'Prelims Screening', questions: 150, marks: 150, duration: '150 Mins', sections: ['Indian History (30)', 'Geography (30)', 'Indian Society (30)', 'Current Affairs (30)', 'Mental Ability (30)'] },
          { name: 'Mains Paper-I', questions: 150, marks: 150, duration: '150 Mins', sections: ['Social & Cultural History of AP (75)', 'Indian Constitution (75)'] },
          { name: 'Mains Paper-II', questions: 150, marks: 150, duration: '150 Mins', sections: ['Indian & AP Economy (75)', 'Science & Technology (75)'] }
        ]
      },
      detailed_syllabus: {
        prelims: ['Ancient, Medieval and Modern Indian History', 'General and Physical Geography, Economic Geography of AP & India', 'Structure of Indian Society, Social Issues, Welfare Mechanisms', 'Major Current Events - National, International, AP State', 'Logical Reasoning, Number Series, Data Interpretation'],
        mains: ['Socio-Cultural History of Andhra Pradesh (Satavahanas to AP Reorganisation Act 2014)', 'Indian Constitution and Governance', 'Indian Economy, Planning & AP State Economy', 'Science & Technology and Ecology']
      },
      official_notification_link: 'https://psc.ap.gov.in',
      notification_status: 'active',
      notification_date: '2025-12-07',
      application_deadline: '2026-01-10',
      vacancies: 897,
      salary_range: '₹37,640 - ₹95,490',
      is_featured: true
    },
    {
      category: 'railway',
      slug: 'rrb-ntpc',
      title: 'RRB NTPC (Non-Technical Popular Categories)',
      code: 'RRB-NTPC-2026',
      overview: 'Recruitment for Station Master, Goods Guard, Senior Clerk cum Typist, Traffic Assistant, Commercial Apprentice, and Junior Accounts Assistant in Indian Railways.',
      eligibility: '12th pass (for Undergraduate posts) or Graduate degree (for Graduate posts).',
      age_criteria: '18 to 33 years for graduate posts (with age relaxation).',
      educational_qualification: 'Graduate Degree for Level 4, 5, 6 posts; 12th pass for Level 2, 3 posts.',
      selection_process: '1st Stage CBT -> 2nd Stage CBT -> Typing Skill Test / Computer Based Aptitude Test -> Document Verification / Medical.',
      exam_pattern: {
        stages: [
          { name: 'CBT Stage-1', questions: 100, marks: 100, duration: '90 Mins', sections: ['General Awareness (40)', 'Mathematics (30)', 'General Intelligence & Reasoning (30)'] },
          { name: 'CBT Stage-2', questions: 120, marks: 120, duration: '90 Mins', sections: ['General Awareness (50)', 'Mathematics (35)', 'Reasoning (35)'] }
        ]
      },
      detailed_syllabus: {
        maths: ['Number System, Decimals, Fractions, LCM, HCF, Ratio and Proportions, Percentage, Mensuration, Time and Work, Time and Distance'],
        reasoning: ['Analogies, Completion of Number and Alphabetical Series, Coding and Decoding, Mathematical Operations, Similarities and Differences'],
        general_awareness: ['Current Events, Games and Sports, Art and Culture of India, Indian Literature, Monuments, General Science, History of India, Polity']
      },
      official_notification_link: 'https://rrbcdg.gov.in',
      notification_status: 'active',
      notification_date: '2026-09-14',
      application_deadline: '2026-10-13',
      vacancies: 11558,
      salary_range: '₹19,900 - ₹35,400 + Railway Allowances',
      is_featured: true
    },
    {
      category: 'banking',
      slug: 'ibps-po',
      title: 'IBPS PO (Probationary Officers / Management Trainees)',
      code: 'IBPS-CRP-PO-XVI',
      overview: 'Common recruitment process for Probationary Officers and Management Trainees in 11 participating public sector banks across India (PNB, Canara, BoB, Union Bank, etc.).',
      eligibility: 'Citizen of India holding a graduation degree in any discipline.',
      age_criteria: '20 to 30 years.',
      educational_qualification: 'A Degree (Graduation) in any discipline from a University recognized by the Govt. Of India.',
      selection_process: 'Preliminary Examination (Online CBT) -> Main Examination (Online CBT + Descriptive) -> Common Interview.',
      exam_pattern: {
        stages: [
          { name: 'Prelims (Online)', questions: 100, marks: 100, duration: '60 Mins (20 min sectional)', sections: ['English (30)', 'Quantitative Aptitude (35)', 'Reasoning Ability (35)'] },
          { name: 'Mains (Online)', questions: 155, marks: 200, duration: '3 Hours', sections: ['Reasoning & Computer (60)', 'General/Economy/Banking Awareness (40)', 'English (40)', 'Data Analysis (60)'] },
          { name: 'Descriptive Test', questions: 2, marks: 25, duration: '30 Mins', sections: ['Letter & Essay Writing'] },
          { name: 'Interview', marks: 100 }
        ]
      },
      detailed_syllabus: {
        banking_awareness: ['Indian Banking System, RBI Monetary Policy, Financial Inclusion, Government Schemes, Basel Norms, Capital Markets, Priority Sector Lending'],
        quant: ['Data Interpretation (Pie, Bar, Line, Radar), Quadratic Equations, Number Series, Arithmetic (Time & Work, SI/CI, Profit Loss)'],
        reasoning: ['Puzzles, Seating Arrangement (Circular, Linear, Floor), Syllogism, Input-Output, Blood Relations, Coding']
      },
      official_notification_link: 'https://ibps.in',
      notification_status: 'upcoming',
      notification_date: '2026-08-01',
      application_deadline: '2026-08-28',
      vacancies: 4455,
      salary_range: '₹52,000 - ₹58,000 gross per month + HRA & perks',
      is_featured: true
    },
    {
      category: 'banking',
      slug: 'sbi-po',
      title: 'SBI PO (State Bank of India Probationary Officer)',
      code: 'SBI-PO-2026',
      overview: 'The most sought-after banking job in India offering rapid career progression, high compensation, and international postings with the largest commercial bank in India.',
      eligibility: 'Graduation in any discipline from a recognized University.',
      age_criteria: '21 to 30 years.',
      educational_qualification: 'Bachelor’s degree. Final year/semester students can also apply provisionally.',
      selection_process: 'Phase-I: Preliminary Examination, Phase-II: Main Examination (Objective + Descriptive), Phase-III: Psychometric Test, Group Exercise (20 marks) & Interview (30 marks).',
      exam_pattern: {
        stages: [
          { name: 'Prelims', questions: 100, marks: 100, duration: '60 Mins' },
          { name: 'Mains', questions: 155, marks: 200, duration: '3 Hours + 30 Min Descriptive' },
          { name: 'Phase III (GE & PI)', marks: 50 }
        ]
      },
      detailed_syllabus: {
        mains: ['Reasoning & Computer Aptitude', 'Data Analysis & Interpretation', 'General/Economy/Banking Awareness', 'English Language']
      },
      official_notification_link: 'https://sbi.co.in/careers',
      notification_status: 'upcoming',
      notification_date: '2026-09-01',
      application_deadline: '2026-09-25',
      vacancies: 2000,
      salary_range: '₹65,000 - ₹70,000 + Leased Accommodation & perks',
      is_featured: false
    },
    {
      category: 'defence',
      slug: 'afcat-exam',
      title: 'AFCAT (Air Force Common Admission Test)',
      code: 'AFCAT-01-2026',
      overview: 'Conducted by the Indian Air Force for recruitment of Commissioned Officers in Flying, Technical, Weapon Systems, Administration, Logistics, Accounts, and Education branches.',
      eligibility: 'Indian Citizen. Graduate in any discipline (min 60%) or B.E./B.Tech.',
      age_criteria: 'Flying: 20 to 24 years; Ground Duty (Technical/Non-Technical): 20 to 26 years.',
      educational_qualification: 'Min 50% in Maths & Physics at 10+2 and Graduation with 60% aggregate.',
      selection_process: 'Online AFCAT Test -> AFSB (Air Force Selection Board) 5-day Testing -> Medical Examination.',
      exam_pattern: {
        stages: [
          { name: 'AFCAT Online Exam', questions: 100, marks: 300, duration: '120 Mins', sections: ['General Awareness', 'Verbal Ability in English', 'Numerical Ability', 'Reasoning and Military Aptitude'] },
          { name: 'AFSB Testing', marks: 300, duration: 'Stage I (Screening) & Stage II (Psychological, GTO, Interview)' }
        ]
      },
      detailed_syllabus: {
        subjects: ['English Comprehension, Error Detection, Sentence Completion, Synonyms/Antonyms', 'General Awareness (History, Geography, Defence, Science, Art)', 'Numerical Ability (Decimal Fractions, Time & Work, Averages, Profit & Loss)', 'Reasoning and Military Aptitude (Verbal and Non-verbal)']
      },
      official_notification_link: 'https://afcat.cdac.in',
      notification_status: 'active',
      notification_date: '2025-12-01',
      application_deadline: '2025-12-30',
      vacancies: 317,
      salary_range: '₹56,100 - ₹1,77,500 + Flying / Technical Allowances',
      is_featured: false
    },
    {
      category: 'police',
      slug: 'ap-police-si',
      title: 'AP Police Sub-Inspector (SCT SI Civil / AR / APSP)',
      code: 'APSLPRB-SI-2026',
      overview: 'Andhra Pradesh State Level Police Recruitment Board examination for Sub-Inspectors of Police in Civil, Armed Reserve, and Andhra Pradesh Special Police battalions.',
      eligibility: 'Must be a local candidate of Andhra Pradesh. Degree from any recognized university.',
      age_criteria: '21 to 27 years (Relaxation up to 5 years for BC/SC/ST candidates).',
      educational_qualification: 'Any Bachelor Degree or equivalent.',
      selection_process: 'Preliminary Written Test (2 Papers, 200 Marks) -> Physical Measurement Test (PMT) & Physical Efficiency Test (PET - 1600m run, Long Jump, 100m) -> Final Written Examination (4 Papers, 400 Marks).',
      exam_pattern: {
        stages: [
          { name: 'Prelims Paper-I (Arithmetic & Reasoning)', questions: 100, marks: 100, duration: '3 Hours' },
          { name: 'Prelims Paper-II (General Studies)', questions: 100, marks: 100, duration: '3 Hours' },
          { name: 'Physical Efficiency Test', status: 'Qualifying' },
          { name: 'Final Written Exam', papers: 4, marks: 400 }
        ]
      },
      detailed_syllabus: {
        prelims: ['Arithmetic: Number System, Ratio & Proportion, Averages, Interest, Time & Distance', 'Test of Reasoning: Coding, Blood relations, Analogies, Syllogisms', 'General Studies: General Science, History of India with focus on Indian National Movement, Geography, Polity, AP Economy, Current Events']
      },
      official_notification_link: 'https://slprb.ap.gov.in',
      notification_status: 'active',
      notification_date: '2026-01-20',
      application_deadline: '2026-02-28',
      vacancies: 411,
      salary_range: '₹44,570 - ₹1,27,480',
      is_featured: true
    },
    {
      category: 'other',
      slug: 'ctet-teaching',
      title: 'CTET (Central Teacher Eligibility Test)',
      code: 'CTET-JULY-2026',
      overview: 'National level eligibility test conducted by CBSE for candidates aspiring to be teachers in Central Government schools like KVS, NVS, Central Tibetan Schools, and UT administrations.',
      eligibility: 'Candidates with Senior Secondary or Graduation along with D.El.Ed / B.Ed qualification.',
      age_criteria: 'No upper age limit for CTET.',
      educational_qualification: 'B.Ed / D.El.Ed / B.El.Ed with minimum qualifying percentages.',
      selection_process: 'Paper-I (for Classes I to V) and Paper-II (for Classes VI to VIII). Minimum 60% score required to qualify.',
      exam_pattern: {
        stages: [
          { name: 'Paper-I (Primary)', questions: 150, marks: 150, duration: '150 Mins', sections: ['Child Development & Pedagogy (30)', 'Language-I (30)', 'Language-II (30)', 'Mathematics (30)', 'Environmental Studies (30)'] },
          { name: 'Paper-II (Elementary)', questions: 150, marks: 150, duration: '150 Mins', sections: ['CDP (30)', 'Language-I (30)', 'Language-II (30)', 'Maths & Science OR Social Studies (60)'] }
        ]
      },
      detailed_syllabus: {
        pedagogy: ['Child Development, Concept of Inclusive Education, Learning and Pedagogy'],
        subjects: ['Language comprehension & pedagogy', 'Mathematics and Environmental Studies core concepts']
      },
      official_notification_link: 'https://ctet.nic.in',
      notification_status: 'upcoming',
      notification_date: '2026-03-15',
      application_deadline: '2026-04-10',
      vacancies: 0,
      salary_range: 'PRT: ₹35,400 / TGT: ₹44,900 / PGT: ₹47,600 (KVS/NVS Scale)',
      is_featured: false
    }
  ];

  const exams = {};
  for (const ex of examsData) {
    const catId = categories[ex.category];
    const res = await query(`
      INSERT INTO exams (
        category_id, slug, title, code, overview, eligibility, age_criteria, 
        educational_qualification, selection_process, exam_pattern, detailed_syllabus, 
        official_notification_link, notification_status, notification_date, application_deadline, 
        vacancies, salary_range, is_featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING id, slug
    `, [
      catId, ex.slug, ex.title, ex.code, ex.overview, ex.eligibility, ex.age_criteria,
      ex.educational_qualification, ex.selection_process, JSON.stringify(ex.exam_pattern), JSON.stringify(ex.detailed_syllabus),
      ex.official_notification_link, ex.notification_status, ex.notification_date, ex.application_deadline,
      ex.vacancies, ex.salary_range, ex.is_featured
    ]);
    exams[res.rows[0].slug] = res.rows[0].id;
  }
  console.log('✅ Exams seeded');

  // Link primary and favourite exams to student
  await query(`
    INSERT INTO user_exams (user_id, exam_id, is_favourite, is_primary, preparation_percentage)
    VALUES 
    ($1, $2, true, true, 68),
    ($1, $3, true, false, 42),
    ($1, $4, false, false, 25)
  `, [studentId, exams['upsc-civil-services'], exams['appsc-group-2'], exams['ssc-cgl']]);

  // 4. Subjects
  const subjectsData = [
    { slug: 'polity-governance', name: 'Indian Polity & Governance', code: 'POL-01', icon: 'Landmark', color: 'bloom-lavender', desc: 'Constitution, Fundamental Rights, Parliament, Judiciary & Federal Structure.' },
    { slug: 'indian-economy', name: 'Indian Economy & Schemes', code: 'ECO-02', icon: 'TrendingUp', color: 'bloom-green', desc: 'Monetary Policy, Union Budget, Inflation, Banking System & Economic Surveys.' },
    { slug: 'indian-history', name: 'Indian History & Culture', code: 'HIS-03', icon: 'Scroll', color: 'bloom-pink', desc: 'Ancient, Medieval, Freedom Struggle, Modern India & Art and Architecture.' },
    { slug: 'geography-environment', name: 'Geography & Ecology', code: 'GEO-04', icon: 'Globe2', color: 'bloom-green', desc: 'Physical, Human & Economic Geography, Climate Change, Biodiversity & Parks.' },
    { slug: 'quantitative-aptitude', name: 'Quantitative Aptitude', code: 'QNT-05', icon: 'Calculator', color: 'bloom-lavender', desc: 'Arithmetic, Algebra, Geometry, Data Interpretation, Speed Maths & Equations.' },
    { slug: 'reasoning-ability', name: 'Logical Reasoning', code: 'RSN-06', icon: 'BrainCircuit', color: 'bloom-pink', desc: 'Puzzles, Syllogisms, Blood Relations, Coding-Decoding & Critical Reasoning.' },
    { slug: 'general-science', name: 'General Science & Tech', code: 'SCI-07', icon: 'FlaskConical', color: 'bloom-lavender', desc: 'Physics, Chemistry, Biology, Space Missions, AI, Defence & Biotechnology.' },
    { slug: 'andhra-pradesh-gk', name: 'Andhra Pradesh History & GK', code: 'AP-08', icon: 'MapPin', color: 'bloom-green', desc: 'Satavahanas, Kakatiyas, AP Reorganisation Act 2014, Navaratnalu & State Schemes.' }
  ];

  const subjects = {};
  for (const s of subjectsData) {
    const res = await query(
      'INSERT INTO subjects (slug, name, code, icon, color, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, slug',
      [s.slug, s.name, s.code, s.icon, s.color, s.desc]
    );
    subjects[res.rows[0].slug] = res.rows[0].id;
  }
  console.log('✅ Subjects seeded');

  // Link subjects to exams
  const examSubMappings = [
    ['upsc-civil-services', ['polity-governance', 'indian-economy', 'indian-history', 'geography-environment', 'general-science']],
    ['appsc-group-2', ['polity-governance', 'indian-economy', 'andhra-pradesh-gk', 'reasoning-ability', 'geography-environment']],
    ['ssc-cgl', ['quantitative-aptitude', 'reasoning-ability', 'general-science', 'polity-governance']],
    ['rrb-ntpc', ['quantitative-aptitude', 'reasoning-ability', 'general-science', 'indian-history']],
    ['ibps-po', ['quantitative-aptitude', 'reasoning-ability', 'indian-economy']]
  ];

  for (const [examSlug, subSlugs] of examSubMappings) {
    const eId = exams[examSlug];
    if (eId) {
      for (const sSlug of subSlugs) {
        const sId = subjects[sSlug];
        if (sId) {
          await query('INSERT INTO exam_subjects (exam_id, subject_id, weightage) VALUES ($1, $2, 20) ON CONFLICT DO NOTHING', [eId, sId]);
        }
      }
    }
  }

  // 5. Topics
  const topicsData = [
    // Polity
    { subject: 'polity-governance', name: 'Preamble & Salient Features of Constitution', desc: 'Philosophical base, 42nd Amendment, Sovereign Socialist Secular Democratic Republic.', hours: 3.5, diff: 'easy' },
    { subject: 'polity-governance', name: 'Fundamental Rights & Directive Principles (Part III & IV)', desc: 'Articles 12-35, writs, basic structure doctrine, DPSP and Fundamental Duties.', hours: 5.0, diff: 'hard' },
    { subject: 'polity-governance', name: 'Parliament & State Legislatures', desc: 'Lok Sabha, Rajya Sabha, legislative procedure, money bills, parliamentary committees.', hours: 4.5, diff: 'medium' },
    { subject: 'polity-governance', name: 'Panchayati Raj & Urban Local Bodies (73rd & 74th Amendments)', desc: 'Three-tier local self-governance, Gram Sabha, State Election & Finance Commissions.', hours: 3.0, diff: 'medium' },
    // Economy
    { subject: 'indian-economy', name: 'Monetary Policy & RBI Framework', desc: 'Repo Rate, Reverse Repo, CRR, SLR, Open Market Operations, MPC structure.', hours: 4.0, diff: 'medium' },
    { subject: 'indian-economy', name: 'Union Budget & Fiscal Policy', desc: 'Revenue vs Capital budget, Fiscal Deficit, Primary Deficit, FRBM Act.', hours: 3.5, diff: 'medium' },
    // History
    { subject: 'indian-history', name: 'Indus Valley Civilization & Vedic Age', desc: 'Town planning, Harappan trade, seals, Rig Vedic vs Later Vedic society.', hours: 3.0, diff: 'easy' },
    { subject: 'indian-history', name: 'Indian National Movement (1885 - 1947)', desc: 'INC formation, Moderate vs Extremist phase, Gandhian movements, Quit India, Independence.', hours: 6.0, diff: 'hard' },
    // Quant
    { subject: 'quantitative-aptitude', name: 'Percentages, Profit & Loss and Discounts', desc: 'Concept of fractional equivalents, successive percentage changes, markup and discounts.', hours: 4.0, diff: 'medium' },
    { subject: 'quantitative-aptitude', name: 'Time, Speed & Distance and Trains', desc: 'Relative speed, trains crossing platforms/poles, boats and streams, circular tracks.', hours: 4.5, diff: 'hard' },
    // Reasoning
    { subject: 'reasoning-ability', name: 'Syllogisms & Logical Deductions', desc: 'Venn diagram approach, Some/All/No/Some Not, reverse syllogisms.', hours: 3.5, diff: 'medium' },
    { subject: 'reasoning-ability', name: 'Seating Arrangements & Complex Puzzles', desc: 'Circular, linear, square tables with inward/outward facing multi-parameter variables.', hours: 5.5, diff: 'hard' },
    // AP GK
    { subject: 'andhra-pradesh-gk', name: 'AP Reorganisation Act 2014 & Capital Issue', desc: 'Bifurcation provisions, Schedule 9 & 10 institutions, Special Category Status debate.', hours: 4.0, diff: 'medium' },
    { subject: 'andhra-pradesh-gk', name: 'Socio-Cultural History of Andhra (Satavahanas to Vijayanagara)', desc: 'Amaravati art, Hala, Gautamiputra Satakarni, Krishnadevaraya golden era.', hours: 4.5, diff: 'medium' }
  ];

  const topics = {};
  for (const t of topicsData) {
    const sId = subjects[t.subject];
    const res = await query(
      'INSERT INTO topics (subject_id, name, description, estimated_hours, difficulty) VALUES ($1, $2, $3, $4, $5) RETURNING id, name',
      [sId, t.name, t.desc, t.hours, t.diff]
    );
    topics[t.name] = res.rows[0].id;
  }
  console.log('✅ Topics seeded');

  // 6. Lessons
  const lessonsData = [
    {
      topic: 'Preamble & Salient Features of Constitution',
      title: 'Decoding the Preamble of the Indian Constitution',
      content: `The Preamble to the Constitution of India is an introductory statement that explains the document's philosophy and objectives. In a historic ruling in the Kesavananda Bharati case (1973), the Supreme Court held that the Preamble is an integral part of the Constitution and can be amended under Article 368, provided that the 'Basic Structure' is not altered.

### Key Terminology:
1. **Sovereign**: India is completely independent and not subject to the control of any external authority.
2. **Socialist**: Added by the 42nd Constitutional Amendment Act of 1976. Refers to democratic socialism where both public and private sectors co-exist.
3. **Secular**: Added by the 42nd Amendment. All religions in India enjoy equal status and support from the State.
4. **Democratic**: Governed by representatives elected by the people based on universal adult suffrage.
5. **Republic**: The head of the state (President of India) is elected by the people, not a hereditary monarch.

### Crucial Judicial Milestones:
- **Berubari Union Case (1960)**: Supreme Court stated that Preamble is NOT a part of the Constitution.
- **Kesavananda Bharati Case (1973)**: Overruled Berubari, declared Preamble IS an integral part of the Constitution.
- **LIC of India Case (1995)**: Reaffirmed that Preamble is an integral part of the Constitution.`,
      reading_time_mins: 8,
      is_important: true,
      summary: 'The Preamble acts as the identity card of the Indian Constitution, framing justice, liberty, equality, and fraternity as its supreme goals.',
      key_points: ['Preamble was adopted on 26 November 1949', 'Amended only ONCE by the 42nd Amendment Act 1976', 'Added three words: Socialist, Secular, and Integrity', 'Non-justiciable: its provisions are not enforceable in courts']
    },
    {
      topic: 'Fundamental Rights & Directive Principles (Part III & IV)',
      title: 'Article 21: Right to Life and Personal Liberty',
      content: `Article 21 declares: "No person shall be deprived of his life or personal liberty except according to procedure established by law." It is available to both citizens and foreigners.

### Shift from Gopalan to Maneka Gandhi:
- **A.K. Gopalan Case (1950)**: The Supreme Court took a narrow view, holding that 'procedure established by law' simply requires a valid statutory enactment without inquiring into its fairness.
- **Maneka Gandhi Case (1978)**: A transformative judgment where the Supreme Court introduced the American concept of 'Due Process of Law'. The Court held that the procedure depriving life or liberty must be "right, just, and fair" and not arbitrary, fanciful, or oppressive.

### Implicit Rights Discovered under Article 21:
1. Right to Privacy (K.S. Puttaswamy Case, 2017 - 9-judge bench unanimous)
2. Right to Clean Environment and potable drinking water (Subhash Kumar Case)
3. Right to Free Legal Aid (Hussainara Khatoon Case)
4. Right to Speedy Trial
5. Right to Livelihood (Olga Tellis Case)
6. Right to Education (added as 21A via 86th Amendment 2002)`,
      reading_time_mins: 12,
      is_important: true,
      summary: 'Article 21 is the heart and soul of fundamental rights, expanded through judicial activism to encompass dignified human existence.',
      key_points: ['Cannot be suspended even during National Emergency (Articles 20 & 21 protected by 44th Amendment)', 'K.S. Puttaswamy established Right to Privacy as intrinsic to Article 21', 'Applies to every human person, not just citizens']
    },
    {
      topic: 'Monetary Policy & RBI Framework',
      title: 'Quantitative Tools of RBI Monetary Policy',
      content: `The Reserve Bank of India (RBI) utilizes several monetary policy instruments to regulate liquidity, control inflation, and support economic growth in accordance with the Flexible Inflation Targeting (FIT) framework (4% +/- 2% CPI).

### Primary Policy Rates:
1. **Repo Rate (Repurchasing Option)**: The rate at which the RBI lends short-term money to commercial banks against government securities. When Repo increases, borrowing becomes expensive, lowering money supply and curbing inflation.
2. **Reverse Repo Rate**: The rate at which RBI borrows funds from commercial banks.
3. **Standing Deposit Facility (SDF)**: Introduced in 2022 as the new floor of the Liquidity Adjustment Facility (LAF) corridor, allowing RBI to absorb uncollateralized liquidity.
4. **Marginal Standing Facility (MSF)**: Penal rate at which banks can borrow overnight funds from RBI over and above the LAF quota by dipping into their SLR securities.

### Reserve Ratios:
- **Cash Reserve Ratio (CRR)**: The percentage of Net Demand and Time Liabilities (NDTL) that banks must keep with RBI in cash form. No interest is paid by RBI on CRR.
- **Statutory Liquidity Ratio (SLR)**: The percentage of NDTL that banks must maintain with themselves in liquid assets like Gold, Cash, or approved Government Securities (G-Secs).`,
      reading_time_mins: 10,
      is_important: true,
      summary: 'Quantitative tools affect the overall volume of money supply and credit in the economy without discriminating between sectors.',
      key_points: ['Inflation target: 4% with tolerance band of 2% to 6%', 'Monetary Policy Committee (MPC) has 6 members (3 RBI + 3 Govt appointed)', 'RBI Governor holds casting vote in case of a tie']
    },
    {
      topic: 'Percentages, Profit & Loss and Discounts',
      title: 'Mastering Fractional Multipliers & Successive Changes',
      content: `In competitive examinations like SSC CGL, RRB NTPC, and Banking, speed and mental math are paramount. Using fractional equivalents saves up to 70% calculation time.

### Standard Fractional Equivalents:
- 1/2 = 50% | 1/3 = 33.33% | 1/4 = 25% | 1/5 = 20%
- 1/6 = 16.66% | 1/7 = 14.28% | 1/8 = 12.5% | 1/9 = 11.11%
- 1/11 = 9.09% | 1/12 = 8.33% | 1/16 = 6.25%

### Successive Percentage Formula:
Net Change = a + b + (ab / 100)%
Where an increase is positive and a discount/decrease is negative.

### Single Equivalent Discount for two successive discounts D1 and D2:
Equivalent Discount = D1 + D2 - (D1 * D2 / 100)%

*Example*: Two successive discounts of 20% and 10% on an item:
Equivalent Discount = 20 + 10 - (200 / 100) = 28% (Not 30%!)`,
      reading_time_mins: 7,
      is_important: true,
      summary: 'Mastering conversion between percentages and fractions is the foundation for arithmetic mastery in competitive exams.',
      key_points: ['Cost Price (CP) is always considered 100% baseline for profit/loss calculation', 'Discount is always calculated on Marked Price (MP)', 'Profit % = (SP - CP)/CP * 100']
    }
  ];

  for (const l of lessonsData) {
    const tId = topics[l.topic];
    if (tId) {
      await query(`
        INSERT INTO lessons (topic_id, title, content, reading_time_mins, is_important, summary, key_points)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [tId, l.title, l.content, l.reading_time_mins, l.is_important, l.summary, JSON.stringify(l.key_points)]);
    }
  }
  console.log('✅ Lessons seeded');

  // 7. Study Materials
  const materialsData = [
    {
      subject: 'polity-governance',
      title: 'Indian Constitution at a Glance - Complete Articles & Schedules Mindmap',
      material_type: 'notes',
      content_summary: 'Comprehensive 45-page visual guide covering Articles 1 to 395, all 12 Schedules, and 106 Constitutional Amendments with landmark Supreme Court judgements.',
      page_count: 45,
      download_count: 1420
    },
    {
      subject: 'polity-governance',
      title: 'Preamble & Fundamental Rights High-Yield Revision PDF',
      material_type: 'pdf',
      content_summary: 'Quick revision charts for Articles 14 to 32, writ jurisdictions (Habeas Corpus, Mandamus, Quo-Warranto), and reasonable restrictions.',
      page_count: 18,
      download_count: 2890
    },
    {
      subject: 'indian-economy',
      title: 'Union Budget 2026-27 & Economic Survey Key Highlights Handbook',
      material_type: 'pdf',
      content_summary: 'Detailed summary of capital expenditure, fiscal deficit targets, taxation slabs, Capex allocation to railways, and green energy initiatives.',
      page_count: 32,
      download_count: 3150
    },
    {
      subject: 'quantitative-aptitude',
      title: 'Speed Maths & 50 Vedic Maths Shortcuts Formula Book',
      material_type: 'concept_card',
      content_summary: 'Fast multiplication, square root tricks, cube roots, percentage conversion tables, and digital sum methods for rapid exam calculations.',
      page_count: 12,
      download_count: 4120
    },
    {
      subject: 'andhra-pradesh-gk',
      title: 'AP Reorganisation Act 2014 & Socio-Economic Survey of AP',
      material_type: 'pdf',
      content_summary: 'Complete guide for APPSC Group 1 & 2 aspirants covering all 108 sections of the Bifurcation Act, Polavaram project status, and key state welfare schemes.',
      page_count: 64,
      download_count: 1980
    }
  ];

  for (const m of materialsData) {
    const sId = subjects[m.subject];
    await query(`
      INSERT INTO study_materials (subject_id, title, material_type, content_summary, page_count, download_count)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [sId, m.title, m.material_type, m.content_summary, m.page_count, m.download_count]);
  }
  console.log('✅ Study Materials seeded');

  // 8. Questions for Daily Practice & Mock Tests
  const questionsData = [
    {
      subject: 'polity-governance',
      text: 'Which Constitutional Amendment Act added the terms "Socialist", "Secular", and "Integrity" to the Preamble of the Constitution of India?',
      opt_a: '44th Constitutional Amendment Act, 1978',
      opt_b: '42nd Constitutional Amendment Act, 1976',
      opt_c: '52nd Constitutional Amendment Act, 1985',
      opt_d: '86th Constitutional Amendment Act, 2002',
      correct: 'B',
      explanation: 'The 42nd Constitutional Amendment Act of 1976 (known as the Mini-Constitution) added three new words to the Preamble: "Socialist", "Secular", and "Integrity". This was enacted during the Prime Ministership of Indira Gandhi.',
      diff: 'easy',
      marks: 1.0,
      neg: 0.33,
      pyq: 'UPSC CSE 2021 & SSC CGL 2023'
    },
    {
      subject: 'polity-governance',
      text: 'Under Article 32 of the Constitution, which writ is issued to prevent an inferior court or tribunal from exceeding its jurisdiction or usurping a jurisdiction with which it is not legally vested?',
      opt_a: 'Habeas Corpus',
      opt_b: 'Mandamus',
      opt_c: 'Prohibition',
      opt_d: 'Quo-Warranto',
      correct: 'C',
      explanation: 'The writ of Prohibition is issued by a higher court (Supreme Court or High Court) to an inferior court or tribunal to prevent it from usurping or exceeding jurisdiction that it does not possess. It is preventive in nature, unlike Certiorari which is both preventive and curative.',
      diff: 'medium',
      marks: 2.0,
      neg: 0.66,
      pyq: 'UPSC CSE 2022'
    },
    {
      subject: 'polity-governance',
      text: 'The historic "Basic Structure Doctrine" of the Indian Constitution was propounded by the Supreme Court in which landmark case?',
      opt_a: 'Golaknath v. State of Punjab (1967)',
      opt_b: 'Minerva Mills v. Union of India (1980)',
      opt_c: 'Kesavananda Bharati v. State of Kerala (1973)',
      opt_d: 'Waman Rao v. Union of India (1981)',
      correct: 'C',
      explanation: 'In the landmark Kesavananda Bharati case (1973), a 13-judge constitutional bench ruled by a 7:6 majority that Parliament has wide powers to amend the Constitution under Article 368, but it cannot alter or destroy its "Basic Structure".',
      diff: 'easy',
      marks: 2.0,
      neg: 0.66,
      pyq: 'APPSC Group 1 2023'
    },
    {
      subject: 'indian-economy',
      text: 'What is the target inflation band mandated by the Government of India for the Reserve Bank of India’s Monetary Policy Committee (MPC)?',
      opt_a: '3% with a tolerance band of +/- 1%',
      opt_b: '4% with a tolerance band of +/- 2%',
      opt_c: '5% with a tolerance band of +/- 1%',
      opt_d: '2% with a tolerance band of +/- 2%',
      correct: 'B',
      explanation: 'Under the Flexible Inflation Targeting (FIT) framework established in 2016 under Section 45ZA of the RBI Act 1934, the inflation target for the MPC is 4% Consumer Price Index (CPI) combined, with an upper tolerance limit of 6% and a lower tolerance limit of 2%.',
      diff: 'easy',
      marks: 1.0,
      neg: 0.33,
      pyq: 'IBPS PO 2023 & RBI Grade B'
    },
    {
      subject: 'indian-economy',
      text: 'Which instrument was introduced by the Reserve Bank of India in April 2022 as the new floor rate for the Liquidity Adjustment Facility (LAF) corridor to absorb uncollateralised liquidity?',
      opt_a: 'Marginal Standing Facility (MSF)',
      opt_b: 'Standing Deposit Facility (SDF)',
      opt_c: 'Market Stabilization Scheme (MSS)',
      opt_d: 'Fixed Rate Reverse Repo (FRRR)',
      correct: 'B',
      explanation: 'In April 2022, RBI operationalized the Standing Deposit Facility (SDF) at 25 basis points below the Repo Rate. Unlike Reverse Repo, the SDF does not require RBI to provide government securities as collateral when absorbing surplus funds from commercial banks.',
      diff: 'hard',
      marks: 2.0,
      neg: 0.66,
      pyq: 'UPSC CSE 2023'
    },
    {
      subject: 'quantitative-aptitude',
      text: 'A shopkeeper marks an article 40% above its cost price and then allows a discount of 25% on the marked price. What is his net profit or loss percentage?',
      opt_a: '5% Profit',
      opt_b: '10% Profit',
      opt_c: '5% Loss',
      opt_d: '15% Profit',
      correct: 'A',
      explanation: 'Let Cost Price (CP) = 100.\nMarked Price (MP) = 100 + 40% of 100 = 140.\nDiscount = 25% of 140 = (1/4) * 140 = 35.\nSelling Price (SP) = 140 - 35 = 105.\nProfit = SP - CP = 105 - 100 = 5% Profit.',
      diff: 'easy',
      marks: 2.0,
      neg: 0.5,
      pyq: 'SSC CGL 2024 Tier 1'
    },
    {
      subject: 'quantitative-aptitude',
      text: 'A train 240 metres long crosses a telegraph post in 16 seconds. How long will it take to cross a railway platform 360 metres long at the same speed?',
      opt_a: '32 seconds',
      opt_b: '40 seconds',
      opt_c: '36 seconds',
      opt_d: '45 seconds',
      correct: 'B',
      explanation: 'Speed of train = Distance / Time = 240 m / 16 s = 15 m/s.\nWhen crossing platform, total distance = Length of train + Length of platform = 240 + 360 = 600 m.\nTime taken = Total Distance / Speed = 600 m / 15 m/s = 40 seconds.',
      diff: 'medium',
      marks: 1.0,
      neg: 0.33,
      pyq: 'RRB NTPC 2022 Stage 1'
    },
    {
      subject: 'reasoning-ability',
      text: 'Statements: \n1. All roses are flowers.\n2. Some flowers are jasmines.\nConclusions: \nI. Some roses are jasmines.\nII. Some jasmines are flowers.',
      opt_a: 'Only conclusion I follows',
      opt_b: 'Only conclusion II follows',
      opt_c: 'Either I or II follows',
      opt_d: 'Both I and II follow',
      correct: 'B',
      explanation: 'From Statement 2 ("Some flowers are jasmines"), its direct conversion is "Some jasmines are flowers". Hence Conclusion II definitely follows. Roses and Jasmines do not have an overlap stated, so Conclusion I is only possible, not definite.',
      diff: 'easy',
      marks: 1.0,
      neg: 0.25,
      pyq: 'IBPS Clerk 2023 & SSC CHSL'
    },
    {
      subject: 'andhra-pradesh-gk',
      text: 'According to the Andhra Pradesh Reorganisation Act, 2014, how many districts were originally allocated to the successor State of Andhra Pradesh at the time of bifurcation on June 2, 2014?',
      opt_a: '10 districts',
      opt_b: '13 districts',
      opt_c: '26 districts',
      opt_d: '15 districts',
      correct: 'B',
      explanation: 'At the time of bifurcation in 2014, the successor state of Andhra Pradesh comprised 13 districts (9 in Coastal Andhra and 4 in Rayalaseema). In April 2022, these were reorganized into 26 districts.',
      diff: 'medium',
      marks: 1.0,
      neg: 0.33,
      pyq: 'APPSC Group 2 2024'
    },
    {
      subject: 'andhra-pradesh-gk',
      text: 'Which famous ruler of the Satavahana dynasty authored the Prakrit poetic anthology "Gaha Sattasai" (Gatha Saptasati)?',
      opt_a: 'Gautamiputra Satakarni',
      opt_b: 'Hala',
      opt_c: 'Simuka',
      opt_d: 'Yajna Sri Satakarni',
      correct: 'B',
      explanation: 'King Hala, the 17th Satavahana king, was a great patron of literature and authored "Gatha Saptasati" (Gaha Sattasai), a collection of 700 erotic and pastoral poems written in Maharashtri Prakrit.',
      diff: 'medium',
      marks: 1.0,
      neg: 0.33,
      pyq: 'APPSC Group 1 & 2'
    }
  ];

  const questionIds = [];
  for (const q of questionsData) {
    const sId = subjects[q.subject];
    const res = await query(`
      INSERT INTO questions (
        subject_id, question_text, option_a, option_b, option_c, option_d, 
        correct_option, explanation, difficulty, marks, negative_marks, previous_year_ref
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `, [sId, q.text, q.opt_a, q.opt_b, q.opt_c, q.opt_d, q.correct, q.explanation, q.diff, q.marks, q.neg, q.pyq]);
    questionIds.push(res.rows[0].id);
  }
  console.log('✅ Practice Questions seeded');

  // 9. Mock Tests
  const mockTestsData = [
    {
      exam: 'upsc-civil-services',
      title: 'UPSC CSE Prelims GS Paper-1 Full-Length All-India Mock 01',
      desc: 'Designed strictly according to the latest UPSC CSE trend with assertion-reasoning, match-the-column, and statement-based questions.',
      duration: 120,
      total_marks: 200,
      passing_marks: 88,
      total_q: 10, // scaled for interactive mock demo
      neg_mark: 0.66,
      instructions: '1. Total time: 120 minutes. 2. Each correct answer carries 2 marks. 3. Negative marking: 0.66 marks deducted for every wrong answer. 4. You can navigate, flag for review, and submit anytime.'
    },
    {
      exam: 'appsc-group-2',
      title: 'APPSC Group 2 Screening Test Full Mock Examination 2026',
      desc: 'Complete coverage of Indian History, Geography, Indian Society, Current Affairs, and Mental Ability as per latest syllabus.',
      duration: 90,
      total_marks: 150,
      passing_marks: 70,
      total_q: 10,
      neg_mark: 0.33,
      instructions: '1. Duration: 90 minutes. 2. 1 mark per question with 1/3 negative marking. 3. Specially curated for Andhra Pradesh aspirants.'
    },
    {
      exam: 'ssc-cgl',
      title: 'SSC CGL Tier-1 Speed & Accuracy Grand Mock Test',
      desc: 'Real exam simulator test with section-wise questions from Quantitative Aptitude, General Intelligence, and General Awareness.',
      duration: 60,
      total_marks: 200,
      passing_marks: 135,
      total_q: 10,
      neg_mark: 0.50,
      instructions: '1. Duration: 60 minutes. 2. Real exam CBT interface. 3. 2 marks per question with 0.50 negative marking.'
    }
  ];

  for (const mt of mockTestsData) {
    const eId = exams[mt.exam];
    const res = await query(`
      INSERT INTO mock_tests (
        exam_id, title, description, duration_minutes, total_marks, passing_marks, 
        total_questions, negative_marking_per_q, instructions, attempts_count, avg_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 342, 64.5)
      RETURNING id
    `, [eId, mt.title, mt.desc, mt.duration, mt.total_marks, mt.passing_marks, mt.total_q, mt.neg_mark, mt.instructions]);

    const mockId = res.rows[0].id;
    // Map questions to mock test
    for (let i = 0; i < questionIds.length; i++) {
      await query(`
        INSERT INTO mock_test_questions (mock_test_id, question_id, order_index)
        VALUES ($1, $2, $3)
      `, [mockId, questionIds[i], i + 1]);
    }
  }
  console.log('✅ Mock Tests seeded');

  // Seed sample test attempt for student
  const mockTestFirst = await query('SELECT id, exam_id FROM mock_tests LIMIT 1');
  if (mockTestFirst.rows.length > 0) {
    await query(`
      INSERT INTO test_attempts (
        user_id, mock_test_id, exam_id, total_questions, attempted, correct_answers, 
        wrong_answers, skipped, total_score, percentage, accuracy, time_taken_seconds, status
      ) VALUES ($1, $2, $3, 10, 9, 8, 1, 1, 15.34, 76.7, 88.9, 1420, 'completed')
    `, [studentId, mockTestFirst.rows[0].id, mockTestFirst.rows[0].exam_id]);
  }

  // 10. Current Affairs
  const caData = [
    {
      title: 'Union Cabinet Approves Major Semiconductor & Quantum Computing Incentives',
      category: 'economy',
      summary: 'Government expands India Semiconductor Mission (ISM) with additional capital subsidy outlay to bolster domestic fabrication units and AI hardware clusters.',
      full_content: `The Union Cabinet, chaired by the Prime Minister, has approved an augmented financial outlay under the India Semiconductor Mission (ISM 2.0). The policy focuses on advanced packaging, fabless design incentives, and indigenous intellectual property development. This initiative is geared towards reducing India's electronics import bill and positioning India as a global manufacturing hub alongside key Quad and European partners.`,
      source: 'Press Information Bureau (PIB)',
      pub_date: '2026-11-20',
      month_year: 'November 2026',
      trending: true,
      tags: ['Economy', 'Technology', 'PIB', 'UPSC GS-3']
    },
    {
      title: 'Andhra Pradesh Unveils Integrated Clean Energy Policy 2026-2030',
      category: 'andhra_pradesh',
      summary: 'AP Government launches massive renewable energy roadmap targeting 50 GW solar and wind energy alongside green hydrogen corridors at Visakhapatnam and Machilipatnam.',
      full_content: `The Government of Andhra Pradesh has officially notified the Integrated Clean Energy Policy. The policy aims to attract ₹10 lakh crore in private and public investments over the next decade. Key highlights include dedicated land allotments for pumped storage hydro projects, zero transmission charges for 5 years for green ammonia plants, and establishing Visakhapatnam as India's Green Maritime Hub.`,
      source: 'The Hindu & AP Gazette',
      pub_date: '2026-11-18',
      month_year: 'November 2026',
      trending: true,
      tags: ['Andhra Pradesh', 'Green Energy', 'APPSC Group 1', 'Environment']
    },
    {
      title: 'Supreme Court Validates Federal Principles on Centre-State Financial Allocations',
      category: 'national',
      summary: 'A constitution bench reiterates that the Finance Commission recommendations must harmonize national priorities with equitable fiscal distribution to coastal and southern states.',
      full_content: `In a landmark pronouncement on Centre-State financial relations, the Supreme Court stressed that fiscal federalism is part of the basic structure of the Constitution. The 16th Finance Commission has been urged to balance demographic performance incentives with horizontal equity metrics to ensure state autonomy in welfare schemes.`,
      source: 'Indian Express',
      pub_date: '2026-11-15',
      month_year: 'November 2026',
      trending: false,
      tags: ['Polity', 'Supreme Court', 'Finance Commission', 'Federalism']
    },
    {
      title: 'India Achieves Historic 125 Medals at Asian Games 2026',
      category: 'sports',
      summary: 'Indian contingent registers its highest-ever medal haul, dominating in athletics, shooting, archery, and badminton.',
      full_content: `Indian athletes scripted history by breaching the 120-medal mark at the Asian Games. The performance was spearheaded by world-record shooting scores and unprecedented podium sweeps in javelin throw, steeplechase, and women's wrestling. Sports Authority of India credited the TOPS (Target Olympic Podium Scheme) grassroots expansion.`,
      source: 'DD Sports & Sports Authority of India',
      pub_date: '2026-11-10',
      month_year: 'November 2026',
      trending: true,
      tags: ['Sports', 'Asian Games', 'National Pride']
    },
    {
      title: 'Renowned Scientist Appointed as Chairman of Atomic Energy Regulatory Board (AERB)',
      category: 'appointments',
      summary: 'Distinguished nuclear physicist Dr. R. Sundaram assumes charge as the Chairman of the AERB for a three-year tenure.',
      full_content: `The Appointments Committee of the Cabinet (ACC) has approved the appointment of Dr. Sundaram as head of AERB. He has led India's fast breeder reactor program and small modular reactor (SMR) indigenous design teams at Bhabha Atomic Research Centre (BARC).`,
      source: 'PIB Delhi',
      pub_date: '2026-11-05',
      month_year: 'November 2026',
      trending: false,
      tags: ['Appointments', 'Science & Tech']
    }
  ];

  for (const ca of caData) {
    await query(`
      INSERT INTO current_affairs (title, category, summary, full_content, source, published_date, month_year, is_trending, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [ca.title, ca.category, ca.summary, ca.full_content, ca.source, ca.pub_date, ca.month_year, ca.trending, ca.tags]);
  }
  console.log('✅ Current Affairs seeded');

  // 11. Study Planner sample
  const scheduleData = [
    { day: 'Monday', time: '06:00 AM - 08:00 AM', subject: 'Indian Polity', topic: 'Preamble & Fundamental Rights', status: 'completed' },
    { day: 'Monday', time: '08:30 AM - 10:00 AM', subject: 'Current Affairs', topic: 'Daily Hindu Analysis & PIB', status: 'completed' },
    { day: 'Tuesday', time: '06:00 AM - 08:30 AM', subject: 'Indian Economy', topic: 'Monetary Policy & Inflation targeting', status: 'completed' },
    { day: 'Wednesday', time: '06:00 AM - 08:30 AM', subject: 'Quantitative Aptitude', topic: 'Speed Maths & Percentages Practice', status: 'pending' },
    { day: 'Thursday', time: '06:00 AM - 08:00 AM', subject: 'AP Special GK', topic: 'AP Reorganisation Act Analysis', status: 'pending' },
    { day: 'Friday', time: '06:00 AM - 08:30 AM', subject: 'History & Culture', topic: 'Indian National Movement Revision', status: 'pending' },
    { day: 'Saturday', time: '09:00 AM - 11:00 AM', subject: 'Mock Test Simulator', topic: 'Full UPSC GS-1 Mock Paper', status: 'pending' }
  ];

  await query(`
    INSERT INTO study_plans (user_id, exam_id, title, target_date, daily_hours, schedule_json, completed_tasks, total_tasks)
    VALUES ($1, $2, 'UPSC CSE 2027 180-Day Master Timetable', '2027-05-25', 4.5, $3, 3, 7)
  `, [studentId, exams['upsc-civil-services'], JSON.stringify(scheduleData)]);
  console.log('✅ Study Plan seeded');

  // 12. Notifications
  const notifs = [
    { title: 'UPSC CSE 2026 Prelims Notification Released', msg: 'Application window opened for 1,056 vacancies. Last date: 5th March 2026.', type: 'exam_alert', link: '/exams/upsc-civil-services' },
    { title: 'APPSC Group 2 Prelims Hall Tickets Available', msg: 'Download your examination hall ticket with exam centre confirmation.', type: 'exam_alert', link: '/exams/appsc-group-2' },
    { title: 'Study Streak Active! 🔥', msg: 'You have completed 14 consecutive study days. Keep the momentum going!', type: 'study_reminder', link: '/dashboard' },
    { title: 'Mock Test Analytics Ready 📊', msg: 'Your score in UPSC CSE Prelims Mock 01 is 15.34/20 (Accuracy: 88.9%). Review wrong answers now.', type: 'test_result', link: '/performance' }
  ];

  for (const n of notifs) {
    await query(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES ($1, $2, $3, $4, $5)
    `, [studentId, n.title, n.msg, n.type, n.link]);
  }
  console.log('✅ Notifications seeded');

  // 13. Previous Year Question Papers (PYQ)
  const pyqs = [
    { exam: 'upsc-civil-services', title: 'UPSC Civil Services Prelims 2024 (GS Paper 1)', year: 2024, shift: 'Morning Shift', questions_count: 100, duration: 120 },
    { exam: 'upsc-civil-services', title: 'UPSC Civil Services Prelims 2023 (GS Paper 1)', year: 2023, shift: 'Morning Shift', questions_count: 100, duration: 120 },
    { exam: 'appsc-group-2', title: 'APPSC Group 2 Screening Test 2024', year: 2024, shift: 'General Session', questions_count: 150, duration: 150 },
    { exam: 'ssc-cgl', title: 'SSC CGL Tier 1 Question Paper 2024', year: 2024, shift: 'Shift 2 (12:30 PM)', questions_count: 100, duration: 60 },
    { exam: 'rrb-ntpc', title: 'RRB NTPC Stage 1 CBT 2022', year: 2022, shift: 'Shift 1', questions_count: 100, duration: 90 }
  ];

  for (const p of pyqs) {
    const eId = exams[p.exam];
    if (eId) {
      await query(`
        INSERT INTO pyq_papers (exam_id, title, year, shift_or_paper, questions_count, duration_mins, has_solutions)
        VALUES ($1, $2, $3, $4, $5, $6, true)
      `, [eId, p.title, p.year, p.shift, p.questions_count, p.duration]);
    }
  }
  console.log('✅ Previous Year Papers seeded');

  console.log('🎉 PrepBloom Database seeding finished completely and flawlessly!');
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = { seed };
