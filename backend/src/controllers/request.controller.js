const db = require('../config/database');

const getAllRequests = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT hr.*, u.name as user_name, u.email as user_email,
        (SELECT COUNT(*) FROM reactions WHERE request_id = hr.id) as reaction_count
      FROM help_requests hr
      LEFT JOIN users u ON hr.user_id = u.id
      ORDER BY hr.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Failed to get requests' });
  }
};

const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT hr.*, u.name as user_name, u.email as user_email,
        (SELECT COUNT(*) FROM reactions WHERE request_id = hr.id) as reaction_count
      FROM help_requests hr
      LEFT JOIN users u ON hr.user_id = u.id
      WHERE hr.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Get reactions for this request
    const reactions = await db.query(`
      SELECT r.*, u.name as user_name 
      FROM reactions r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.request_id = $1
    `, [id]);
    
    const request = result.rows[0];
    request.reactions = reactions.rows;
    
    res.json(request);
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ error: 'Failed to get request' });
  }
};

const createRequest = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const userId = req.user.id;

    const result = await db.query(
      'INSERT INTO help_requests (title, description, category, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, category, userId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, status } = req.body;

    // Check ownership or admin
    const existing = await db.query('SELECT user_id FROM help_requests WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (existing.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this request' });
    }

    const result = await db.query(
      `UPDATE help_requests 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           category = COALESCE($3, category),
           status = COALESCE($4, status)
       WHERE id = $5 RETURNING *`,
      [title, description, category, status, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership or admin
    const existing = await db.query('SELECT user_id FROM help_requests WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (existing.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this request' });
    }

    await db.query('DELETE FROM help_requests WHERE id = $1', [id]);
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ error: 'Failed to delete request' });
  }
};

const reactToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if request exists
    const requestExists = await db.query('SELECT id FROM help_requests WHERE id = $1', [id]);
    if (requestExists.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check if already reacted
    const existingReaction = await db.query(
      'SELECT id FROM reactions WHERE request_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingReaction.rows.length > 0) {
      // Remove reaction (toggle off)
      await db.query('DELETE FROM reactions WHERE request_id = $1 AND user_id = $2', [id, userId]);
      res.json({ message: 'Reaction removed', reacted: false });
    } else {
      // Add reaction
      await db.query(
        'INSERT INTO reactions (request_id, user_id) VALUES ($1, $2)',
        [id, userId]
      );
      res.json({ message: 'Reaction added', reacted: true });
    }
  } catch (error) {
    console.error('React to request error:', error);
    res.status(500).json({ error: 'Failed to react to request' });
  }
};

module.exports = { getAllRequests, getRequestById, createRequest, updateRequest, deleteRequest, reactToRequest };
