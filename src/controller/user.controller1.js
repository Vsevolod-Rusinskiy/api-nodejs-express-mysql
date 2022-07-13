import database from '../config/mysql.config.js';
import QUERY from '../query/user.query.js';
import ServerCustomResponse from '../domain/response.js';
import logger from '../util/logger.js';
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

const registrationPromise = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching user`);

    return new Promise((resolve, reject) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.send(new ServerCustomResponse(200, 'OK', `Registration error`, errors));
            // TODO what message send server ? / reject or resolve?
            return resolve();
        }

        const {
            email,
            user_password
        } = req.body;

        database.query(QUERY.SELECT_USER_EMAIL, [email], (error, candidate) => {
            if (error) {
                res.send(new ServerCustomResponse(500, 'INTERNAL_SERVER_ERROR', `Internal server error`));
                return reject(error);
            }
            if (candidate[0]) {
                res.send(new ServerCustomResponse(200, 'OK', `User already exists`));
                return resolve();
            }

            const hashPassword = bcrypt.hashSync(user_password, 7);
            req.body.user_password = hashPassword;

            // TODO is it norm  query in query ?
            database.query(QUERY.CREATE_USER_PROCEDURE, Object.values(req.body), (error, results) => {
                if (error) {
                    res.send(new ServerCustomResponse(500, 'INTERNAL_SERVER_ERROR', `Internal server error`));
                    return reject(error);
                }
                if (results[0][0]) {
                    res.send(new ServerCustomResponse(200, 'OK', `User created`, results[0][0]));
                    return resolve();
                }
            })
        })
    })
}

const loginPromise = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching user`);

    return new Promise((resolve, reject) => {
        const {
            email,
            user_password
        } = req.body;

        database.query(QUERY.SELECT_USER_EMAIL, [email], (error, candidate) => {
            if (error) {
                res.send(new ServerCustomResponse(500, 'INTERNAL_SERVER_ERROR', `Internal server error`));
                return reject(error);
            }

            if (!candidate[0]) {
                res.send(new ServerCustomResponse(200, 'OK', `No users found` ));
                return reject(`No users found`);
            }
            const validPassword = bcrypt.compareSync(user_password, candidate[0].user_password);
            if (!validPassword) {
                res.send(new ServerCustomResponse(200, 'OK', `Invalid password`));
                return reject(`Invalid password`)
            }

            const token = generateAccessToken(candidate[0].id);

            if (candidate[0]) {
                res.send(new ServerCustomResponse(200, 'OK', `login successfully`, {
                    token
                }));
                return resolve();
            }
        })
    })
}


const getUserPromise = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching user`);
    return new Promise((resolve, reject) => {
        database.query(QUERY.SELECT_USER, [req.params.id], (error, results) => {
            if (error) {
                res.send(new ServerCustomResponse(500, 'INTERNAL_SERVER_ERROR', `Internal server error`));
                return reject(error);
            }
            if (!results[0]) {
                res.send(new ServerCustomResponse(404, 'NOT_FOUND', `User by id ${req.params.id} was not found`));
                return reject(`User by id ${req.params.id} was not found`);
            }
            res.send(new ServerCustomResponse(200, 'OK', `User retrieved`, results[0]));
            return resolve();
        });
    });
}

const Controller1 = {
    getUser: async (req, res) => {
        try {
            await getUserPromise(req, res);
        } catch (error) {
            console.log('>>>', error);
        }
    },

    registration: async (req, res) => {
        try {
            await registrationPromise(req, res)
        } catch (error) {
            console.log(error);
        }
    },

    login: async (req, res) => {
        try {
            await loginPromise(req, res)
        } catch (error) {
            console.log(error);
        }
    }
}

export default Controller1