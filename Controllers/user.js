const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const { User } = require("../models");
const APIError = require("../utils/APIError");

// BCRYPT_SALT is used for encryption of a data. In this case, password.
// It refers to the number of rounds of encryption the passwrod will go through.

const BCRYPT_SALT = Number(process.env.BCRYPT_SALT);

// valdidationObj is matched against user input
// and will throw an error in case the specified
// conditions don't match the input values.

const validationObj = Joi.object({
    username: Joi.string().min(1).max(10).required(),
    password: Joi.string().min(5).max(25).required(),
    typeOfUser: Joi.string().valid("buyer", "seller").required(),
});

const register = async (username, password, typeOfUser) => {
    // validate user input
    const { error } = validationObj.validate({
        username,
        password,
        typeOfUser,
    });

    if (error) throw new APIError(error.message, 400, error);

    // check if the username already exists or not
    const check = await User.findOne({ username });
    if (check) {
        throw new APIError("Username already taken", 409);
    }

    // create an encrypted password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);

    // create a new User object
    const userObj = new User({
        username,
        typeOfUser,
        password: hashedPassword,
    });

    await userObj.save();
    return {
        status: 201,
        message: "Registered user successfully",
    };
};

const login = async (username, password, typeOfUser) => {
    const { error } = validationObj.validate({
        username,
        password,
        typeOfUser,
    });

    if (error) throw new APIError(error.message, 400, error);

    // get the userData if it exists, else throw an error.
    const userData = await User.findOne({ typeOfUser, username });
    if (!userData) {
        throw new APIError(
            `${typeOfUser} not found. Please register to login.`,
            401
        );
    }

    // get the encrypted password from userData and compare it with the 
    // password from the user using bcrypt.compare().
    // if they are same, it will return true. else it will reurn false.
    const verifyPassword = await bcrypt.compare(password, userData.password);
    if (!verifyPassword) {
        throw new APIError("Invalid password", 401);
    }

    // create a payload object with some user info.
    const payload = { username, typeOfUser, userId: userData._id };

    // create a token and embed the payload into the token
    // JWT_KEY is a key which is used to create or read a token
    // this is also used in the isAuth middleware to get the payload from the token.
    const token = jwt.sign(payload, process.env.JWT_KEY);
    return {
        status: 201,
        message: "Logged in user",
        token: token,
    };
};

const allSellers = async () => {
    // get all sellers
    const listOfSellers = await User.find(
        { typeOfUser: "seller" },
        { password: 0, typeOfUser: 0 }
    );
    return {
        status: 200,
        message: "Fetched all sellers",
        data: {
            sellers: listOfSellers,
            total: listOfSellers.length,
        },
    };
};

module.exports = { register, login, allSellers };
