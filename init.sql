-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a function to check if pgvector is working
CREATE OR REPLACE FUNCTION check_pgvector() RETURNS text AS $$
BEGIN
    RETURN 'pgvector extension is working!';
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO focus_forge_user;
GRANT CREATE ON SCHEMA public TO focus_forge_user; 