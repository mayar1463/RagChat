const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/session.controller');

router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.patch('/:id', ctrl.rename);
router.patch('/:id/favorite', ctrl.favorite);
router.delete('/:id', ctrl.delete);

module.exports = router;
