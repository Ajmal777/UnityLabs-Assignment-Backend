const Joi = require("joi");
const APIError = require("../utils/APIError");
const { Product, Catalog } = require("../models");

const ObjectId = require("mongoose").Types.ObjectId;

// check whether the product details is present or not
const productValidation = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
});

const createProduct = async (sellerId, name, price) => {
    const { error } = productValidation.validate({ name, price });
    if (error) throw new APIError(error.message, 401);

    // create a new Product instance
    const productObj = new Product({
        seller: new ObjectId(sellerId),
        productName: name,
        price,
    });

    // insert it into the collection using .save().
    // This will return a copy of the inserted document with _id field.
    const productData = await productObj.save();

    // Find the catalog of the seller.
    const catalog = await Catalog.findOne({ sellerId });

    // If the seller catalog is not present, then create a new one
    // and insert the product_id into it.
    
    // If the seller catalog is present, then push the new product_id
    // into it's products list.
    if (!catalog) {
        const catalogObj = new Catalog({
            sellerId,
            productsList: [productData._id],
        });

        await catalogObj.save();
    } else {
        await Catalog.findByIdAndUpdate(catalog._id, {
            $push: { productsList: productData._id },
        });
    }

    return {
        status: 201,
        message: "Product created successfully",
    };
};

module.exports = { createProduct };
