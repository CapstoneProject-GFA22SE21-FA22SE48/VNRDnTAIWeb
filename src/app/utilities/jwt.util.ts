import jwt_decode, { JwtPayload } from 'jwt-decode';

export const decodeToken = (token: string)  => {
  try{
    if(token === undefined || token === null){
      return null;
    } 
    return jwt_decode<any>(token);
  } catch {
    return null;
  }
  
}

export const verifyLocalStorageToken = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  var isValid = false;
  // var decodedToken = jwtDecode<JwtPayload>(token ? token : '');
  var decodedToken = null;
  if(token === undefined || token === null){
    return isValid;
  } 
  decodedToken = jwt_decode<any>(token);
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
  var decodedToken = null;
  if(token === undefined || token === null){
    return isValid;
  } 
  decodedToken = jwt_decode<any>(token);
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
  return localStorage.getItem('token') !== ''
    ? localStorage.getItem('token')
    : sessionStorage.getItem('token') !== ''
    ? sessionStorage.getItem('token')
    : '';
};
