import ServerCustomResponse from '../domain/response.js';
import pkg from 'jsonwebtoken';
const {
    jwt
} = pkg


export const tokenValidation = (req, res, next) => {
    try {
        let token = req.get("authorization").slice(7);
        if (token) {
            pkg.verify(token, process.env.JWT_KEY, (error, decoded) => {
                if (error) {
                    return res.send(new ServerCustomResponse(403, 'FORBIDDIEN', `Invalid token`));
                }
                req.decoded = decoded;
                next();
            });
        }
    } catch (error) {
        return res.send(new ServerCustomResponse(403, 'FORBIDDIEN', `User not authorized`));
    }
}