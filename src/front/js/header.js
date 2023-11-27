// console.log('헤더 실행');

import { getAccessToken, setAccessToken } from '/js/localStorage.js';

function loginHeader() {
  const accessToken = getAccessToken();

  drawHeaderRight(accessToken);
}
// '내 정보 보기','프로젝트 등록'
function drawHeaderRight(login) {
  const isLogin = login ? true : false;
  const isOk = [
    {
      name: '내 정보 보기',
      url: '/profile',
    },
    {
      name: '프로젝트 등록',
      url: '/project-regist',
    },
  ];
  const isNot = [
    {
      name: 'Log in',
      url: '/login',
    },
    {
      name: 'Sign-up',
      url: '/sign-up',
    },
  ];

  $('header #header .h-right').attr('data-login', isLogin);
  $('header #header .h-right').empty();
  $('header #header .h-right').append(`
    <div class="l-btn">
      <a href="${isLogin ? isOk[0].url : isNot[0].url}">
        <button>
            ${isLogin ? isOk[0].name : isNot[0].name}
        </button>
      </a>
    </div>
    <div class="r-btn">
        <a href="${isLogin ? isOk[1].url : isNot[1].url}">
          <button>
            ${isLogin ? isOk[1].name : isNot[1].name}
          </button>
        </a>
      
    </div>
  `);
}

loginHeader();
