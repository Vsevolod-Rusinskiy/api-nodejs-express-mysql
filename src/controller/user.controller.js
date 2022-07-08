import database from '../config/mysql.config.js';
import ServerCustomResponse from '../domain/response.js';
import logger from '../util/logger.js';
import QUERY from '../query/user.query.js';
import bcrypt from 'bcryptjs';
import {
    validationResult
} from 'express-validator';


import pkg from 'jsonwebtoken';

// TODO нужен ли вообще тут payload
const generateAccessToken = (id) => {
    const payload = {
        id
    }

    return pkg.sign(payload, process.env.JWT_KEY, {
        expiresIn: '24h'
    })
}

export const HttpStatus = {
    OK: {
        code: 200,
        status: 'OK'
    },
    CREATED: {
        code: 201,
        status: 'CREATED'
    },
    NO_CONTENT: {
        code: 204,
        status: 'NO_CONTENT'
    },
    BAD_REQUEST: {
        code: 400,
        status: 'BAD_REQUEST'
    },
    NOT_FOUND: {
        code: 404,
        status: 'NOT_FOUND'
    },
    INTERNAL_SERVER_ERROR: {
        code: 500,
        status: 'INTERNAL_SERVER_ERROR'
    }
};

// TODO returns in general ?


// TODO can i use object instead here?
// ASYNC лучше убрать?

class Controller {
    registration(req, res) {
        try {
            logger.info(`${req.method} ${req.originalUrl}, fetching user`);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.send(new ServerCustomResponse(200, 'OK', `Registration error`, errors));
            }

            const {
                email,
                user_password
            } = req.body;

            // TODO catch error, which error it catchs  ??? 
            // TODO error ???
            database.query(QUERY.SELECT_USER_EMAIL, [email], (error, candidate) => {
                if (candidate[0]) {
                    return res.send(new ServerCustomResponse(200, 'OK', `User already exists`));
                }
                const hashPassword = bcrypt.hashSync(user_password, 7);
                req.body.user_password = hashPassword;

                database.query(QUERY.CREATE_USER_PROCEDURE, Object.values(req.body), (error, results) => {
                    return res.send(new ServerCustomResponse(200, 'OK', `User created`, results[0][0]));
                })
            })
        } catch (error) {
            res.send(new ServerCustomResponse(400, 'Error', `Registration error`));
        }
    }

    login(req, res) {
        try {
            logger.info(`${req.method} ${req.originalUrl}, fetching user`);

            const {
                email,
                user_password
            } = req.body;

            database.query(QUERY.SELECT_USER_EMAIL, [email], (error, candidate) => {
                if (!candidate[0]) {
                    return res.send(new ServerCustomResponse(200, 'OK', `No users found`));
                }
                const validPassword = bcrypt.compareSync(user_password, candidate[0].user_password);
                if (!validPassword) {
                    return res.send(new ServerCustomResponse(200, 'OK', `Invalid password`));
                }
                const token = generateAccessToken(candidate[0].id);
                return res.send(new ServerCustomResponse(200, 'OK', `login successfully`, {
                    token
                }));
            })

        } catch (error) {
            res.send(new ServerCustomResponse(400, 'BAD_REQUEST', `Login error`));
        }
    }


    getUser(req, res) {

        // res.sendFile(__dirname + '/index.html')
        res.sendFile('/public/index.html')

        // try {
        //     logger.info(`${req.method} ${req.originalUrl}, fetching user`);
        //     database.query(QUERY.SELECT_USER, [req.params.id], (error, results) => {
        //         if (!results[0]) {
        //             res.send(new ServerCustomResponse(404, 'NOT_FOUND', `User by id ${req.params.id} was not found`));

        //             // TODO else замена ошибки?
        //         } else {
        //             res.send(new ServerCustomResponse(200, 'OK', `User retrieved`, results[0]));
        //         }
        //     });
        // } catch (error) {
        //     // TODO что - то с базой или интернетом?
        // }

    };

    updateUser(req, res) {
        logger.info(`${req.method} ${req.originalUrl}, fetching user`);

        database.query(QUERY.SELECT_USER, [req.params.id], (error, results) => {
            if (!results[0]) {
                res.send(new ServerCustomResponse(404, 'NOT_FOUND', `User by id ${req.params.id} was not found`));
            } else {
                logger.info(`${req.method} ${req.originalUrl}, updating user`);

                database.query(QUERY.UPDATE_USER, [...Object.values(req.body), req.params.id], (error, results) => {
                    if (!error) {
                        res.send(new ServerCustomResponse(200, 'OK', `User updated`));
                    } else {
                        logger.error(error.message);
                        res.send(new ServerCustomResponse(500, 'INTERNAL_SERVER_ERROR', `Internal server error`));
                    }
                });
            }
        });
    }

    getUsers(req, res) {
        const limit = 3
        const page = req.params.page
        const offset = (page - 1) * limit
        // TODO  можем ли с такими переменныйми перекинуть в query
        // есть ли у меня schema?
        const usersQuery = `select * from users ORDER BY created_at limit ${limit} OFFSET ${offset}`
        // TODO  Что писать вместо второго параметра?
        database.query(usersQuery, function (error, results) {
            if (error) throw error;
            return res.send(new ServerCustomResponse(200, 'OK', `Users retrieved`, results));
        })
    }

    uploadUserPhoto(req, res, next) {
        // let filedata = req.file;
        // console.log(filedata);
        // if (!filedata)
        //     res.send("Ошибка при загрузке файла");
        // else
        //     res.send("Файл загружен");

        let filedata = req.file;
        console.log(filedata);
        if(!filedata)
            res.send("Ошибка при загрузке файла");
        else
            res.send("Файл загружен");
    };
}
export default new Controller();