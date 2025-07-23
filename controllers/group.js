const Group = require('../models/groups');
const User = require('../models/users')
const Usergroup = require('../models/usergroup') 

exports.getGroups = async(req,res)=>{
    
    try {
        // let data = await req.user.getGroups()
        console.log('345') 
        let groups = await Usergroup.findAll({where:{userId:req.user.id}})
        let data = []
        for(let i = 0 ; i< groups.length ; i++){
            let group = await Group.findByPk(groups[i].groupId);
            data.push(group);
        }console.log('data>>>>>>>>>>>>>>>>>>>>>>>>',data)
        if(!data){
            res.status(404).json({message:"no data found"})
        }
        res.status(200).json({data , message:"found groups"})
    } catch (err) {
        return res.status(500).json(err)
    }
}

exports.createGroup = async(req,res)=>{
    const{group} = req.body ;
    try {
        if(!group){
            res.status(404).json({message:"no name entered"})
        }
        let data = await req.user.createGroup({name:group} , {through: {isAdmin:true}})
        console.log(data) 
        res.status(201).json({ message:'successfully created new group'})
    } catch (err) {
        return res.status(500).json(err)
    }
}