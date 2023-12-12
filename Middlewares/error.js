const APIError = require("../utils/APIError");

module.exports = (err, req, res, next) => {
    console.log(err);

    // Check whether the error is custom error or not. 
    // If it is a custom error, that means it is an
    // expected error. Else, it is an unexpected error.

    if (err instanceof APIError) {
        return res.status(err.status).json({
            status: err.status,
            message: err.message,
        });
    }
    res.status(500).json({
        status: 500,
        message: "Something went wrong",
    });
};
