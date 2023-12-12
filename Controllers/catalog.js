const Joi = require("joi");
const { User, Catalog, Product } = require("../models");
const APIError = require("../utils/APIError");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const productValidate = Joi.object({
    name: Joi.string().min(1).required(),
    price: Joi.number().required(),
});

const createCatalog = async (productsList, sellerId) => {
    const { error } = Joi.array()
        .items(productValidate)
        .min(1)
        .validate(productsList);

    if (error) throw new APIError(error.message, 400);

    const check = await Catalog.findOne({ sellerId });

    const newProductList = productsList.map((product) => {
        return new Product({
            productName: product.name,
            price: product.price,
            sellerId: new ObjectId(sellerId),
        });
    });

    const response = await Product.create(newProductList);

    // Create a new array of ObjectIds of all the newly created products
    const productsIds = response.map((product) => new ObjectId(product._id));

    // If the seller catalog is not present, then create a new one and
    // insert all the products ids into the productsList.
    
    // If the seller catalog is already present, then just push all the new
    // products ids into its productsList
    if (!check) {
        const catalogObj = new Catalog({
            sellerId,
            productsList: productsIds,
        });

        await catalogObj.save();

        return {
            status: 200,
            message: "Created catalog successfully",
        };
    } else {
        await Catalog.findByIdAndUpdate(check._id, {
            $push: { productsList: { $each: [...productsIds] } },
        });
        return {
            status: 200,
            message: "Inserted values into the already existing catalog",
        };
    }
};

const sellerCatalog = async (sellerId) => {
    // Check if the seller exists or not
    const sellerData = await User.findOne({
        _id: sellerId,
        typeOfUser: "seller",
    });
    if (!sellerData) throw new APIError("seller not found", 404);

    // get the seller catalog and populate all the 
    // products references using popluate() method.
    const catalog = await Catalog.findOne(
        { sellerId },
        { productsList: 1 }
    ).populate("productsList", { sellerId: 0 });
    if (!catalog) {
        return {
            status: 404,
            message: "No catalog found",
        };
    }
    return {
        status: 200,
        message: "Fetched seller catalog.",
        data: {
            productsList: catalog?.productsList || [],
            totalItems: catalog?.productsList.length || 0,
        },
    };
};

module.exports = { createCatalog, sellerCatalog };
