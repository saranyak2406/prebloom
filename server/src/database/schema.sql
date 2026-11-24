-- PrepBloom PostgreSQL Schema
-- All Indian Government Exam Preparation Platform

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student', -- 'student', 'admin'
    avatar TEXT DEFAULT 'https://api.dicebear.com/7.x/bottts/svg?seed=bloom',
    phone VARCHAR(20),
    bio TEXT,
    target_exam VARCHAR(100) DEFAULT 'UPSC Civil Services',
    streak_count INT DEFAULT 1,
    last_active_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    icon VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS exams (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES exam_categories(id) ON DELETE CASCADE,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    overview TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    age_criteria VARCHAR(255) NOT NULL,
    educational_qualification TEXT NOT NULL,
    selection_process TEXT NOT NULL,
    exam_pattern JSONB NOT NULL,
    detailed_syllabus JSONB NOT NULL,
    official_notification_link TEXT,
    notification_status VARCHAR(50) DEFAULT 'active', -- 'active', 'upcoming', 'expired'
    notification_date DATE,
    application_deadline DATE,
    vacancies INT DEFAULT 0,
    salary_range VARCHAR(100),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_exams (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    exam_id INT REFERENCES exams(id) ON DELETE CASCADE,
    is_favourite BOOLEAN DEFAULT false,
    is_primary BOOLEAN DEFAULT false,
    preparation_percentage INT DEFAULT 0,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, exam_id)
);

CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50),
    icon VARCHAR(100) DEFAULT 'BookOpen',
    color VARCHAR(50) DEFAULT 'bloom-green',
    description TEXT
);

CREATE TABLE IF NOT EXISTS exam_subjects (
    exam_id INT REFERENCES exams(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    weightage INT DEFAULT 10,
    is_mandatory BOOLEAN DEFAULT true,
    PRIMARY KEY(exam_id, subject_id)
);

CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_hours DECIMAL(4, 1) DEFAULT 3.0,
    difficulty VARCHAR(50) DEFAULT 'medium', -- 'easy', 'medium', 'hard'
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    topic_id INT REFERENCES topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    reading_time_mins INT DEFAULT 10,
    order_index INT DEFAULT 0,
    is_important BOOLEAN DEFAULT false,
    summary TEXT,
    key_points JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS study_materials (
    id SERIAL PRIMARY KEY,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id INT REFERENCES topics(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    material_type VARCHAR(50) DEFAULT 'notes', -- 'notes', 'pdf', 'concept_card'
    file_url TEXT,
    content_summary TEXT,
    page_count INT DEFAULT 1,
    download_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id INT REFERENCES topics(id) ON DELETE SET NULL,
    exam_id INT REFERENCES exams(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL, -- 'A', 'B', 'C', 'D'
    explanation TEXT NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'medium', -- 'easy', 'medium', 'hard'
    marks DECIMAL(4, 2) DEFAULT 1.0,
    negative_marks DECIMAL(4, 2) DEFAULT 0.33,
    previous_year_ref VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mock_tests (
    id SERIAL PRIMARY KEY,
    exam_id INT REFERENCES exams(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT DEFAULT 60,
    total_marks INT DEFAULT 100,
    passing_marks INT DEFAULT 40,
    total_questions INT DEFAULT 50,
    negative_marking_per_q DECIMAL(4, 2) DEFAULT 0.33,
    instructions TEXT,
    is_published BOOLEAN DEFAULT true,
    attempts_count INT DEFAULT 0,
    avg_score DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mock_test_questions (
    id SERIAL PRIMARY KEY,
    mock_test_id INT REFERENCES mock_tests(id) ON DELETE CASCADE,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    order_index INT DEFAULT 0,
    UNIQUE(mock_test_id, question_id)
);

CREATE TABLE IF NOT EXISTS test_attempts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    mock_test_id INT REFERENCES mock_tests(id) ON DELETE CASCADE,
    exam_id INT REFERENCES exams(id) ON DELETE SET NULL,
    total_questions INT NOT NULL,
    attempted INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    wrong_answers INT DEFAULT 0,
    skipped INT DEFAULT 0,
    total_score DECIMAL(6, 2) DEFAULT 0,
    percentage DECIMAL(5, 2) DEFAULT 0,
    accuracy DECIMAL(5, 2) DEFAULT 0,
    time_taken_seconds INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'completed', -- 'in_progress', 'completed'
    answers_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    topic_id INT REFERENCES topics(id) ON DELETE CASCADE,
    lesson_id INT REFERENCES lessons(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'completed', -- 'not_started', 'in_progress', 'completed'
    time_spent_seconds INT DEFAULT 300,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, topic_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS study_plans (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    exam_id INT REFERENCES exams(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    target_date DATE,
    daily_hours DECIMAL(4, 1) DEFAULT 4.0,
    schedule_json JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    completed_tasks INT DEFAULT 0,
    total_tasks INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS current_affairs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'national', 'state', 'andhra_pradesh', 'economy', 'schemes', 'awards', 'sports', 'appointments'
    summary TEXT NOT NULL,
    full_content TEXT NOT NULL,
    source VARCHAR(255),
    published_date DATE DEFAULT CURRENT_DATE,
    month_year VARCHAR(50),
    is_trending BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'system', -- 'exam_alert', 'study_reminder', 'test_result', 'system'
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- 'lesson', 'question', 'exam', 'material', 'current_affair'
    item_id INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_type, item_id)
);

CREATE TABLE IF NOT EXISTS pyq_papers (
    id SERIAL PRIMARY KEY,
    exam_id INT REFERENCES exams(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    shift_or_paper VARCHAR(100) DEFAULT 'Paper 1',
    download_url TEXT,
    has_solutions BOOLEAN DEFAULT true,
    questions_count INT DEFAULT 100,
    duration_mins INT DEFAULT 120,
    content_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
