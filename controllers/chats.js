const User = require('../models/users')
const Chats = require('../models/chats')

const sendMessage = async (req,res,next) =>{
    try{
        const {message} = req.body
        const groupId = req.params.groupId ;
        if(message === undefined){
            return res.status(400).json({message:"Enter message",success:false})
        }
        const data = await Chats.create({message,userId:req.user.id,userName:req.user.name, groupId})
        const arr = []
        const details = {
            id :data.id ,
            userId:req.user.id,
            groupId:data.groupId,
            name:req.user.name ,
            message:data.message,
            createdAt:data.createdAt
        }
        arr.push(details);
        res.status(201).json({data:arr,message:"Message stored",success:true})

    }
    catch(err){
        res.status(500).json({error:err,success:false})
    }
}

const getMessages = async(req,res,next) =>{
    let msgId = req.query.msg;
    let groupId = req.params.groupId
    console.log(msgId)
    try{
        
        const messages = await Chats.findAll({where:{groupId}})
        let index = messages.findIndex(msg => msg.id == msgId)
        
        console.log("567",index)
        let messagesToSend = messages.slice(index+1)
        console.log(messagesToSend.length)

        let arr = [];

        for(let i = 0 ; i<messagesToSend.length ; i++){

            const user = await User.findByPk(messagesToSend[i].userId);

            const details = {
                id :messagesToSend[i].id ,
                userId: messagesToSend[i].userId,
                groupId:messagesToSend[i].groupId,
                name:user.name ,
                message:messagesToSend[i].message,
                createdAt:messagesToSend[i].createdAt
            }

            arr.push(details)
        }
        res.status(200).json({data:arr,success:true})
        
    }
    catch{
        res.status(500).json({error:err,success:false})
    }
}

module.exports = {sendMessage,getMessages}