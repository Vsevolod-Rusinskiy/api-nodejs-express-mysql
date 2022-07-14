import database from '../config/mysql.config.js';
import QUERY from '../query/user.query.js';
import ServerCustomResponse from '../domain/response.js';
import logger from '../util/logger.js';
import bcrypt from 'bcryptjs';
import {
    validationResult
} from 'express-validator';
import pkg from 'jsonwebtoken';

// TODO нужен ли вообще тут payload? разобраться!
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
//TODO то что у меня то result то condidate это хуево или норм?
// TODO check 'fetching user'
// TODO check funcname, delete Promise 
function makeQuery(query, params) {
    return new Promise((resolve, reject) => {
        database.query(query, params, (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results);
        })
    });
}

const registrationPromise = async (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching user`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send(new ServerCustomResponse(200, 'OK', `Registration error`, errors));
    }
    const {
        email,
        user_password
    } = req.body;

    try {
        const candidate = await makeQuery(QUERY.SELECT_USER_EMAIL, [email]);
        if (candidate[0]) {
            return res.send(new ServerCustomResponse(200, 'OK', `User already exists`));
        }
        const hashPassword = bcrypt.hashSync(user_password, 7);
        req.body.user_password = hashPassword;
        const results = await makeQuery(QUERY.CREATE_USER_PROCEDURE, Object.values(req.body));
        if (results[0][0]) {
            return res.send(new ServerCustomResponse(200, 'OK', `User created`, results[0][0]));
        }
    } catch (error) {
        res.send(new ServerCustomResponse(500, 'INTERNAL_SERVER_ERROR', `Internal server error`, error));
    }
}

const loginPromise = async (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching user`);
    const {
        email,
        user_password
    } = req.body;
    try {
        const candidate = await makeQuery(QUERY.SELECT_USER_EMAIL, [email]);
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
}

const getUserPromise = async (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching user`);
    try {
        const results = await makeQuery(QUERY.SELECT_USER, [req.params.id]);
        if (!results[0]) {
            return res.send(new ServerCustomResponse(404, 'NOT_FOUND', `User by id ${req.params.id} was not found`));
        }
        if (results[0]) {
            return res.send(new ServerCustomResponse(200, 'OK', `User retrieved`, results[0]));
        }
    } catch (error) {
        res.send(new ServerCustomResponse(500, 'INTERNAL_SERVER_ERROR', `Internal server error`, error));
    }
}

const getUsersPromise = async (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching user`);
    const limit = 10
    const page = req.params.page
    const offset = (page - 1) * limit
    // TODO  may I do this way? (see query file)
    try {
        const results = await makeQuery(QUERY.SELECT_USERS + offset);
        if (results) {
            return res.send(new ServerCustomResponse(200, 'OK', `Users retrieved`, results));
        }
    } catch (error) {
        res.send(new ServerCustomResponse(500, 'INTERNAL_SERVER_ERROR', `Internal server error`, error));
    }
}

const updateUserPromise = async (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching user`);
    try {
        const result = await makeQuery(QUERY.SELECT_USER, [req.params.id]);
        if (!result[0]) {
            return res.send(new ServerCustomResponse(404, 'NOT_FOUND', `User by id ${req.params.id} was not found`));
        }
        if (result[0]) {
            logger.info(`${req.method} ${req.originalUrl}, updating user`);
            const candidate = await makeQuery(QUERY.UPDATE_USER, [...Object.values(req.body), req.params.id]);
            return res.send(new ServerCustomResponse(200, 'OK', `User updated`));
        }
    } catch (error) {
        return res.send(new ServerCustomResponse(500, 'INTERNAL_SERVER_ERROR', `Internal server error`, error));
    }
}

// TODO may i use it this way for future? where should i catch the error ?
const uploadUserPhotoPromise = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, uploading file...`);
    // TODO 10 mb only !
    return new Promise((resolve, reject) => {
        let filedata = req.file;
        if (!filedata) {
            res.send(new ServerCustomResponse(400, 'CLIENT_ERROR', `File loading error`));
            return reject(`File loading error`);
        }
        // TODO  or use else?
        if (filedata) {
            res.send(new ServerCustomResponse(200, 'OK', `File loaded`));
            return resolve();
        }
    });
}

const Controller1 = {
    getUser: async (req, res) => {
        try {
            await getUserPromise(req, res);
        } catch (error) {
            console.log(error);
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
    },

    getUsers: async (req, res) => {
        try {
            await getUsersPromise(req, res)
        } catch (error) {
            console.log(error);
        }
    },

    updateUser: async (req, res) => {
        try {
            await updateUserPromise(req, res)
        } catch (error) {
            console.log(error);
        }
    },

    uploadUserPhoto: async (req, res) => {
        try {
            await uploadUserPhotoPromise(req, res)
        } catch (error) {
            console.log(error);
        }
    }
}

export default Controller1