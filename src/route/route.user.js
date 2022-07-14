import express from 'express';
import controller from '../controller/user.controller.js';
import controller1 from '../controller/user.controller1.js';
import {
    check
} from 'express-validator';
import  {tokenValidation}  from '../auth/token.validation.js'; 


const router = express.Router();


router.post('/user/register', [
    check('email', 'Email cannot be empty!').notEmpty(),
    check('email', 'Fill in correct email, please!').isEmail(),
    check('user_password', 'Password cannot be empty!').notEmpty()
], controller1.registration) // 111


router.post('/user/login', controller1.login) // 111

router.get('/profiles/:page', tokenValidation, controller1.getUsers) // 111

router.get('/profile/:id', tokenValidation, controller1.getUser) // 111

router.put('/profile/:id', tokenValidation, controller1.updateUser) // 111

// TODO add token ???
router.post('/file',  controller1.uploadUserPhoto) //  //111





export default router;