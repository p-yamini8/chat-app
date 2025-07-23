const User = require('../models/users');
const Chat = require('../models/chats');
const Group = require('../models/groups');
const Usergroup = require('../models/usergroup');


exports.fetchUsers = async(req,res)=>{
    try {
        let groupId = req.params.groupId ;
        const group = await  Group.findByPk(groupId)
        console.log('group',group)
        if(!group){
            return res.status(404).json({message:"no group found"})
        }
        let users = await group.getUsers()
        console.log(users)
        let data = users.filter(user => user.id != req.user.id)
        console.log("groupdata",data)
        return res.status(200).json(data)
    } catch (err) {
        res.status(500).json({err , message: "some error occured" });
    }
}

exports.addUserToGroup = async(req,res)=>{
    const {email, groupId} = req.body
    console.log(email , groupId)
    try {
        if(!email || !groupId){
            return res.status(400).json({message:'enter all fields'})
        }
        let user = await User.findOne({where:{email}});
        let group = await Group.findByPk(groupId);
        if(!user || !group){
            return res.status(404).json({message:'User not found'})
        }
        const check = await group.hasUser(user);
        console.log(check);
        if(check){
            return res.status(401).json({ message:'user already in group'});
        }
        const data = await group.addUser(user , {through:{isAdmin:false}}) ;
        return res.status(200).json({user, message:'added user to group'});
    } catch (error) {
        res.status(500).json({error , message: "some error occured" });
    }
}

exports.isAdmin  = async(req,res)=>{
    let groupId = req.params.groupId 
    try {
        if(!groupId){
            return res.status(400).json({message:'no group id found'})
        }
        let group = await Group.findByPk(groupId);
        if(!group){
            return res.status(404).json({message:'no group found'})
        }
        let row = await Usergroup.findOne({where:{userId:req.user.id , groupId:groupId }})
        
        let isAdmin = row.isAdmin ;
        console.log("check",isAdmin)
        return res.status(200).json(isAdmin)
    } catch (err) {
        res.status(500).json({err, message: "some error occured" });
    }
}

exports.removeUserFromGroup = async(req,res)=>{
    const {userId , groupId} = req.body;
    try {
        if(!userId || !groupId){
            return res.status(400).json({message:'no group id or user id found'})
        }
        let row = await  Usergroup.findOne({where:{userId:req.user.id, groupId:groupId }})
        let isAdmin = row.isAdmin ;
        if(!isAdmin){
            return res.status(402).json({message:'not admin' })
        }

        let user = await User.findByPk(userId);
        let group = await Group.findByPk(groupId);
        if(!user || !group ){
            return res.status(404).json({message:'no group or user found' })
        }
        let result = await group.removeUser(user);
        if(!result){
            return res.status(401).json({message:'unable to remove user' })
        }
        return res.status(200).json({user , message:"user removed"})

    } catch (err) {
        res.status(500).json({err , message: "some error occured" });
    }
}

exports.makeAdmin = async(req,res)=>{
    const {userId , groupId} = req.body;
    try {
        if(!userId || !groupId){
            return res.status(400).json({message:'no group or user found'})
        }
        let row = await  Usergroup.findOne({where:{userId:req.user.id, groupId:groupId }})
        let isAdmin = row.isAdmin ;
        if(!isAdmin){
            return res.status(402).json({message:'not admin' })
        }

        let user = await User.findByPk(userId);
        let group = await Group.findByPk(groupId);
        
        if(user.isAdmin){
            return res.status(401).json({message:'user is already an admin'})
        }

        if(!user || !group ){
            return res.status(404).json({message:'no group or user found' })
        }
        let result = await group.addUser(user , {through:{isAdmin:true}});
        if(!result){
            return res.status(401).json({message:'unable to make admin' })
        }
        return res.status(200).json({user , message:"user is admin now"})

    } catch (err) {
        res.status(500).json({err , message: "some error occured" });
    }
}

exports.removeAdmin = async(req,res)=>{
    const {userId , groupId} = req.body;
    try {
        if(!userId || !groupId){
            return res.status(400).json({message:'no group id found'})
        }
        let row = await  Usergroup.findOne({where:{userId:req.user.id, groupId:groupId }})
        let isAdmin = row.isAdmin ;
        if(!isAdmin){
            return res.status(402).json({message:'not admin' })
        }

        let user = await User.findByPk(userId);
        let group = await Group.findByPk(groupId);

        if(!user || !group ){
            return res.status(404).json({message:'no group or user found' })
        }
        let result = await group.addUser(user , {through:{isAdmin:false}});
        if(!result){
            return res.status(401).json({message:'unable to remove admin' })
        }
        return res.status(200).json({user , message:"removed as an admin"})

    } catch (err) {
        res.status(500).json({err , message: "some error occured" });
    }
}