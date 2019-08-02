const jwt = require('jsonwebtoken');
const user = require('../models/user')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1] // Bearer fdoko54575fr4f5r48feded4e8d (expl of an auth header)
    if ((!token) || (token == '')) {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesupersecretkey')

    } catch (error) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next()
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    return next();


}