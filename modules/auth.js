const check = require('../secret.js');
const jwt = require('jsonwebtoken');

const authenticate = function (req, res, next) {
    let token = req.headers['authorization'];

    if(token) {
        try {
            let logindata = jwt.verify(token, check.token);
            next();
        } catch (err) {
            res.status(403).json({ msg: "Not a valid token" });
        }
    }
    else {
        res.status(403).json({message: "token not found"}).end(); // no token, forbidden
    }
};

module.exports = authenticate;