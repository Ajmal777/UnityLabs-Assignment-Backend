const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const UserSchema = new Schema({
    username: String,
    password: String,
    typeOfUser: String,
});

// productsList stores product Ids, which references to 
// the documents stored in 'products' collection.
// when used populate() method on it, express will automatically
// fill them with their corresponding data from the referenced object.
const CatalogSchema = new Schema({
    sellerId: Schema.Types.ObjectId,
    productsList: [
        {
            type: Schema.Types.ObjectId,
            ref: "products",
        },
    ],
});

// seller field stores the reference to the seller of the product.
const ProductSchema = new Schema({
    productName: String,
    price: Number,
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
});

// buyer field stores the reference to the buyer who created the order.
// sellerId stores the reference to the seller to whom the order has been made.
// orderItems is an array of Product Ids which reference to their corresponding document in the products collection.
const OrderSchema = new Schema({
    buyer: { 
        type: Schema.Types.ObjectId, 
        ref: "users",
    },
    sellerId: Schema.Types.ObjectId,
    orderItems: [
        {
            type: Schema.Types.ObjectId,
            ref: "products",
        },
    ],
});

const User = Model("users", UserSchema);
const Catalog = Model("catalogs", CatalogSchema);
const Product = Model("products", ProductSchema);
const Order = Model("orders", OrderSchema);

module.exports = { User, Catalog, Product, Order };
