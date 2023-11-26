import { getAccessToken, setAccessToken } from '/js/localStorage.js';

$('#login-form .login-btn').on('click', async (event) => {
  const data = {
    email: $('#login-form .email-input').val(),
    password: $('#login-form .password-input').val(),
  };

  await fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      setAccessToken(res.data.accessToken);
      window.location.href = "/"
    })
    .catch((err) => {
      // alert('로그인 실패!')
    });

    

});

const tokenLogin = async () => {
  const accessToken = getAccessToken();

  if (accessToken) return;

  try {
    const result = await fetch('http://localhost:3000/api/user/refreshToken', {
      method: 'POST',
    })
      .then((res) => res.json())
      .catch((err) => err);

    if (result.success) {
      setAccessToken(result.accessToken);
    }
  } catch (err) {
    console.log(err)
    // window.location.reload();
  }
};

tokenLogin();
