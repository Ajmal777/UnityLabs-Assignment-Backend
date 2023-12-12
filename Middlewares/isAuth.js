const APIError = require("../utils/APIError");
const jwt = require('jsonwebtoken');

// This middleware is used to verify
// whether the user has logged in or not.

// Token is generated only when a user logs in.

// If no token is found, that means the user has
// not logged in.

module.exports = (req, res, next) => {
    const token = req.headers['token'];

    if(!token){
        next(new APIError('No token found', 403));
    }
    else{
        // Once the token is verified, it will return a payload which 
        // is then stored in req.locals.
        // payload may contain user info. like userId and
        // other info. as well which can be accessed using req.locals.
        
        req.locals = jwt.verify(token, process.env.JWT_KEY);
        next();
    }
};