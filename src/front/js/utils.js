import { getAccessToken, setAccessToken } from '/js/localStorage.js';

function loginCheck(){
  if (!getAccessToken()) {
    alert('로그인 이후 이용 가능한 페이지입니다.');
    return window.location.href = '/login';
  } else {
    return;
  }
}

loginCheck();