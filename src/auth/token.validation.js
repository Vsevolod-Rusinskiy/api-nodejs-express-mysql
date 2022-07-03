import pkg from 'jsonwebtoken';

export const tokenValidation = (req, res, next) => {
    // if (req.method === 'OPTIONS'){
    //     // TODO where is that fucking next middelware function
    //     next();
    // }

    // try {
    //     const token = req.headers.authorization.split(' ')[1];
    //     if (!token) {
    //         return res.send(new Response(403, 'FORBIDDIEN', `user not authorized`));
    //     }

    //     const decodedData = pkg.verify(token, process.env.JWT_KEY)
    //     req.user = decodedData
    //     res.send(1111)
    //     next();

    // } catch (error) {
    //     return res.send(new Response(403, 'FORBIDDIEN', `User not authorized`, error));
    // }
    try {
        let token = req.get("authorization").slice(7);
console.log(token);
        // if (!token) {
        //     return res.send(new Response(403, 'FORBIDDIEN', `user not authorized`));
        // }

        // const decodedData = pkg.verify(token, process.env.JWT_KEY)
        // console.log(decodedData);
        // req.user = decodedData;
        // next();

        if (token) {
            pkg.verify(token, process.env.JWT_KEY, (error, decoded) => {
                console.log('>>>', decoded);
                if (!decoded) {
                    return res.send(new Response(403, 'FORBIDDIEN', `user not authorized`));
                }
                req.decoded = decoded;
                next();
            });
        }
    } catch (error) {
        return res.send(new Response(403, 'FORBIDDIEN', `User not authorized`, error.message));
    }

    // else {
    //     return res.send(new Response(403, 'FORBIDDIEN', `user not authorized`));
    // }
}