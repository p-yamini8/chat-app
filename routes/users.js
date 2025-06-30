const express=require('express');
const router=express.Router();
const usercontrollers=require('../controllers/users');
router.post('/signup',usercontrollers.signup);
module.exports=router;
