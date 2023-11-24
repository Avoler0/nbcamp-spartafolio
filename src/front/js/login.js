import { getAccessToken, setAccessToken } from '/script/localStorage.js';

$('#login-form').on('submit', async (event) => {
  event.preventDefault();

  const data = {
    email: $('#login-form .email-input').val(),
    password: $('#login-form .password-input').val(),
  };

  const result = await fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => err);

  console.log(result);
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

      console.log(result)
    if (result.success) {
      setAccessToken(result.accessToken);
    }
  } catch (err) {
    console.log(err)
    // window.location.reload();
  }
};

tokenLogin();
