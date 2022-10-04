import jwtDecode, { JwtPayload } from 'jwt-decode';

export const decodeToken = (token: string) =>  jwtDecode<any>(token ? token : '');

export const verifyLocalStorageToken = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  var isValid = false;
  var decodedToken = jwtDecode<JwtPayload>(token ? token : '');
  var dateNow = new Date();

  if (
    decodedToken &&
    decodedToken.exp &&
    decodedToken.exp > dateNow.getTime() / 1000
  ) {
    isValid = true;
  } else {
    localStorage.setItem('token', '');
  }

  return isValid;
};

export const verifySessionStorageToken = (): boolean => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    return false;
  }
  var isValid = false;
  var decodedToken = jwtDecode<JwtPayload>(token ? token : '');
  var dateNow = new Date();

  if (
    decodedToken &&
    decodedToken.exp &&
    decodedToken.exp > dateNow.getTime() / 1000
  ) {
    isValid = true;
  } else {
    sessionStorage.setItem('token', '');
  }

  return isValid;
};


export const getStorageToken = () => {
  return (localStorage.getItem('token') != ''
  ? sessionStorage.getItem('token') != ''
    ? sessionStorage.getItem('token')
    : ''
  : '');
}