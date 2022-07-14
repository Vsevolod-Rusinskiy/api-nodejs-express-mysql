import express from 'express';
import controller from '../controller/user.controller.js';
import {
    check
} from 'express-validator';
import  {tokenValidation}  from '../auth/token.validation.js'; 


const router = express.Router();


router.post('/user/register', [
    check('email', 'Email cannot be empty!').notEmpty(),
    check('email', 'Fill in correct email, please!').isEmail(),
    check('user_password', 'Password cannot be empty!').notEmpty()
], controller.registration) 


router.post('/user/login', controller.login) 

router.get('/profiles/:page', tokenValidation, controller.getUsers) 

router.get('/profile/:id', tokenValidation, controller.getUser) 

router.put('/profile/:id', tokenValidation, controller.updateUser) 

// TODO add token ???
router.post('/file',  controller.uploadUserPhoto) 


export default router;