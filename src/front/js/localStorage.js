

export const setAccessToken = (value) => {

  const obj = {
    value: value,
    expire: Date.now() + 1800000,
  };

  window.localStorage.setItem('accessToken', JSON.stringify(obj));
}



export const getAccessToken = () => {
  const accessToken = window.localStorage.getItem('accessToken');

  if (!accessToken) return null;

  const data = JSON.parse(accessToken);

  if (Date.now() > data.expire) {
    window.localStorage.removeItem('accessToken')

    return null;
  }

  return data.value;
}
