const { Router } = require('express')
const authController = require('../controllers/authController')
const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);

router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

router.get('/logout', authController.logout_get);

router.get('/forgot-password', authController.forgot_password_get);
router.post('/forgot-password', authController.forgotPassword);

router.get('/reset-password/:token', authController.reset_password_get);
router.patch('/reset-password/:token', authController.resetPassword);

module.exports = router;