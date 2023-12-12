const { sellerCatalog } = require('../Controllers/catalog');
const { createOrder } = require('../Controllers/order');
const { allSellers } = require('../Controllers/user');
const isAuth = require('../Middlewares/isAuth');
const asyncHandler = require('../utils/asyncHandler');

const router = require('express').Router();

router.get('/list-of-sellers', isAuth, asyncHandler((req, res) => {
    return allSellers();
}));

router.get('/seller-catalog/:seller_id', isAuth, asyncHandler((req, res) => {
    const { seller_id } = req.params;
    return sellerCatalog(seller_id);
}));

router.post('/create-order/:seller_id', isAuth, asyncHandler((req, res) => {
    const {seller_id} = req.params;
    const { orderList } = req.body;
    const {userId: buyerId} = req.locals;
    return createOrder(buyerId, seller_id, orderList);
}));

module.exports = router;