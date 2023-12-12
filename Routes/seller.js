const { createCatalog } = require('../Controllers/catalog');
const { getOrders } = require('../Controllers/order');
const { createProduct } = require('../Controllers/product');
const isAuth = require('../Middlewares/isAuth');
const isSeller = require('../Middlewares/isSeller');
const asyncHandler = require('../utils/asyncHandler');

const router = require('express').Router();

router.post('/create-catalog', isAuth, isSeller, asyncHandler((req, res) => {
    const { productsList } = req.body;
    const { userId: sellerId } = req.locals;
    return createCatalog(productsList, sellerId);
}));

router.get('/orders', isAuth, isSeller, asyncHandler((req, res) => {
    const { userId: sellerId } = req.locals;
    return getOrders(sellerId);
}));

router.post('/create-product', isAuth, isSeller, asyncHandler((req, res) => {
    const {userId: sellerId} = req.locals;
    const {name, price} = req.body;
    return createProduct(sellerId, name, price);
}))

module.exports = router;