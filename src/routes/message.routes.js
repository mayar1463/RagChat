const express = require('express');
const router = express.Router({ mergeParams: true });
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Apply auth middleware to all message routes
router.use(authMiddleware);

// POST /v1/sessions/:id/messages
router.post('/:id/messages', messageController.addMessage);

// GET /v1/sessions/:id/messages?limit=...
router.get('/:id/messages', messageController.getMessages);

module.exports = router;