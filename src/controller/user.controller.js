import database from '../config/mysql.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js';
import QUERY from '../query/user.query.js';
import bcrypt from 'bcryptjs';
import {
    validationResult
} from 'express-validator';


// export const HttpStatus = {
//     OK: {
//         code: 200,
//         status: 'OK'
//     },
//     CREATED: {
//         code: 201,
//         status: 'CREATED'
//     },
//     NO_CONTENT: {
//         code: 204,
//         status: 'NO_CONTENT'
//     },
//     BAD_REQUEST: {
//         code: 400,
//         status: 'BAD_REQUEST'
//     },
//     NOT_FOUND: {
//         code: 404,
//         status: 'NOT_FOUND'
//     },
//     INTERNAL_SERVER_ERROR: {
//         code: 500,
//         status: 'INTERNAL_SERVER_ERROR'
//     }
// };


// export const getUsers = (req, res) => {
//     logger.info(`${req.method} ${req.originalUrl}, fetching users`);
//     database.query(QUERY.SELECT_USERS, (error, results) => {
//         if (!results) {
//             res.send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No users found`));
//         } else {
//             res.send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Users retrieved`, {
//                 users: results
//             }));
//         }
//     });
// };

// export const createUser = (req, res) => {
//     logger.info(`${req.method} ${req.originalUrl}, creating user`);
//     database.query(QUERY.CREATE_USER_PROCEDURE, Object.values(req.body), (error, results) => {
//         if (!results) {
//             logger.error(error.message);
//             res.send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
//         } else {
//             const user = results[0][0];
//             res.status(HttpStatus.CREATED.code)
//                 .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `User created`, {
//                     user
//                 }));
//         }
//     });
// };

// export const getUser = (req, res) => {
//     logger.info(`${req.method} ${req.originalUrl}, fetching user`);
//     database.query(QUERY.SELECT_USER, [req.params.id], (error, results) => {
//         if (!results[0]) {
//             res.send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
//         } else {
//             res.send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `User retrieved`, results[0]));
//         }
//     });
// };

// export const updateUser = (req, res) => {
//     logger.info(`${req.method} ${req.originalUrl}, fetching user`);

//     database.query(QUERY.SELECT_USER, [req.params.id], (error, results) => {
//         if (!results[0]) {
//             res.send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
//         } else {
//             logger.info(`${req.method} ${req.originalUrl}, updating user`);
//             database.query(QUERY.UPDATE_USER, [...Object.values(req.body), req.params.id], (error, results) => {
//                 if (!error) {
//                     res.send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `User updated`, {
//                         id: req.params.id,
//                         ...req.body
//                     }));
//                 } else {
//                     logger.error(error.message);
//                     res.send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
//                 }
//             });
//         }
//     });
// };
// TODO can i use object instead here?
class Controller {

    async registration(req, res) {
        try {
            logger.info(`${req.method} ${req.originalUrl}, fetching user`);

            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return  res.send(new Response(200, 'OK', `Registration error`, errors));
            }

                const {
                    email,
                    user_password
                } = req.body;

            // TODO error ???
            database.query(QUERY.SELECT_USER_EMAIL, [email], (error, candidate) => {
                if (candidate[0]) {
                    return res.send(new Response(200, 'OK', `User already exists`));
                }
                const hashPassword = bcrypt.hashSync(user_password, 7);
                req.body.user_password = hashPassword;

                // TODO error ???
                database.query(QUERY.CREATE_USER_PROCEDURE, Object.values(req.body), (error, results) => {
                    return res.send(new Response(200, 'OK', `login successfully`));
                })
            })
        } catch (error) {
            res.send(new Response(400, 'Error', `Registration error`));
        }
    }

    async login(req, res) {
        try {

        } catch (error) {
            res.send(new Response(400, 'OK', `Login error`));
        }
    }

    async getUsers(req, res) {
        try {
            logger.info(`${req.method} ${req.originalUrl}, fetching users`);
            database.query(QUERY.SELECT_USERS, (error, results) => {
                if (!results) {
                    res.send(new Response(200, 'OK', `No users found`));
                } else {
                    res.send(new Response(200, 'OK', `Users retrieved`, {
                        users: results
                    }));
                }
            });
        } catch (error) {
            res.send(new Response(500, 'INTERNAL_SERVER_ERROR', `Internal server error`));
        }
    }
}

export default new Controller();