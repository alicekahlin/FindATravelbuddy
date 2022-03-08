const { requireAuth } = require('../controllers/authMiddleware');
const express = require('express');
const router = express.Router();
const traveladdController = require('../controllers/traveladdController');

// Traveladd Routes
router.get('/', requireAuth, traveladdController.traveladd_index);
router.post('/', requireAuth, traveladdController.traveladd_create_post);
router.get('/create/', requireAuth, traveladdController.traveladd_create_get);
router.get('/:id', requireAuth, traveladdController.traveladd_details);
router.delete('/:id', requireAuth, traveladdController.traveladd_delete);

module.exports = router;