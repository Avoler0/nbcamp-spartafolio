

$('#signup-form').on('submit',async (event)=>{
  event.preventDefault();

  const data = {
    email: $('#signup-form .email-input').val(),
    name: $('#signup-form .name-input').val(),
    password: $('#signup-form .password-input').val(),
    passwordConfirm: $('#signup-form .password-check-input').val(),
  };

  const result = await fetch('http://localhost:3000/api/users',{
    method:'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify(data)
  }).then((res) => res.json()).catch((err)=> err)
  

  console.log(result)
})