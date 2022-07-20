import express from 'express';
import path from 'path';
import ip from 'ip';
import dotenv from 'dotenv';
import cors from 'cors';
import ServerCustomResponse from './domain/response.js';
import userRouter from './route/route.user.js';
import logger from './util/logger.js';
import multer from 'multer'

dotenv.config();
const PORT = process.env.SERVER_PORT || 3000;
const app = express();
app.use(cors({
    origin: '*'
}));

app.use(express.static(path.resolve() + "/public"));
app.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({storage: storage, limits: {fileSize: 10000000}}).single("filedata");
app.use(upload);

app.use('/', userRouter)
app.get('/', (req, res) => res.send(new ServerCustomResponse(200, 'API, v1.0.0 - All Systems Go',)));
app.all('*', (req, res) => res.send(new ServerCustomResponse(404, 'Page not found')));
app.listen(PORT, () => logger.info(`Server running on: ${ip.address()}:${PORT}`));
