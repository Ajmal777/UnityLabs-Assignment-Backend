const { User } = require("../models");
const APIError = require("../utils/APIError");

// This middleware is used to check whether
// the user is a seller or not.
// This is used to prevent a buyer's access to API 
// endpoints that only a seller is allowed to access.

module.exports = async (req, res, next) => {
    const { userId } = req.locals;
    const userData = await User.findById(userId);

    if (userData.typeOfUser !== "seller") {
        next(new APIError("Unauthorized access", 403));
    } else {
        next();
    }
};
