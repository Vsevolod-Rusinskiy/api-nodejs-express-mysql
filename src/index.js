import express from 'express';
import ip from 'ip';
import dotenv from 'dotenv';
import cors from 'cors';
import ServerCustomResponse from './domain/response.js';
import {HttpStatus} from './controller/user.controller.js';
import userRouter from './route/route.user.js';
import logger from './util/logger.js';

import multer from 'multer'

import path from 'path';
const __dirname = path.resolve();


dotenv.config();
const PORT = process.env.SERVER_PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.use(express.static(__dirname + "/public"));
// MULTER 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/photo/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

const upload = multer({storage: storage}).single("user_photo");
app.use(upload);




app.use('/', userRouter)
app.get('/', (req, res) => res.send(new ServerCustomResponse(HttpStatus.OK.code, HttpStatus.OK.status, 'API, v1.0.0 - All Systems Go',)));
app.all('*', (req, res) => res.status(HttpStatus.NOT_FOUND.code)
  .send(new ServerCustomResponse(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, 'Route does not exist on the server')));
app.listen(PORT, () => logger.info(`Server running on: ${ip.address()}:${PORT}`));



// app.use(express.static(__dirname + '/public'));
// app.use(express.json())