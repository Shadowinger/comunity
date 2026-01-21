async function startServer() {
  try {
    await db.query('SELECT 1');
    console.log('Database connected successfully');

    const initDbQuery = `
      DROP TABLE IF EXISTS reactions CASCADE;
      DROP TABLE IF EXISTS messages CASCADE;
      DROP TABLE IF EXISTS help_requests CASCADE;
      DROP TABLE IF EXISTS users CASCADE;

      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'user'
      );

      CREATE TABLE help_requests (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'open',
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE messages (
          id SERIAL PRIMARY KEY,
          sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          message TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Vložení admina hned po vytvoření tabulek
      INSERT INTO users (name, email, password_hash, role)
      VALUES ('admin', 'admin@gmail.com', '$2a$10$fQPXjcW1r7cVie.rX03r5OsbWyMv/IrIiT3S4Qth5mmFUhX.ApM6y', 'admin');
    `;

    await db.query(initDbQuery);
    console.log('DB RESET: Tabulky smazány, znovu vytvořeny a admin vložen.');

    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error('CHYBA PŘI RESETU DB:', error.message);
    process.exit(1);
  }
}