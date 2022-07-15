import database from '../config/mysql.config.js';
import QUERY from '../query/user.query.js';
import ServerCustomResponse from '../domain/response.js';
import logger from '../util/logger.js';
import bcrypt from 'bcryptjs';
import {
    validationResult
} from 'express-validator';
import pkg from 'jsonwebtoken';

// 
// TODO how it works ? clear the matter
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
//TODO 
// TODO check 'fetching user...'
// TODO check funcname, delete Promise 


function makeQueryPromise(query, params) {
    return new Promise((resolve, reject) => {
        database.query(query, params, (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results);
        })
    });
}

function uploadFilePromise(req) {
    return new Promise((resolve, reject) => {
        if (!req) {
            reject('Sorry, there is no file here');
        }
        resolve(req);
    });
}



const Controller = {
    registration: async (req, res) => {
        logger.info(`${req.method} ${req.originalUrl}, fetching user...`);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send(new ServerCustomResponse(200, 'OK', `Registration error`, errors));
        }
        const {
            email,
            user_password
        } = req.body;

        try {
            const candidate = await makeQueryPromise(QUERY.SELECT_USER_EMAIL, [email]);
            if (candidate[0]) {
                return res.send(new ServerCustomResponse(200, 'OK', `User already exists`));
            }
            const hashPassword = bcrypt.hashSync(user_password, 7);
            req.body.user_password = hashPassword;
            const results = await makeQueryPromise(QUERY.CREATE_USER_PROCEDURE, Object.values(req.body));
            if (results[0][0]) {
                return res.send(new ServerCustomResponse(200, 'OK', `User created`, results[0][0]));
            }
        } catch (error) {
            res.send(new ServerCustomResponse(500, 'INTERNAL_SERVER_ERROR', `Internal server error`, error));
        }
    },

    login: async (req, res) => {
        logger.info(`${req.method} ${req.originalUrl}, fetching user...`);
        const {
            email,
            user_password
        } = req.body;
        try {
            const candidate = await makeQueryPromise(QUERY.SELECT_USER_EMAIL, [email]);
            if (!candidate[0]) {
                return res.send(new ServerCustomResponse(200, 'OK', `No users found`));
            }
            const validPassword = bcrypt.compareSync(user_password, candidate[0].user_password);
            if (!validPassword) {
                return res.send(new ServerCustomResponse(200, 'OK', `Invalid password`));
            }
            const token = generateAccessToken(candidate[0].id);
            if (candidate[0]) {
                return res.send(new ServerCustomResponse(200, 'OK', `login successfully`, {
                    token
                }));
            }
        } catch (error) {
            return res.send(new ServerCustomResponse(500, 'INTERNAL_SERVER_ERROR', `Internal server error`, error));
        }
    },

    getUser: async (req, res) => {
        logger.info(`${req.method} ${req.originalUrl}, fetching user...`);
        try {
            const results = await makeQueryPromise(QUERY.SELECT_USER, [req.params.id]);
            if (!results[0]) {
                return res.send(new ServerCustomResponse(404, 'NOT_FOUND', `User by id ${req.params.id} was not found`));
            }
            if (results[0]) {
                return res.send(new ServerCustomResponse(200, 'OK', `User retrieved`, results[0]));
            }
        } catch (error) {
            res.send(new ServerCustomResponse(500, 'INTERNAL_SERVER_ERROR', `Internal server error`, error));
        }
    },

    getUsers: async (req, res) => {
        logger.info(`${req.method} ${req.originalUrl}, fetching user...`);
        const limit = 10
        const page = req.params.page
        const offset = (page - 1) * limit
        // TODO  may I do this way? (see query file)
        try {
            const results = await makeQueryPromise(QUERY.SELECT_USERS + offset);
            if (results) {
                return res.send(new ServerCustomResponse(200, 'OK', `Users retrieved`, results));
            }
        } catch (error) {
            res.send(new ServerCustomResponse(500, 'INTERNAL_SERVER_ERROR', `Internal server error`, error));
        }
    },

    updateUser: async (req, res) => {
        logger.info(`${req.method} ${req.originalUrl}, fetching user...`);
        try {
            const result = await makeQueryPromise(QUERY.SELECT_USER, [req.params.id]);
            if (!result[0]) {
                return res.send(new ServerCustomResponse(404, 'NOT_FOUND', `User by id ${req.params.id} was not found`));
            }
            if (result[0]) {
                logger.info(`${req.method} ${req.originalUrl}, updating user...`);
                const candidate = await makeQueryPromise(QUERY.UPDATE_USER, [...Object.values(req.body), req.params.id]);
                return res.send(new ServerCustomResponse(200, 'OK', `User updated`));
            }
        } catch (error) {
            return res.send(new ServerCustomResponse(500, 'INTERNAL_SERVER_ERROR', `Internal server error`, error));
        }
    },

    uploadUserPhoto: async (req, res) => {
        logger.info(`${req.method} ${req.originalUrl}, uploading file...`);

        try {
            const result = await uploadFilePromise(req);

            console.log(result.body.id);
            console.log(result.file.filename);

            const candidate = await makeQueryPromise(QUERY.UPDATE_USER_PHOTO + result.body.id, [result.file.filename]);

            res.send('1111')
        } catch (error) {
            console.log(error);
            res.send('0000')

        }

        // return new Promise((resolve, reject) => {
        //     let filedata = req.file;
        //     if (!filedata) {
        //         res.send(new ServerCustomResponse(400, 'CLIENT_ERROR', `File loading error`));
        //         return reject(`File loading error`);
        //     }
        //     // TODO  or else?
        //     if (filedata) {
        //         res.send(new ServerCustomResponse(200, 'OK', `File loaded`));
        //         return resolve();
        //     }
        // });
    }
}


export default Controller;