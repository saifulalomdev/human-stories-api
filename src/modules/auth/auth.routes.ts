import { validateResource } from '@/infrastructure/http/middlewares';
import { Router, IRouter } from 'express';
import { authController} from './auth.controller';
import { requireAuth } from '@/infrastructure/http/middlewares';
import { userLoginSchema, userRegistrationSchema } from '@/infrastructure/db';

const routes: IRouter = Router()

routes.get(
    "/me",
    requireAuth(),
    authController.getMe
)

routes.post(
    "/register",
    validateResource(userRegistrationSchema),
    authController.register
)

routes.post(
    "/login", 
    validateResource(userLoginSchema),
    authController.login
)

export default routes