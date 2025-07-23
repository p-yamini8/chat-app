let token = localStorage.getItem('token')
let user_id = localStorage.getItem('user-id')
let user_name = localStorage.getItem('username')
const chatContainer = document.querySelector('.chat-messages')
const usersContainer = document.querySelector('#users')
const send = document.getElementById('chat-form')
const groupId = localStorage.getItem('groupId');
const groupName = localStorage.getItem('groupName');

send.addEventListener('submit',sendmessage)

let lastId ;
let chatArray = []
usersContainer.innerHTML = ''

window.addEventListener('DOMContentLoaded',loadScreen)

async function loadScreen(e){
    e.preventDefault();
    document.getElementById('group-name').innerHTML = groupName

    isAdmin(groupId)
    getMessage(groupId)
    getUsers(groupId);
    
}

async function isAdmin(groupId){
    try {
        let response = await axios.get(`http://localhost:5000/group/isAdmin/${groupId}`  , {headers:{"Authorization" : token}})
        console.log(response.data)
        localStorage.setItem('isAdmin' , response.data)

        if(!(JSON.parse(localStorage.getItem('isAdmin')))){
            document.getElementById('form-group').style = 'display:none';
        }
    } catch (err) {
        console.log(err);
    }
}

async function getMessage(groupId){
    // setInterval(async ()=>{
        const messages = JSON.parse(localStorage.getItem(`msg${groupId}`))
        if(messages == undefined || messages.length == 0){
            lastId = 0
        }
        else{
            console.log(messages.length)
            lastId = messages[messages.length-1].id;
        }
       
        try{
            const response = await axios.get(`http://localhost:5000/chats/getMessages/${groupId}?msg=${lastId}`,{headers:{"Authorization":token}})

            var newArray = response.data.data
            console.log(newArray)
        
            saveToLocalStorage(newArray)
        }
        catch(err){
            console.log(err)
        }

    // },1000)
    

}

function saveToLocalStorage(arr){
    let oldMessages = JSON.parse(localStorage.getItem(`msg${groupId}`));

    if(oldMessages == undefined || oldMessages.length == 0){
        chatArray = chatArray.concat(arr)
    }else{
        chatArray =[]
        chatArray = chatArray.concat(oldMessages,arr);
    }
    localStorage.setItem(`msg${groupId}` , JSON.stringify(chatArray))
    console.log((JSON.parse(localStorage.getItem(`msg${groupId}`))).length)

    showChats()
}

function showChats(){
    chatContainer.innerHTML = ''
    console.log("chatarray",chatArray)
    chatArray.forEach(chat =>{
        console.log(chat.userId)
        if(chat.userId!=user_id){
            let child = `<div class="message-incoming">
                    <p class="meta" style="display:flex;justify-content:space-between">${chat.name} <span>${chat.createdAt.split('T')[1].slice(0,5)}</span></p>
                    <p class="text">${chat.message}</p>
                    </div>`
                
            chatContainer.innerHTML += child
        }
        else{
            showOutgoingMessages(chat)
        }
       
    })
 }

async function sendmessage(e){
    e.preventDefault()
    try{
        const message = {
            message : e.target.message.value
        }

        const response = await axios.post(`http://localhost:5000/chats/send-message/${groupId}`,message,{headers:{"Authorization":token}})
        e.target.message.value = ''
        
        if(response.status === 201){
            saveToLocalStorage(response.data.data)
        }

    }
    catch(err){
        document.body.innerHTML += `<div style="color:red;">${err.message}</div>`
    }
}

function showOutgoingMessages(chat){
    let child = `<div class="message-outgoing">
                 <p class="meta" style="display:flex;justify-content:space-between"><span>${chat.createdAt.split('T')[1].slice(0,5)}</span>  you</p>
                 <p class="text">${chat.message}</p>
                 </div>`
                  
    chatContainer.innerHTML += child
}

async function getUsers(groupId){
    
    try {
        let response =  await axios.get(`http://localhost:5000/group/fetch-users/${groupId}`  , {headers:{"Authorization" : token}})
        console.log(response.data);
    
        let admin = JSON.parse(localStorage.getItem('isAdmin'));
        if(admin){
            response.data.forEach( data => addGroupUsersToScreen(data))
        }else{
            response.data.forEach( data => addGroupUsersToScreenNotAdmin(data))
        }
    } catch (err) {
        console.log(err)
            
        }
    
}

function addGroupUsersToScreen(user){

       console.log(user.name)
        
        let child = `<li id=${user.id}>
        ${user.name}
        <div class="admin-buttons">
        <button class="makeAdmin" onclick="makeAdmin('${user.id}')">MA</button>
        <button class="removeAdmin" onclick="removeAdmin('${user.id}')">RA</button>
        <button class="remove" onclick="removeUser('${user.id}')" >R</button>
        </div>

        </li>`

        usersContainer.innerHTML += child
        
        if(user.usergroup.isAdmin){
            console.log('okay')
            document.getElementById(`${user.id}`).classList.add('updateButtons')
        }

        if(!(user.usergroup.isAdmin)){
            console.log('not okay')
            document.getElementById(`${user.id}`).classList.add('notAdmin')
        }

}

function addGroupUsersToScreenNotAdmin(user){
        let child = `<li id=${user.id}>
                     ${user.name}
                     </li>`
        
        usersContainer.innerHTML += child

}

async function removeUser(userId){
    const details = {
        userId,
        groupId
    }
    console.log(details )
    try {
        let response = await axios.post(`http://localhost:5000/group/remove-user` ,details  , {headers:{"Authorization" : token}})
        alert('removed user succesfully');
        removeUserFromScreen(response.data.user)
    } catch (err) {
        if(err.response.data.status == 402){
            alert('Only admin can delete')
        }if(err.response.data.status == 404){
            alert('no group or user found')
        }
    }
}

async function makeAdmin(userId){
    const details = {
        userId,
        groupId
    }
    console.log(details )
    try {
        let response = await axios.post(`http://localhost:5000/group/makeAdmin` ,details  , {headers:{"Authorization" : token}})
        console.log(response);
        alert('user is admin now');
        document.getElementById(`${userId}`).classList.add('make_admin')
    } catch (err) {
        console.log(err)
    }
}

async function removeAdmin(userId){
    const details = {
        userId,
        groupId
    }
    console.log(details )
    try {
        let response = await axios.post(`http://localhost:5000/group/removeAdmin` ,details  , {headers:{"Authorization" : token}})
        console.log(response);
        alert('removed admin');
        document.getElementById(`${userId}`).classList.add('remove_admin')
    } catch (err) {
        console.log(err)
    }
}

function removeUserFromScreen(user){

    const child = document.getElementById(`${user.id}`)
    usersContainer.removeChild(child)
}

document.getElementById('form-group').onsubmit = async function(e){
    e.preventDefault();
    const details = {
        email : e.target.email.value,
        groupId : groupId
    }

    try {
        let response = await axios.post(`http://localhost:5000/group/addUser`  ,details ,  {headers:{"Authorization" : token}})
        console.log(response.data.user)
        addGroupUsersToScreen(response.data.user)
        alert('user added successfully')
        document.querySelector('.groupName').value =" "

    } catch (err) {
        if(err.response.data.status == 401){
            alert("user already in group")
        }if(err.response.data.status == 400){
            alert("enter email")
        }if(err.response.data.status == 404){
            alert("user not found")
        }
        
    }
}
