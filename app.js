const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// const dotenv = require('dotenv');
// dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const userRoutes = require('./routes/users')
const chatRoutes = require('./routes/chats')
const groupRouter = require('./routes/group');

const sequelize = require('./util/database')
const User = require('./models/users')
const Chats = require('./models/chats')
const Group = require('./models/groups');
const UserGroup = require('./models/usergroup');

app.use('/user',userRoutes)
app.use('/chats',chatRoutes)
app.use('/group' , groupRouter)
// app.use((req,res,next)=>{
//   res.sendFile(path.join(__dirname , `views/${req.url}`))
// });
app.use(express.static(path.join(__dirname,'views')))

app.get('/', (req, res) => {
  res.redirect('/login/login.html');
});
User.hasMany(Chats)
Chats.belongsTo(User)

Group.hasMany(Chats);
Chats.belongsTo(Group);

User.belongsToMany(Group , {through: UserGroup} )
Group.belongsToMany(User , {through: UserGroup} )


sequelize.sync()
  .then(() => {
    app.listen(5000)
  })
  .catch((err) => {
    console.log(err)
  })