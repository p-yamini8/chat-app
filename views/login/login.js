const form = document.getElementById('login-form');
const errorDiv = document.getElementById('error')


form.addEventListener('submit' , login)

async function login(e){
    e.preventDefault()
    try{
    const loginDetails = {
        email: e.target.email.value,
        password: e.target.password.value
    }
    const response = await axios.post("http://localhost:5000/user/login",loginDetails)
    if(response.status === 200){
        alert(response.data.message)
        localStorage.setItem('token',response.data.token)
        localStorage.setItem('user-id',response.data.userid)
        localStorage.setItem('username',response.data.username)
        window.location.href = "../groups/group.html"
    }
    } 
    catch(err){
        errorDiv.innerHTML = `${err.response.data.message}`

    }

}

