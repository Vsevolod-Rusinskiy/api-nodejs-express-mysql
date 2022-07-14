import express from 'express';
import path from 'path';
import ip from 'ip';
import dotenv from 'dotenv';
import cors from 'cors';
import ServerCustomResponse from './domain/response.js';
import {HttpStatus} from './controller/user.controller.js';
import userRouter from './route/route.user.js';
import logger from './util/logger.js';
import multer from 'multer'


dotenv.config();
const PORT = process.env.SERVER_PORT || 3000;
const app = express();
app.use(express.json({limit: '1mb'}));
app.use(cors({
    origin: '*'
}));


app.use(express.static(path.resolve() + "/public"));

// app.use(express.json({limit: '1mb'}));
// app.use(express.urlencoded({
//     extended: false,
//     limit: '1mb'
//     // limit: '100kb'
// }));

//TODO is it better to use defenite route to avoid overloading? 
//--------------

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({storage: storage}).single("filedata");
app.use(upload);

app.use('/', userRouter)
app.get('/', (req, res) => res.send(new ServerCustomResponse(HttpStatus.OK.code, HttpStatus.OK.status, 'API, v1.0.0 - All Systems Go',)));
app.all('*', (req, res) => res.status(HttpStatus.NOT_FOUND.code)
  .send(new ServerCustomResponse(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, 'Route does not exist on the server')));
app.listen(PORT, () => logger.info(`Server running on: ${ip.address()}:${PORT}`));
