-- PostgreSQL Database Schema for AI Resume Builder
-- Execute these commands in your PostgreSQL database

-- Create database (run this separately if needed)
-- CREATE DATABASE "resume_builder";

-- Connect to the database
-- \c resume_builder;

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for future authentication if needed)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resumes table (store complete resume data)
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Untitled Resume',
    template_id VARCHAR(50),
    
    -- Resume sections as JSON for flexibility
    personal_info JSONB,
    summary TEXT,
    skills JSONB,
    experience JSONB,
    education JSONB,
    projects JSONB,
    certifications JSONB,
    achievements JSONB,
    interests JSONB,
    languages JSONB,
    raw_text TEXT,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhancement history table (track AI enhancements)
CREATE TABLE IF NOT EXISTS enhancement_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    section_type VARCHAR(50) NOT NULL,
    original_content TEXT NOT NULL,
    enhanced_content TEXT NOT NULL,
    
    -- AI Enhancement metadata
    ai_model VARCHAR(50) DEFAULT 'gemini',
    prompt_used TEXT,
    enhancement_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Performance tracking
    processing_time_ms INTEGER,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5)
);

-- Templates table (for storing resume templates)
CREATE TABLE IF NOT EXISTS resume_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_data JSONB NOT NULL,
    preview_image_url VARCHAR(500),
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File uploads table (for storing uploaded files like profile pictures, etc.)
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at);
CREATE INDEX IF NOT EXISTS idx_enhancement_history_resume_id ON enhancement_history(resume_id);
CREATE INDEX IF NOT EXISTS idx_enhancement_history_section_type ON enhancement_history(section_type);
CREATE INDEX IF NOT EXISTS idx_enhancement_history_timestamp ON enhancement_history(enhancement_timestamp);
CREATE INDEX IF NOT EXISTS idx_file_uploads_resume_id ON file_uploads(resume_id);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at 
    BEFORE UPDATE ON resumes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default templates (optional)
INSERT INTO resume_templates (name, description, template_data, category) VALUES
('Modern Professional', 'Clean and modern template for tech professionals', '{"layout": "modern", "colors": {"primary": "#2563eb", "secondary": "#64748b"}}', 'professional'),
('Creative Designer', 'Creative template for designers and artists', '{"layout": "creative", "colors": {"primary": "#7c3aed", "secondary": "#a855f7"}}', 'creative'),
('Minimalist', 'Simple and clean template', '{"layout": "minimal", "colors": {"primary": "#000000", "secondary": "#6b7280"}}', 'minimal')
ON CONFLICT DO NOTHING;

-- Create a view for recent enhancements (useful for analytics)
CREATE OR REPLACE VIEW recent_enhancements AS
SELECT 
    eh.id,
    eh.section_type,
    eh.enhancement_timestamp,
    eh.processing_time_ms,
    eh.user_rating,
    r.title as resume_title,
    u.name as user_name
FROM enhancement_history eh
LEFT JOIN resumes r ON eh.resume_id = r.id
LEFT JOIN users u ON r.user_id = u.id
ORDER BY eh.enhancement_timestamp DESC;