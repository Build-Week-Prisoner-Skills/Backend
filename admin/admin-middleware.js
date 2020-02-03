const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secret');

function signToken(user) {
    const payload = {
      userId : user.id,
      username: user.username,
      prison_id: user.prison_id
    };
    const options = {
      expiresIn: '1d'
    };
    return jwt.sign(payload, jwtSecret, options);
};

function authToken(req, res, next) {
    const token = req.headers.authorization;
    if(token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if(err) {
                res.status(401).json({ message: 'Invalid Tollkien.' })
            } else {
                req.admin = { 
                    userId: decodedToken.userId,
                    prison_id: decodedToken.prison_id 
                }
                next();
            }
        })
    } else {
        res.status(401).json({ message: 'You shall not pass.' })
    };
};

module.exports = {
    signToken,
    authToken
};