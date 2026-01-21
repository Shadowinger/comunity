require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const requestRoutes = require('./routes/request.routes');
const messageRoutes = require('./routes/message.routes');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',') 
    : ['http://localhost:4200'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', require('./routes/conversation.routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

async function startServer() {
  try {
    await db.query('SELECT 1');
    console.log('Database connected successfully');

    // SQL, který nejdřív vše smaže (DROP) a pak vytvoří (CREATE)
    const dropTables = `
      DROP TABLE IF EXISTS reactions CASCADE;
      DROP TABLE IF EXISTS messages CASCADE;
      DROP TABLE IF EXISTS help_requests CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `;

    const createTables = `
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

      CREATE TABLE reactions (
          id SERIAL PRIMARY KEY,
          request_id INTEGER REFERENCES help_requests(id) ON DELETE CASCADE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE(request_id, user_id)
      );
    `;

    const insertAdmin = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ('admin', 'admin@gmail.com', '$2a$10$fQPXjcW1r7cVie.rX03r5OsbWyMv/IrIiT3S4Qth5mmFUhX.ApM6y', 'admin');
    `;

    await db.query(dropTables);
    await db.query(createTables);
    await db.query(insertAdmin);

    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error('CHYBA PŘI RESETU DB:', error.message);
    process.exit(1);
  }
}

startServer();
