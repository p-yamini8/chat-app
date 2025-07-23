const express =require('express');
const router = express.Router();

const userAuthentication = require('../middleware/auth')
const groupController = require('../controllers/group')
const usergroupController = require('../controllers/usergroup')

router.get('/getgroups',userAuthentication.authenticate , groupController.getGroups  )

router.post('/create-group' , userAuthentication.authenticate, groupController.createGroup)

router.get('/fetch-users/:groupId' , userAuthentication.authenticate, usergroupController.fetchUsers )

router.post('/addUser' , userAuthentication.authenticate, usergroupController.addUserToGroup )

router.get('/isAdmin/:groupId' , userAuthentication.authenticate, usergroupController.isAdmin)

router.post('/remove-user' , userAuthentication.authenticate, usergroupController.removeUserFromGroup)

router.post('/makeAdmin' ,userAuthentication.authenticate, usergroupController.makeAdmin);

router.post('/removeAdmin' , userAuthentication.authenticate, usergroupController.removeAdmin);

module.exports = router;