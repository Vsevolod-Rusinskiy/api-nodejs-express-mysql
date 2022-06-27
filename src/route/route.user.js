import express from 'express';
import {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
} from '../controller/user.controller.js'

const userRoutes = express.Router();

// 2 
// Регистрация пользователя (POST /user/register) // ❗ create user
// Авторизация пользователя (POST /user/login)

userRoutes.route('/register')
    .post(createUser);

// userRoutes.route('/login')
//     .post(createUser);

userRoutes.route('/profile/:id')
    .get(getUser)
    .put(updateUser)

userRoutes.route('/profiles')
    .get(getUsers)


// .delete(deleteUser);  // ???

export default userRoutes;

// module.exports = function (db, app) {
//     const router = Router();

//     const bodyParser = require("body-parser");
//     const urlencodedParser = bodyParser.urlencoded({extended: false});

//     router.get('/', function (req, res) {
//         res.render('admin/add.hbs', {
//             title: "Добавление",
//             isAdd: true,
//             layout: 'admin'
//         })
//     })

//     router.post('/', urlencodedParser, function (req, res) {

//         if (req.body.width) {
//             req.body.width = parseInt(req.body.width)
//         }

//         if (req.body.height) {
//             req.body.height = parseInt(req.body.height)
//         }

//         if (req.body.view) {
//             req.body.view = parseInt(req.body.view)
//         }

//         if (req.body.like) {
//             req.body.like = parseInt(req.body.like)
//         }
//         if (req.body.prise) {
//             req.body.prise = parseInt(req.body.prise)
//         }

//         // console.log(req.body);
//         // console.log('-------');
//         // console.log(req.file.filename);


//         req.body.img_name = req.file.filename;

//         db.collection('cards').insertOne(req.body).then((err) => {

//             res.redirect("/admin/add")
//         })


//     });

//     return router;
// };