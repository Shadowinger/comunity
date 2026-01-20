const db = require('../config/database');
const { sanitizeUser } = require('../utils/helpers');

const getAllUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY id');
    const users = result.rows.map(sanitizeUser);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(sanitizeUser(result.rows[0]));
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Only admin can update other users or change roles
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this user' });
    }

    // Only admin can change roles
    const updateRole = req.user.role === 'admin' && role ? role : undefined;

    let query, params;
    if (updateRole) {
      query = 'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), role = $3 WHERE id = $4 RETURNING *';
      params = [name, email, updateRole, id];
    } else {
      query = 'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3 RETURNING *';
      params = [name, email, id];
    }

    const result = await db.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(sanitizeUser(result.rows[0]));
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
