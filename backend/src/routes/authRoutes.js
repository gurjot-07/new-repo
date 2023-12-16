//similar to controller java classes ( FYI)
const express = require('express');
const passport = require('../middlewares/passport-config');
const authRouter = express.Router();
const authController = require('../controllers/authController');

authRouter.post('/signup', authController.signup);
authRouter.post('/login', authController.login);
authRouter.get('/google', authController.googleAuth);
authRouter.get('/google/callback', authController.googleAuthCallback);
authRouter.get('/verifyemail/:token', authController.verifyEmail);

module.exports = authRouter;