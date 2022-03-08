const { Router } = require('express')
const generalController = require('../controllers/generalController')
const router = Router();
const { requireAuth } = require('../controllers/authMiddleware');

// General routes
router.get('/', generalController.empty_get);
router.get('/home', generalController.home_get);
router.get('/about', requireAuth, generalController.about_get);

module.exports = router;