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
