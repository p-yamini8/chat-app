const jwt = require('jsonwebtoken')
const User = require('../models/users')
const dotenv = require('dotenv');
 dotenv.config();

const authenticate = (req,res,next) => {
    try{
        const token = req.header('Authorization')
        console.log(token)
        const user = jwt.verify(token,process.env.TOKEN_SECRET)
        console.log("userid is:",user.userId)
        User.findByPk(user.userId).then(user => {
            req.user = user
            next()
        })
    }
    catch(err){
        console.log(err)
        return res.status(401).json({success: false})

    }
    
}

module.exports = { authenticate }
// const jwt = require('jsonwebtoken')
// const User = require('../models/users')
// const dotenv=require('dotenv');
// dotenv.config()
// const authenticate = (req,res,next) => {
//     try{
//         const token = req.header('Authorization')
//         console.log(token)
//         const user = jwt.verify(token,process.env.TOKEN_SECRET)
//         console.log("userid is:",user.id)
//         User.findByPk(user.id).then(user => {
//             req.user = user
//             next()
//         })
//     }
//     catch(err){
//         console.log(err)
//         return res.status(401).json({success: false})

//     }
    
// }

// module.exports = { authenticate }
// const jwt = require('jsonwebtoken');
// const User = require('../models/users');
// const dotenv = require('dotenv');
// dotenv.config();

// const authenticate = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization');
//     if (!token) {
//       return res.status(401).json({ message: 'Token not found' });
//     }

//     const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
//     console.log("userid is:", decoded.id);

//     const user = await User.findByPk(decoded.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User dnot found' });
//     }

//     req.user = User; // ✅ Now req.user is guaranteed to be valid
//     next();
//   } catch (err) {
//     console.error("Auth error:", err.message);
//     return res.status(401).json({ message: 'Authentication failed' });
//   }
// };

// module.exports = { authenticate };