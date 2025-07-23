const express = require('express')

const router = express.Router()

const userController = require('../controllers/users')

router.post('/signup',userController.signup);
router.post('/login',userController.login);
router.get('/getusers',userController.getUsers)


module.exports = router;