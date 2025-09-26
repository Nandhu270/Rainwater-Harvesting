const express = require("express")
const userController = require('../Controller/userController')

const router = express.Router()

router.post('/register',userController.saveData);

router.post('/login', userController.login);

module.exports = router