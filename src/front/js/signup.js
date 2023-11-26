
$('#signup-form').on('submit',(event)=>{
  event.preventDefault();
  alert('이메일 인증이 필요합니다.')
})

$('#email-auth-btn').on('click',async (event)=>{
  const email = $('#signup-form .email-input').val();
  const checkEmailWrap = $('.input-wrap.email-check.disabled');
  if(!email) return;

  event.currentTarget.setAttribute('disabled',true);

  await fetch('http://localhost:3000/api/user/email-check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email}),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      event.currentTarget.removeAttribute('disabled')
      checkEmailWrap.removeClass('disabled')

      $('#email-check-btn').on('click',()=>{
        // authNumber;
        const emailCheck = $('.input-wrap .email-check-input').val();

        if (emailCheck === authNumber){
          submitSignup();
        }
      })

      if (!res.success) throw new Error(res.message);
    })
    .catch((err) => {
      event.currentTarget.removeAttribute('disabled');
      alert('인증번호 전송에 실패하였습니다.');
    });
  console.log(email)
})


function submitSignup(){
  $('#signup-form').off('submit');
  $('#signup-form').on('submit', async (event) => {
    event.preventDefault();

    const data = {
      email: $('#signup-form .email-input').val(),
      name: $('#signup-form .name-input').val(),
      password: $('#signup-form .password-input').val(),
      passwordConfirm: $('#signup-form .password-check-input').val(),
    };

    await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) throw new Error(res.message);

        alert('회원가입이 정상적으로 진행 되었습니다.');
        window.location.href = '/login';
      })
      .catch((err) => {
        alert('회원가입에 실패하였습니다.');
      });
  });
}


