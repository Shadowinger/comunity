-- Insert admin user
-- Password: admin123456 (hashed with bcrypt cost 10)
INSERT INTO users (name, email, password_hash, role)
VALUES ('admin', 'admin@gmail.com', '$2y$10$bJ9gq.kRo6JFgsi4wKSISOJJilLvKe055gvvw24PMBPzrYHfa0emi', 'admin')
ON CONFLICT (email) DO UPDATE SET
	name = EXCLUDED.name,
	password_hash = EXCLUDED.password_hash,
	role = EXCLUDED.role;
