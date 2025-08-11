const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/message.controller');

router.post('/:id/messages', ctrl.add);
router.get('/:id/messages', ctrl.list);

module.exports = router;
