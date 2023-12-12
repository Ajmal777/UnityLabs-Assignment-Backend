const { register, login } = require("../Controllers/user");
const asyncHandler = require("../utils/asyncHandler");

const router = require("express").Router();

router.post("/register", asyncHandler(async (req, res) => {
        const { username, password, typeOfUser } = req.body;
        return register(username, password, typeOfUser);
    })
);

router.post("/login", asyncHandler(async (req, res) => {
    const { username, password, typeOfUser } = req.body;
    return login(username, password, typeOfUser);
}));

module.exports = router;
