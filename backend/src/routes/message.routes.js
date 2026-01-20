const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth.middleware');

// Get all messages for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(`
      SELECT m.*, 
        sender.name as sender_name,
        recipient.name as recipient_name
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users recipient ON m.recipient_id = recipient.id
      WHERE m.sender_id = $1 OR m.recipient_id = $1
      ORDER BY m.created_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Send a message
router.post('/', authenticate, async (req, res) => {
  try {
    const { recipient_id, message } = req.body;
    const senderId = req.user.id;

    if (!recipient_id || !message) {
      return res.status(400).json({ error: 'Recipient and message are required' });
    }

    const result = await db.query(
      'INSERT INTO messages (sender_id, recipient_id, message) VALUES ($1, $2, $3) RETURNING *',
      [senderId, recipient_id, message]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
