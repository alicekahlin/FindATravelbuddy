const { requireAuth } = require('../controllers/authMiddleware');
const express = require('express');
const router = express.Router();
const searchTravelController = require('../controllers/searchTravelController');

router.get('/', requireAuth, searchTravelController.display_get);
router.get('/trips', requireAuth, searchTravelController.buget_get);


module.exports = router;