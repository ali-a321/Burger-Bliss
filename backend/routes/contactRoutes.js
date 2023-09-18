const express = require('express')
const router = express.Router()
const {addMessage, getMessages, deleteMessage } = require("../controllers/contactController")
const db = require('../db');
const verifyToken  = require("../middleware/userAuth")

//Middleware to attach db object to req object
const attachDb = (req, res, next) => {
    req.db = db;
    next();
  };
router.use(attachDb); 

router.post('/contact/add', addMessage)
router.get('/contact/get',verifyToken, getMessages);
router.delete('/contact/delete/:id', verifyToken, deleteMessage)

module.exports = router