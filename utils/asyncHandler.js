// This function is used to handle asynchronous functions.
// If the function returns a rejected promise / error, the 
// catch method will catch it and pass it to the error
// handling middleware.

module.exports = (callback) => {
    return (req, res, next) => {
        callback(req, res)
        .then(response => res.status(response.status).json(response))
        .catch(err => next(err));
    }
}