import { requireResetToken, validateResource } from '@/infrastructure/http/middlewares';
import { Router, IRouter } from 'express';
import { authController } from './auth.controller';
import { requireAuth } from '@/infrastructure/http/middlewares';
import { otpSchema, userLoginSchema, userRegistrationSchema, jwt, email } from '@/infrastructure/db';


const routes: IRouter = Router()

routes.get("/me", requireAuth(), authController.getMe)

routes.post("/refresh", validateResource(jwt), authController.refresh);

routes.post("/register", validateResource(userRegistrationSchema), authController.register)

routes.post("/login", validateResource(userLoginSchema), authController.login);

routes.post("/logout", validateResource(jwt), authController.logout);

routes.post("/forgot-password", validateResource(email), authController.forgotPassword);

routes.post("/verify-otp", validateResource(otpSchema), authController.verifyOTP);

routes.post("/reset-password", requireResetToken(), authController.resetPassword);

export default routes