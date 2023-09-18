const express = require('express')
const router = express.Router()
const {addCategory, getCategory, deleteCategory, modifyCategory, getCategories } = require("../controllers/categoryController")
const db = require('../db');
const verifyToken  = require("../middleware/userAuth")

//Middleware to attach db object to req object
const attachDb = (req, res, next) => {
    req.db = db;
    next();
  };
router.use(attachDb); 

router.post('/category/add', verifyToken, addCategory)
router.get('/category/get/:id', getCategory);
router.get('/category/get', getCategories);
router.put('/category/put/:id', verifyToken, modifyCategory)
router.delete('/category/delete/:id', verifyToken, deleteCategory)

module.exports = router