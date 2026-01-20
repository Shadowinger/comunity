-- Insert admin user
-- Password: admin123456 (hashed with bcrypt cost 10)
INSERT INTO users (name, email, password_hash, role)
VALUES ('admin', 'admin@gmail.com', '$2a$10$fQPXjcW1r7cVie.rX03r5OsbWyMv/IrIiT3S4Qth5mmFUhX.ApM6y', 'admin')
ON CONFLICT (email) DO UPDATE SET
	name = EXCLUDED.name,
	password_hash = EXCLUDED.password_hash,
	role = EXCLUDED.role;

-- Insert sample users (password: heslo123)
INSERT INTO users (name, email, password_hash, role)
VALUES 
	('Jan Novák', 'jan@example.com', '$2a$10$fQPXjcW1r7cVie.rX03r5OsbWyMv/IrIiT3S4Qth5mmFUhX.ApM6y', 'user'),
	('Marie Svobodová', 'marie@example.com', '$2a$10$fQPXjcW1r7cVie.rX03r5OsbWyMv/IrIiT3S4Qth5mmFUhX.ApM6y', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert sample help requests
INSERT INTO help_requests (title, description, category, status, user_id)
SELECT 'Potřebuji pomoct se stěhováním', 'Stěhuji se z Prahy 4 do Prahy 6 příští sobotu. Potřebuji pomoc s nákladáním nábytku do dodávky. Nabízím oběd a 500 Kč odměnu.', 'moving', 'open', id
FROM users WHERE email = 'jan@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO help_requests (title, description, category, status, user_id)
SELECT 'Doučování matematiky pro SŠ', 'Hledám někoho na doučování matematiky. Jsem student 2. ročníku gymnázia a potřebuji pomoct s derivacemi a integrály.', 'tutoring', 'open', id
FROM users WHERE email = 'marie@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO help_requests (title, description, category, status, user_id)
SELECT 'Oprava kohoutku v koupelně', 'Teče mi kohoutek v koupelně a nevím, jak ho opravit. Potřeboval bych někoho šikovného, kdo by mi s tím pomohl.', 'repair', 'open', id
FROM users WHERE email = 'jan@example.com'
ON CONFLICT DO NOTHING;
