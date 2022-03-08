const { requireAuth } = require('../controllers/authMiddleware');
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Profile routes
router.get('/', requireAuth, profileController.profile_my);
router.get('/edit', requireAuth, profileController.profile_edit_get);
router.patch('/edit', profileController.uploadPhoto, profileController.resizePhoto, requireAuth, profileController.profile_edit_patch);
router.get('/:id', requireAuth, profileController.profile_other);
router.delete('/edit/:id', requireAuth, profileController.profile_delete);
router.post('/contactPerson/:id', profileController.contactPerson);
router.delete('/edit/:id', requireAuth, profileController.profile_delete);


module.exports = router;