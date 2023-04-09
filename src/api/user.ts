import { Router } from "express";
import * as userController from '../controllers/user-controller';

export const userRouter = Router();

userRouter.route('/')
    .get(userController.getUsers)
    .post(userController.createNewUser);

userRouter.route('/:id')
    .get(userController.getUser)
    .put(userController.editUser)
    .delete(userController.deleteUser);
    