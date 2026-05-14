const express = require('express');
const homeController = require('../controller/homeController');
const path = require('path');
const rootdir = require('../util/path');

const homeRouter = express.Router();
homeRouter.get('/', homeController.showSignup);
homeRouter.post('/cart', homeController.showCart);
homeRouter.get('/cart', homeController.showCart);
homeRouter.post('/removeItem/:id', homeController.removeFromCart);
homeRouter.get('/details', homeController.showDetails);
homeRouter.post('/order', homeController.orderNow);
homeRouter.get('/payment', homeController.paymentPage);
homeRouter.post('/payment', homeController.processPayment);
homeRouter.get('/auth', homeController.showAuth);
homeRouter.get('/signup', homeController.showSignup);
homeRouter.post('/signup', homeController.postSignUp);
module.exports = homeRouter;