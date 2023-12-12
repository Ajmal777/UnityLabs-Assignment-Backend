const router = require('express').Router();

const authRoutes = require('./auth');
const buyerRoutes = require('./buyer');
const sellerRoutes = require('./seller');

router.use('/auth', authRoutes);
router.use(['/buyer', '/buyers'], buyerRoutes);
router.use(['/seller', '/sellers'], sellerRoutes);


module.exports = router;