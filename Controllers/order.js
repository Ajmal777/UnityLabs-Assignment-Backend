const Joi = require("joi");
const APIError = require("../utils/APIError");
const { Order } = require("../models");
const ObjectId = require("mongoose").Types.ObjectId;

const createOrder = async (buyerId, sellerId, orderList) => {
    const { error } = Joi.object({
        buyerId: Joi.string().required(),
        sellerId: Joi.string().required(),
        orderList: Joi.array().items(Joi.string()).min(1).required(),
    }).validate({ buyerId, sellerId, orderList });

    if (error) throw new APIError(error.message, 401);

    const orderObj = new Order({
        buyer: new ObjectId(buyerId),
        sellerId: new ObjectId(sellerId),
        orderItems: orderList.map((item) => new ObjectId(item)),
    });

    await orderObj.save();

    return {
        status: 201,
        message: "Created an order",
    };
};

const getOrders = async (sellerId) => {
    if (!sellerId) {
        throw new APIError("Seller Id required", 401);
    }

    // get all orders of a seller and populate all the relevant fields.
    const listOfOrders = await Order.find({ sellerId }, { sellerId: 0, __v: 0 })
        .populate("buyer", { password: 0, typeOfUser: 0, __v: 0 })
        .populate("orderItems", { seller: 0, __v: 0 });

    return {
        status: 200,
        message: "Fetched all orders",
        listOfOrders,
    };
};

module.exports = { createOrder, getOrders };
