const bcrypt = require('bcrypt')
const User = require('../models/users')
const jwt = require('jsonwebtoken')

function isStringInvalid(string){
    if(string == undefined || string.length === 0){
        return true
    } 
    else{
        return false
    }
}

const signup = async (req,res) => {
    try{
        const {name,email,phonenumber,password} = req.body
        console.log(email)
        if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(phonenumber)|| isStringInvalid(password)){
            return res.status(400).json({message: "Enter all details",success: false})
        }

        const user = await User.findAll({where: {email}})
        if(user.length>0){
            return res.status(401).json({message:"User already exists",success:false})
        }
        else{
            const saltrounds = 10;
            const hashPassword = await bcrypt.hash(password,saltrounds)
            console.log("123",hashPassword)
            await User.create({name,email,phonenumber,password : hashPassword})
            res.status(201).json({message:"signup successful" })

        }
    
    }
       
    catch(err){
        res.status(500).json(err)
    }
 }

 function generateAccessToken(id){
    return jwt.sign({userId: id},process.env.TOKEN_SECRET)
 }

 const login = async(req,res) => {
    try{
        const {email,password} = req.body
        if(isStringInvalid(email) || isStringInvalid(password)){
            console.log(email)
            return res.status(400).json({message: "Enter all details",success:false})
        }

        const user = await User.findAll({where: {email}})
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(req,result) => {
                if(result === true){
                    res.status(200).json({message: "user login successful",success:true,userid:user[0].id,username:user[0].name,token: generateAccessToken(user[0].id)})
                }else{
                res.status(401).json({message: "user not authorized",success:false})
                }
            })
        }
        else{
            res.status(404).json({message:"User not found",success:false})
        }
    }
    catch(err){
        res.status(500).json({message:err,success:false})

    }

}

const getUsers = async(req,res,next) =>{
    try{
        const users = await User.findAll()
        // console.log(users)
        res.status(200).json({data:users,success:true})
    }
    catch(err){
        res.status(500).json({message:err,success:false})
    }
}


 module.exports = {signup,login,getUsers}