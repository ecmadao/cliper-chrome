var csrf = '';

function validateEmail(email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function getValidateEmail(targetId) {
  var email = document.getElementById(targetId).value;
  if (email && validateEmail(email)) {
    return email;
  }
  return false;
}

function getValidatePassword(targetId) {
  var password = document.getElementById(targetId).value;
  if (password && password.length > 8) {
    return password;
  }
  return false
}

function getCsrf() {
  $.ajax({
    url: 'http://localhost:5000/csrf',
    method: 'get',
    success: function(data) {
      console.log(data);
      csrf = data.data;
    },
    error: function(err) {
      console.log(err);
    }
  });
}

function signUp(email, password) {
  $.ajax({
    url: 'http://localhost:5000/user/signup',
    method: 'post',
    data: {
      "email": email,
      "password": password,
      "_csrf": csrf
    },
    success: function(data) {
      console.log(data);
    },
    error: function(err) {
      console.log(err);
    }
  });
}

getCsrf();

document.getElementById('info_submit').onclick = function() {
  var email = getValidateEmail('cliper_email');
  var password = getValidatePassword('cliper_password');
  if (email && password) {
    signUp(email, password);
  }
}
