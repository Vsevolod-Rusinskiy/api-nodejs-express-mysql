import express from 'express';
import controller from '../controller/user.controller.js';
import {
    check
} from 'express-validator';
import  {tokenValidation}  from '../auth/token.validation.js'; 

const router = express.Router();

// 2 
// Регистрация пользователя (POST /user/register) // ❗ create user
// Авторизация пользователя (POST /user/login)

router.post('/register', [
    check('email', 'Email cannot be empty!').notEmpty(),
    check('email', 'Fill in correct email, please!').isEmail(),
    check('user_password', 'Password cannot be empty!').notEmpty()
], controller.registration) // .post(createUser);


router.post('/login', controller.login) 


router.get('/profiles', tokenValidation, controller.getUsers) // .get(getUsers)


router.post('/profile/:id') // .get(getUser)
router.put('/profile/:id') // .put(updateUser)






export default router;