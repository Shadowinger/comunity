const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate } = require('../middleware/auth.middleware');

// Get all conversations for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await db.query(`
      SELECT DISTINCT ON (other_user_id)
        other_user_id,
        other_user_name,
        message as last_message,
        created_at as last_message_time
      FROM (
        SELECT 
          CASE WHEN m.sender_id = $1 THEN m.recipient_id ELSE m.sender_id END as other_user_id,
          CASE WHEN m.sender_id = $1 THEN r.name ELSE s.name END as other_user_name,
          m.message,
          m.created_at
        FROM messages m
        JOIN users s ON m.sender_id = s.id
        JOIN users r ON m.recipient_id = r.id
        WHERE m.sender_id = $1 OR m.recipient_id = $1
        ORDER BY m.created_at DESC
      ) sub
      ORDER BY other_user_id, last_message_time DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// Get messages with a specific user
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    const result = await db.query(`
      SELECT m.*,
        sender.name as sender_name,
        recipient.name as recipient_name
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users recipient ON m.recipient_id = recipient.id
      WHERE (m.sender_id = $1 AND m.recipient_id = $2)
         OR (m.sender_id = $2 AND m.recipient_id = $1)
      ORDER BY m.created_at ASC
    `, [currentUserId, otherUserId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
});

module.exports = router;
