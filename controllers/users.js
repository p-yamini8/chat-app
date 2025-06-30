const bcrypt=require('bcrypt');
const User=require('../models/users');
function isStringInvalid(string){
    if(string == undefined || string.length === 0){
        return true
    } 
    else{
        return false
    }
}
  
const signup= async(req,res)=>{
    try{
       
     const {name,email,phonenumber,password}=req.body;
      console.log(email);
      if(isStringInvalid(name)||isStringInvalid(email)||isStringInvalid(phonenumber)||isStringInvalid(password)){
        return res.status(400).json({message:'Enter all details',status:false})
      }
      const user=await User.findAll({where:{phonenumber}})
      if(user.length>0)
      {
        return res.status(401).json({message:"User Already exists",success:false});

      }
      const hashpassword=await bcrypt.hash(password,10);
      console.log('123',hashpassword);
      await User.create({name,email,phonenumber,password:hashpassword})
      res.status(201).json({message:'Signup successful',success:true})
    }
    catch(err){
res.status(500).json(err)
    }
}
module.exports={signup};