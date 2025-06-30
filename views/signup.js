const form=document.getElementById('signup-form');
const errorDiv=document.getElementById('error');

form.addEventListener('sumit',async(e)=>{
    e.preventDefault();
    try{
  const signupDetails={
        name:e.target.name.value,
        email:e.target.email.value,
        phonenumber:e.target.phonenumber.value,
        password:e.target.passward.value,
    }
    const response=await axios.post('http://localhost:3000/user/signup',signupDetails);
    if(response.status==200)
    {
        alert(response.data.message);
        window.location.href='../login/login.html'
    }
    else{
        throw new Error('login failed');
    }
    }
    catch(error)
    {
        errorDiv.innerHTML+=`<div style="color:red;red;text-align:center;padding:10px;margin-bottom:-30px">${error}</div>`
    }
  
})