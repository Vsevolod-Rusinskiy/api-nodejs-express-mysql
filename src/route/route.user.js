import express from 'express';
import controller  from '../controller/user.controller.js'

const router = express.Router();

// 2 
// Регистрация пользователя (POST /user/register) // ❗ create user
// Авторизация пользователя (POST /user/login)

router.post('/register', controller.registration)    // .post(createUser);
   

router.post('/login', controller.login)       // .post(createUser);
   

router.get('/users', controller.getUsers)     // .get(getUsers)
    

router.post('/profile/:id')   // .get(getU
router.put('/profile/:id')    // .put(updateUser)ser)
    
    




export default router;

