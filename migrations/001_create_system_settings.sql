-- Create system_settings table for admin settings (general, investment, security)
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'general', 'investment', 'security'
  settings JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Index for quick lookup by category
CREATE UNIQUE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category); 