const express = require('express');
const router = express.Router();
const { getAllRequests, getRequestById, createRequest, updateRequest, deleteRequest, reactToRequest } = require('../controllers/request.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

router.get('/', optionalAuth, getAllRequests);
router.get('/:id', optionalAuth, getRequestById);
router.post('/', authenticate, createRequest);
router.put('/:id', authenticate, updateRequest);
router.delete('/:id', authenticate, deleteRequest);
router.post('/:id/react', authenticate, reactToRequest);

module.exports = router;
