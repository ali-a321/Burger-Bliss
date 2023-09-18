const express = require('express')
const router = express.Router()
const {addOrder, getOrders, getUnfulfilledOrders, modifyOrder } = require("../controllers/orderController")
const db = require('../db');
const verifyToken  = require("../middleware/userAuth")
const io = require('socket.io'); 

//Middleware to attach db object to req object
const attachDb = (req, res, next) => {
    req.db = db;
    next();
  };
router.use(attachDb); 

router.post('/order/add', (req, res) => addOrder(req, res, req.io));
router.get('/order/get', verifyToken, getOrders);
router.get('/order/get/unfulfilled', verifyToken, getUnfulfilledOrders);
router.put('/order/put/:id', verifyToken, modifyOrder)


module.exports = router