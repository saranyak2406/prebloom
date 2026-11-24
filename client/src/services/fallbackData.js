// High-yield fallback data ensuring PrepBloom works seamlessly on Vercel static deployments
export const fallbackData = {
  categories: [
    { id: 1, slug: 'upsc', name: 'UPSC', icon: 'Award', description: 'Union Public Service Commission - All India Services, Civil Services & Central Services', exam_count: 2 },
    { id: 2, slug: 'ssc', name: 'SSC', icon: 'BookCheck', description: 'Staff Selection Commission - Combined Graduate, Higher Secondary & Technical cadres', exam_count: 2 },
    { id: 3, slug: 'railway', name: 'Railways (RRB)', icon: 'Train', description: 'Railway Recruitment Board - NTPC, Group D, ALP & Technical Posts', exam_count: 1 },
    { id: 4, slug: 'state-psc', name: 'State PSC', icon: 'Landmark', description: 'State Public Service Commissions (APPSC Group 1-4, TSPSC, TNPSC & Others)', exam_count: 2 },
    { id: 5, slug: 'banking', name: 'Banking & Insurance', icon: 'Building2', description: 'IBPS PO/Clerk, SBI PO/Clerk, RBI Grade B & Insurance examinations', exam_count: 2 },
    { id: 6, slug: 'defence', name: 'Defence Services', icon: 'ShieldAlert', description: 'National Defence Academy, CDS, AFCAT, Indian Coast Guard & Agniveer', exam_count: 1 },
    { id: 7, slug: 'police', name: 'Police Recruitment', icon: 'BadgeCheck', description: 'State Police Sub-Inspectors, Constables, SSC CPO & CAPF', exam_count: 1 },
    { id: 8, slug: 'other', name: 'Other Recruitment', icon: 'GraduationCap', description: 'Teaching (CTET/TET), Court Recruitment, Postal & Statutory bodies', exam_count: 1 }
  ],

  exams: [
    {
      id: 1,
      category_id: 1,
      slug: 'upsc-civil-services',
      title: 'UPSC Civil Services Examination (IAS / IPS / IFS)',
      code: 'CSE-2026',
      category_name: 'UPSC',
      category_slug: 'upsc',
      overview: 'The premier competitive examination in India conducted by UPSC for recruitment to higher civil services including Indian Administrative Service (IAS), Indian Police Service (IPS), and Indian Foreign Service (IFS).',
      eligibility: 'Must be a Citizen of India (for IAS/IPS). Any recognized Bachelor degree.',
      age_criteria: '21 to 32 years (Relaxations: OBC - 3 years, SC/ST - 5 years). Max 6 attempts.',
      educational_qualification: 'Graduate from any recognized university in any discipline.',
      selection_process: 'Three-stage selection: 1. Prelims (Objective) 2. Mains (Written Descriptive) 3. Personality Test (Interview).',
      notification_status: 'active',
      vacancies: 1056,
      salary_range: '₹56,100 - ₹2,50,000 (Pay Level 10 to Cabinet Secretary)',
      is_featured: true,
      official_notification_link: 'https://upsc.gov.in',
      exam_pattern: {
        stages: [
          { name: 'Prelims GS-1', questions: 100, marks: 200, duration: '2 Hours', negative: '0.66 marks' },
          { name: 'Prelims CSAT', questions: 80, marks: 200, duration: '2 Hours', negative: '0.83 marks' },
          { name: 'Mains Written', papers: 9, marks: 1750, duration: 'Descriptive' },
          { name: 'Personality Test', marks: 275, duration: '30-40 Mins' }
        ]
      },
      detailed_syllabus: {
        prelims_gs1: ['Current Events of National & International Importance', 'Indian National Movement', 'Indian and World Geography', 'Indian Polity & Governance', 'Economic and Social Development', 'General Science & Environment'],
        csat: ['Reading Comprehension', 'Logical reasoning and analytical ability', 'Basic numeracy Class X level']
      }
    },
    {
      id: 6,
      category_id: 4,
      slug: 'appsc-group-2',
      title: 'APPSC Group 2 Services (Andhra Pradesh)',
      code: 'APPSC-GRP2-2026',
      category_name: 'State PSC',
      category_slug: 'state-psc',
      overview: 'Prestigious executive and non-executive posts in Andhra Pradesh such as Assistant Section Officer (ASO), Deputy Tahsildar, Sub-Registrar Grade-II, and Municipal Commissioner Grade-III.',
      eligibility: 'Bachelor’s degree from any recognized university in India.',
      age_criteria: '18 to 42 years as per AP State Govt norms.',
      educational_qualification: 'Graduation in any stream.',
      selection_process: 'Screening Test (Prelims 150 Marks) -> Mains Examination (300 Marks) -> Computer Proficiency Test (CPT).',
      notification_status: 'active',
      vacancies: 897,
      salary_range: '₹37,640 - ₹95,490',
      is_featured: true,
      official_notification_link: 'https://psc.ap.gov.in',
      exam_pattern: {
        stages: [
          { name: 'Prelims Screening', questions: 150, marks: 150, duration: '150 Mins', negative: '0.33 marks' },
          { name: 'Mains Paper-I', questions: 150, marks: 150, duration: '150 Mins', negative: '0.33 marks' },
          { name: 'Mains Paper-II', questions: 150, marks: 150, duration: '150 Mins', negative: '0.33 marks' }
        ]
      },
      detailed_syllabus: {
        prelims: ['Indian History', 'Geography', 'Indian Society', 'Current Affairs', 'Mental Ability'],
        mains: ['Social & Cultural History of AP', 'Indian Constitution', 'Indian & AP Economy', 'Science & Technology']
      }
    },
    {
      id: 3,
      category_id: 2,
      slug: 'ssc-cgl',
      title: 'SSC CGL (Combined Graduate Level)',
      code: 'CGL-2026',
      category_name: 'SSC',
      category_slug: 'ssc',
      overview: 'Premier group B & C staff recruitment including Income Tax Inspector, GST Inspector, ED, and CBI Sub-Inspector.',
      eligibility: 'Bachelor’s Degree in any discipline from a recognized University.',
      age_criteria: '18 to 32 years (varies per post).',
      educational_qualification: 'Graduate from any recognized university.',
      selection_process: 'Computer-Based Examination Tier-I -> Tier-II -> Document Verification.',
      notification_status: 'upcoming',
      vacancies: 17727,
      salary_range: '₹44,900 - ₹1,42,400',
      is_featured: true,
      official_notification_link: 'https://ssc.gov.in',
      exam_pattern: {
        stages: [
          { name: 'Tier-I (CBT)', questions: 100, marks: 200, duration: '60 Mins', negative: '0.50 marks' },
          { name: 'Tier-II (CBT)', marks: 390, duration: '2 Hours 15 Mins' }
        ]
      },
      detailed_syllabus: {
        tier1: ['General Intelligence & Reasoning', 'General Awareness', 'Quantitative Aptitude', 'English Comprehension']
      }
    },
    {
      id: 7,
      category_id: 3,
      slug: 'rrb-ntpc',
      title: 'RRB NTPC (Non-Technical Popular Categories)',
      code: 'RRB-NTPC-2026',
      category_name: 'Railways (RRB)',
      category_slug: 'railway',
      overview: 'Station Master, Goods Guard, Senior Clerk cum Typist, and Commercial Apprentice in Indian Railways.',
      eligibility: '12th pass (Level 2/3) or Graduate degree (Level 4/5/6).',
      age_criteria: '18 to 33 years.',
      educational_qualification: 'Graduate or 12th pass.',
      selection_process: '1st Stage CBT -> 2nd Stage CBT -> Skill/Aptitude Test -> Document Verification.',
      notification_status: 'active',
      vacancies: 11558,
      salary_range: '₹19,900 - ₹35,400 + Railway Perks',
      is_featured: true,
      official_notification_link: 'https://rrbcdg.gov.in',
      exam_pattern: {
        stages: [
          { name: 'CBT Stage-1', questions: 100, marks: 100, duration: '90 Mins', negative: '0.33 marks' },
          { name: 'CBT Stage-2', questions: 120, marks: 120, duration: '90 Mins', negative: '0.33 marks' }
        ]
      },
      detailed_syllabus: {
        subjects: ['General Awareness', 'Mathematics', 'General Intelligence & Reasoning']
      }
    },
    {
      id: 8,
      category_id: 5,
      slug: 'ibps-po',
      title: 'IBPS PO (Probationary Officers)',
      code: 'IBPS-PO-XVI',
      category_name: 'Banking & Insurance',
      category_slug: 'banking',
      overview: 'Common recruitment for Probationary Officers and Management Trainees in 11 participating public sector banks.',
      eligibility: 'Graduation degree in any discipline.',
      age_criteria: '20 to 30 years.',
      educational_qualification: 'Any Bachelor Degree.',
      selection_process: 'Prelims (Online CBT) -> Mains (Online CBT + Descriptive) -> Interview.',
      notification_status: 'upcoming',
      vacancies: 4455,
      salary_range: '₹52,000 - ₹58,000 gross per month',
      is_featured: true,
      official_notification_link: 'https://ibps.in',
      exam_pattern: {
        stages: [
          { name: 'Prelims', questions: 100, marks: 100, duration: '60 Mins', negative: '0.25 marks' },
          { name: 'Mains', questions: 155, marks: 200, duration: '3 Hours', negative: '0.25 marks' }
        ]
      },
      detailed_syllabus: {
        topics: ['Reasoning Ability', 'Quantitative Aptitude', 'General/Banking Awareness', 'English Language']
      }
    },
    {
      id: 11,
      category_id: 7,
      slug: 'ap-police-si',
      title: 'AP Police Sub-Inspector (SCT SI Civil / AR)',
      code: 'APSLPRB-SI-2026',
      category_name: 'Police Recruitment',
      category_slug: 'police',
      overview: 'Andhra Pradesh State Level Police Recruitment Board examination for Sub-Inspectors of Police in Civil and Armed Reserve.',
      eligibility: 'Local candidate of AP. Any Bachelor Degree.',
      age_criteria: '21 to 27 years (Age relaxations for reserved categories).',
      educational_qualification: 'Any Bachelor Degree.',
      selection_process: 'Preliminary Written Test -> PMT / PET Physical Test -> Final Written Examination.',
      notification_status: 'active',
      vacancies: 411,
      salary_range: '₹44,570 - ₹1,27,480',
      is_featured: true,
      official_notification_link: 'https://slprb.ap.gov.in',
      exam_pattern: {
        stages: [
          { name: 'Prelims Paper-I (Arithmetic & Reasoning)', questions: 100, marks: 100, duration: '3 Hours' },
          { name: 'Prelims Paper-II (General Studies)', questions: 100, marks: 100, duration: '3 Hours' }
        ]
      },
      detailed_syllabus: {
        prelims: ['Arithmetic and Reasoning', 'General Studies (focus on AP History and Indian National Movement)']
      }
    }
  ],

  subjects: [
    { id: 1, slug: 'polity-governance', name: 'Indian Polity & Governance', code: 'POL-01', color: 'bloom-lavender', desc: 'Constitution, Fundamental Rights, Parliament, Judiciary & Federal Structure.', topic_count: 4, lesson_count: 2, material_count: 2 },
    { id: 2, slug: 'indian-economy', name: 'Indian Economy & Schemes', code: 'ECO-02', color: 'bloom-green', desc: 'Monetary Policy, Union Budget, Inflation, Banking System & Economic Surveys.', topic_count: 2, lesson_count: 1, material_count: 1 },
    { id: 3, slug: 'indian-history', name: 'Indian History & Culture', code: 'HIS-03', color: 'bloom-pink', desc: 'Ancient, Medieval, Freedom Struggle, Modern India & Art and Architecture.', topic_count: 2, lesson_count: 1, material_count: 1 },
    { id: 4, slug: 'quantitative-aptitude', name: 'Quantitative Aptitude', code: 'QNT-05', color: 'bloom-lavender', desc: 'Arithmetic, Algebra, Geometry, Data Interpretation, Speed Maths & Equations.', topic_count: 2, lesson_count: 1, material_count: 1 },
    { id: 5, slug: 'andhra-pradesh-gk', name: 'Andhra Pradesh History & GK', code: 'AP-08', color: 'bloom-green', desc: 'Satavahanas, Kakatiyas, AP Reorganisation Act 2014, Navaratnalu & State Schemes.', topic_count: 2, lesson_count: 1, material_count: 1 }
  ],

  questions: [
    {
      id: 1,
      subject_id: 1,
      subject_name: 'Indian Polity & Governance',
      question_text: 'Which Constitutional Amendment Act added the terms "Socialist", "Secular", and "Integrity" to the Preamble of the Constitution of India?',
      option_a: '44th Constitutional Amendment Act, 1978',
      option_b: '42nd Constitutional Amendment Act, 1976',
      option_c: '52nd Constitutional Amendment Act, 1985',
      option_d: '86th Constitutional Amendment Act, 2002',
      correct_option: 'B',
      explanation: 'The 42nd Constitutional Amendment Act of 1976 added "Socialist", "Secular", and "Integrity" to the Preamble under the Indira Gandhi administration.',
      difficulty: 'easy',
      marks: 1.0,
      negative_marks: 0.33,
      previous_year_ref: 'UPSC CSE 2021 & SSC CGL 2023'
    },
    {
      id: 2,
      subject_id: 1,
      subject_name: 'Indian Polity & Governance',
      question_text: 'Under Article 32 of the Constitution, which writ is issued to prevent an inferior court or tribunal from exceeding its jurisdiction?',
      option_a: 'Habeas Corpus',
      option_b: 'Mandamus',
      option_c: 'Prohibition',
      option_d: 'Quo-Warranto',
      correct_option: 'C',
      explanation: 'The writ of Prohibition is issued by a higher court to an inferior court to prevent it from usurping or exceeding its legal jurisdiction.',
      difficulty: 'medium',
      marks: 2.0,
      negative_marks: 0.66,
      previous_year_ref: 'UPSC CSE 2022'
    },
    {
      id: 3,
      subject_id: 2,
      subject_name: 'Indian Economy & Schemes',
      question_text: 'What is the target inflation band mandated by the Government of India for the Reserve Bank of India’s Monetary Policy Committee (MPC)?',
      option_a: '3% with a tolerance band of +/- 1%',
      option_b: '4% with a tolerance band of +/- 2%',
      option_c: '5% with a tolerance band of +/- 1%',
      option_d: '2% with a tolerance band of +/- 2%',
      correct_option: 'B',
      explanation: 'Under the Flexible Inflation Targeting (FIT) framework established in 2016, the target is 4% CPI with a 2% to 6% tolerance band.',
      difficulty: 'easy',
      marks: 1.0,
      negative_marks: 0.33,
      previous_year_ref: 'IBPS PO 2023 & RBI Grade B'
    },
    {
      id: 4,
      subject_id: 4,
      subject_name: 'Quantitative Aptitude',
      question_text: 'A shopkeeper marks an article 40% above its cost price and allows a discount of 25% on the marked price. What is his net profit or loss percentage?',
      option_a: '5% Profit',
      option_b: '10% Profit',
      option_c: '5% Loss',
      option_d: '15% Profit',
      correct_option: 'A',
      explanation: 'Let CP = 100. MP = 140. Discount = 25% of 140 = 35. SP = 140 - 35 = 105. Net Profit = 105 - 100 = 5% Profit.',
      difficulty: 'easy',
      marks: 2.0,
      negative_marks: 0.5,
      previous_year_ref: 'SSC CGL 2024 Tier 1'
    },
    {
      id: 5,
      subject_id: 5,
      subject_name: 'Andhra Pradesh History & GK',
      question_text: 'According to the Andhra Pradesh Reorganisation Act, 2014, how many districts were originally allocated to the successor State of Andhra Pradesh?',
      option_a: '10 districts',
      option_b: '13 districts',
      option_c: '26 districts',
      option_d: '15 districts',
      correct_option: 'B',
      explanation: 'At the time of bifurcation in June 2014, the successor state of Andhra Pradesh comprised 13 districts (9 in Coastal Andhra and 4 in Rayalaseema).',
      difficulty: 'medium',
      marks: 1.0,
      negative_marks: 0.33,
      previous_year_ref: 'APPSC Group 2 2024'
    }
  ],

  mockTests: [
    {
      id: 1,
      exam_id: 1,
      title: 'UPSC CSE Prelims GS Paper-1 Full-Length All-India Mock 01',
      description: 'Strictly aligned to latest UPSC CSE trend with statement-based questions and negative marking.',
      duration_minutes: 120,
      total_marks: 200,
      passing_marks: 88,
      total_questions: 5,
      negative_marking_per_q: 0.66,
      attempts_count: 342,
      category_name: 'UPSC'
    },
    {
      id: 2,
      exam_id: 6,
      title: 'APPSC Group 2 Screening Test Full Mock Examination 2026',
      description: 'Complete coverage of Indian History, Geography, Indian Society, Current Affairs and AP GK.',
      duration_minutes: 90,
      total_marks: 150,
      passing_marks: 70,
      total_questions: 5,
      negative_marking_per_q: 0.33,
      attempts_count: 289,
      category_name: 'State PSC'
    },
    {
      id: 3,
      exam_id: 3,
      title: 'SSC CGL Tier-1 Speed & Accuracy Grand Mock Test',
      description: 'Real exam simulator test with section-wise questions from Quantitative Aptitude and General Awareness.',
      duration_minutes: 60,
      total_marks: 200,
      passing_marks: 135,
      total_questions: 5,
      negative_marking_per_q: 0.50,
      attempts_count: 512,
      category_name: 'SSC'
    }
  ],

  currentAffairs: [
    {
      id: 1,
      title: 'Union Cabinet Approves Major Semiconductor & Quantum Computing Incentives',
      category: 'economy',
      summary: 'Government expands India Semiconductor Mission (ISM) with additional capital subsidy outlay to bolster domestic fabrication units and AI hardware clusters.',
      full_content: 'The Union Cabinet has approved an augmented financial outlay under the India Semiconductor Mission (ISM 2.0). The policy focuses on advanced packaging, fabless design incentives, and indigenous intellectual property development.',
      source: 'Press Information Bureau (PIB)',
      published_date: '2026-11-20',
      month_year: 'November 2026',
      is_trending: true,
      tags: ['Economy', 'Technology', 'PIB', 'UPSC GS-3']
    },
    {
      id: 2,
      title: 'Andhra Pradesh Unveils Integrated Clean Energy Policy 2026-2030',
      category: 'andhra_pradesh',
      summary: 'AP Government launches massive renewable energy roadmap targeting 50 GW solar and wind energy alongside green hydrogen corridors at Visakhapatnam.',
      full_content: 'The Government of Andhra Pradesh has officially notified the Integrated Clean Energy Policy, aiming to attract ₹10 lakh crore in investments over the next decade with dedicated land allotments for pumped storage hydro projects.',
      source: 'The Hindu & AP Gazette',
      published_date: '2026-11-18',
      month_year: 'November 2026',
      is_trending: true,
      tags: ['Andhra Pradesh', 'Green Energy', 'APPSC Group 1']
    },
    {
      id: 3,
      title: 'Supreme Court Validates Federal Principles on Centre-State Financial Allocations',
      category: 'national',
      summary: 'A constitution bench reiterates that the Finance Commission recommendations must harmonize national priorities with equitable fiscal distribution.',
      full_content: 'In a landmark pronouncement on Centre-State financial relations, the Supreme Court stressed that fiscal federalism is part of the basic structure of the Constitution.',
      source: 'Indian Express',
      published_date: '2026-11-15',
      month_year: 'November 2026',
      is_trending: false,
      tags: ['Polity', 'Supreme Court', 'Finance Commission']
    }
  ],

  pyqPapers: [
    { id: 1, title: 'UPSC Civil Services Prelims 2024 (GS Paper 1)', year: 2024, shift_or_paper: 'Morning Shift', questions_count: 100, duration_mins: 120, has_solutions: true, exam_title: 'UPSC Civil Services' },
    { id: 2, title: 'APPSC Group 2 Screening Test 2024', year: 2024, shift_or_paper: 'General Session', questions_count: 150, duration_mins: 150, has_solutions: true, exam_title: 'APPSC Group 2 Services' },
    { id: 3, title: 'SSC CGL Tier 1 Question Paper 2024', year: 2024, shift_or_paper: 'Shift 2 (12:30 PM)', questions_count: 100, duration_mins: 60, has_solutions: true, exam_title: 'SSC CGL' }
  ]
};
