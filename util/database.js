const Sequelize=require('sequelize');
const sequelize=new Sequelize('chats','root',
    'spypgr@123',{
    host:'localhost',
    dialect:'mysql',
})
module.exports=sequelize;