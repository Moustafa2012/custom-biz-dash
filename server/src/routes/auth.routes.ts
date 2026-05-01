import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware';
import { validate } from '../middleware';
import { registerSchema, loginSchema, twoFactorVerifySchema, resendTwoFactorSchema } from '../utils/validation';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/verify-2fa', validate(twoFactorVerifySchema), authController.verifyTwoFactor);
router.post('/resend-2fa', validate(resendTwoFactorSchema), authController.resendTwoFactorCode);
router.post('/logout', authController.logout);
router.get('/profile', authenticate, authController.getProfile);

export default router;
