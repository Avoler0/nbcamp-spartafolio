
$('#signup-form').on('submit',(event)=>{
  event.preventDefault();
  $('.email-check-wrap .check-message').addClass('error');
  $('.email-check-wrap .check-message').text('이메일 인증이 필요합니다.');

  return;
})

$('#email-auth-btn').on('click',async (event)=>{
  const email = $('#signup-form .email-input').val();
  const checkEmailWrap = $('.email-check-wrap.disabled');
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
      event.currentTarget.removeAttribute('disabled')
      checkEmailWrap.removeClass('disabled')

      $('#email-check-btn').on('click',(event)=>{
        const emailCheck = $('.input-wrap .email-check-input');
        const checkBtn = event.currentTarget;
        
        if (Number(emailCheck.val()) === res.authNumber) {
          emailCheck.attr('disabled', true);
          checkBtn.setAttribute('disabled', true);
          $('.input-wrap.email input').attr('disabled', true);
          $('#email-auth-btn').attr('disabled', true);

          $('.email-check-wrap .check-message').addClass('success');
          $('.email-check-wrap .check-message').text('인증에 성공하였습니다.');

          submitSignup();
        } else {
          $('.email-check-wrap .check-message').addClass('error');
          $('.email-check-wrap .check-message').text('인증번호가 틀립니다.');
        }
      })

      if (!res.success) throw new Error(res.message);
    })
    .catch((err) => {
      event.currentTarget.removeAttribute('disabled');
      alert('인증번호 전송에 실패하였습니다.');
    });
})


function submitSignup(){
  $('#signup-form').off('submit')
  $('#signup-form').on('submit', async (event) => {
    event.preventDefault();

    const data = {
      email: $('#signup-form .email-input').val(),
      name: $('#signup-form .name-input').val(),
      password: $('#signup-form .password-input').val(),
      passwordConfirm: $('#signup-form .password-check-input').val(),
    };

    if(data.password !== data.passwordConfirm){
      $('.password-check-wrap .check-message').addClass('error');
      $('.password-check-wrap .check-message').text('비밀번호를 다시 확인해주세요.');
      return; 
    }

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
        alert(err.message);
      });
  });
}


