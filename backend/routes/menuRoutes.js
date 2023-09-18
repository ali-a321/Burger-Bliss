const express = require('express')
const router = express.Router()
const {addMenu, getMenu, deleteMenu, modifyMenu } = require("../controllers/menuController")
const db = require('../db');
const verifyToken  = require("../middleware/userAuth")

//Middleware to attach db object to req object
const attachDb = (req, res, next) => {
    req.db = db;
    next();
  };
router.use(attachDb); 

router.post('/menu/add', verifyToken, addMenu)
router.get('/menu/get', getMenu);
router.put('/menu/put/:id', verifyToken, modifyMenu)
router.delete('/menu/delete/:id', verifyToken, deleteMenu)

module.exports = router