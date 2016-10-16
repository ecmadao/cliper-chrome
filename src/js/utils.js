import {polyfill} from 'es6-promise';
polyfill();

const BASE_URL = "http://cliper.com.cn";

export const fetchCsrf = (getCsrfUrl) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${BASE_URL}/csrf`,
      method: 'get',
      success: (data) => {
        resolve(data.data);
      },
      error: (err) => {
        console.log(err);
        reject(false);
      }
    });
  });
};

export const validateEmail = (email) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

export const getValidateEmail = (targetId) => {
  var email = document.getElementById(targetId).value;
  if (email && validateEmail(email)) {
    return email;
  }
  return false;
};

export const getValidatePassword = (targetId) => {
  var password = document.getElementById(targetId).value;
  if (password && password.length > 8) {
    return password;
  }
  return false
};

export const signupOrLogin = (url, data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${BASE_URL}${url}`,
      data,
      method: 'post',
      success: (data) => {
        if (data.success) {
          resolve(data.data);
        } else {
          reject(false);
        }
      },
      error: (err) => {
        console.log(err);
        reject(false);
      }
    });
  });
};

export const fetchUserInfo = (userId) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${BASE_URL}/user/${userId}/info`,
      method: 'get',
      success: (data) => {
        resolve(data.data);
      },
      error: (err) => {
        console.log(err);
        reject(false);
      }
    });
  });
};

export const postCliper = (data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${BASE_URL}/cliper/new`,
      method: 'post',
      data,
      success: (data) => {
        if (data.success) {
          resolve(true);
        } else {
          reject(false);
        }
      },
      error: (err) => {
        console.log(err);
        reject(false);
      }
    });
  });
};
