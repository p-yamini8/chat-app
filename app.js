const express=require('express');
const cors=require('cors');
const path=require('path');
const bodyparser=require('body-parser');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const app=express();
app.use(cors());
app.use(bodyparser.json());

const userRoutes=require('./routes/users');
const sequelize=require('./util/database');
const User=require('./models/users')
app.use(express.static(path.join(__dirname,'views',)))
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','signup.html'))
})
app.use('/user',userRoutes);
sequelize.sync({}).then(()=>{
    app.listen(3000,()=>{
    console.log('running 3000');
})
}).catch((err)=>{
    console.log('error sync database',err);
})
