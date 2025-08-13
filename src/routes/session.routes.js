const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Apply auth middleware to all session routes
router.use(authMiddleware);

// POST /v1/sessions
router.post('/', sessionController.createSession);

// GET /v1/sessions?userId=...
router.get('/', sessionController.getSessionsByUser);

// GET /v1/sessions/:id
router.get('/:id', sessionController.getSessionById);

// PATCH /v1/sessions/:id
router.patch('/:id', sessionController.renameSession);

// PATCH /v1/sessions/:id/favorite
router.patch('/:id/favorite', sessionController.favoriteSession);

// DELETE /v1/sessions/:id
router.delete('/:id', sessionController.deleteSession);

module.exports = router;