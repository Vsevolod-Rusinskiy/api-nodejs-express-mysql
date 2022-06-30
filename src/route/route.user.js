import express from 'express';
import {
    getUsers,
    getUser,
    createUser,
    updateUser
} from '../controller/user.controller.js'

const userRoutes = express.Router();

// 2 
// Регистрация пользователя (POST /user/register) // ❗ create user
// Авторизация пользователя (POST /user/login)

userRoutes.route('/register')
    .post(createUser);

userRoutes.route('/login')
    .post(createUser);

userRoutes.route('/profiles')
    .get(getUsers)

userRoutes.route('/profile/:id')
    .get(getUser)
    .put(updateUser)




export default userRoutes;

