import { getAccessToken, setAccessToken } from '/js/localStorage.js';
// import dotenv from 'dotenv';

// dotenv.config();
// // Authorization: `Bearer ${getAccessToken()}`,
console.log('엔브', process.env);

$('#logout-btn').on('click', async () => {
  await fetch('http://localhost:3000/api/user/log-out', {
    method: 'GET',
  }).then(() => {
    window.localStorage.clear();
    window.location.href = '/';
  });
});

function drawInitProfile(user) {
  const { email, name } = user;

  $('#content .profile-wrap').empty();
  $('#content .profile-wrap').append(`
    <h2>
      프로필
    </h2>
    <label>
      <span>이름</span>
      <div type="text" class="name-input" >
        ${name}
      </div>
    </label>
    <label>
      <span>이메일</span>
      <div type="text" class="email-input" >
        ${email}
      </div>
    </label>
    <label>
      <span>비밀번호</span>
      <div type="text" class="password-input" >
        **********
      </div>
    </label>
    <label class="divisable">
      <span>비밀번호</span>
      <div type="text" class="password-input" >
        **********
      </div>
    </label>
  `);

  drawModifyProfile(user);
}

function drawModifyProfile(user) {
  const { email, name } = user;
  $('.modify-btn').on('click', () => {
    console.log('클릭');
    if ($('.cancel-btn').length === 1) {
      return postUpdateProfile();
    }

    $('#content .profile-wrap').empty();
    $('#content .profile-wrap').append(`
        <h2>
          프로필 수정
        </h2>
        <label>
          <span>이름</span>
          <input type="text" class="name-input" placeholder="${name}" />
        </label>
        <label>
          <span>이메일</span>
          <input type="text" class="email-input" placeholder="${email}" />
        </label>
        <label>
          <span>기존 비밀번호</span>
          <input type="password" class="exist-password-input" placeholder="********" />
        </label>
        <label>
          <span>새로운 비밀번호</span>
          <input type="password" class="new-password-input" placeholder="********" />
        </label>
      `);
    $('#content .profile-wrap .name-input').focus();
    $('#content .footer .profile-btn-wrap').append(`
        <button type="button" class="btn btn-outline-secondary cancel-btn" style="width: 20%; height: 40px">
          취소
        </button>
      `);

    clickCancelBtn(user);
  });
}

function clickCancelBtn(user) {
  $('.cancel-btn').on('click', () => {
    $('.cancel-btn').remove();
    $('.modify-btn').off('click');
    $('.cancel-btn').off('click');

    drawInitProfile(user);
  })
}

async function getUserData() {
  await fetch('http://localhost:3000/api/user', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      // setAccessToken(res.data);
      drawInitProfile(res.data);
    });
}

async function postUpdateProfile() {
  const data = {
    email: $('input.email-input').val(),
    name: $('input.name-input').val(),
    existPassword: $('input.exist-password-input').val(),
    toChangePassword: $('input.new-password-input').val(),
  };

  await fetch('http://localhost:3000/api/user', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res.success) throw new Error(res.message);
      window.location.href = '/profile';
    })
    .catch((err) => {
      alert(err.message);
    });
}

getUserData();
