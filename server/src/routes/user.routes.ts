import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware';
import { validate } from '../middleware';
import { createUserSchema, updateUserSchema, userIdSchema, paginationSchema } from '../utils/validation';

const router = Router();
const userController = new UserController();

router.get(
  '/',
  authenticate,
  authorize('users.view'),
  validate(paginationSchema, 'query'),
  userController.getAllUsers
);

router.get(
  '/:id',
  authenticate,
  authorize('users.view'),
  validate(userIdSchema, 'params'),
  userController.getUserById
);

router.post(
  '/',
  authenticate,
  authorize('users.create'),
  validate(createUserSchema),
  userController.createUser
);

router.put(
  '/:id',
  authenticate,
  authorize('users.edit'),
  validate(userIdSchema, 'params'),
  validate(updateUserSchema),
  userController.updateUser
);

router.delete(
  '/:id',
  authenticate,
  authorize('users.delete'),
  validate(userIdSchema, 'params'),
  userController.deleteUser
);

export default router;
