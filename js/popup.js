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
      csrf = data.data;
    },
    error: function(err) {
      console.log(err);
    }
  });
}

function userSignupOrLogin(url, data) {
  $.ajax({
    url: url,
    method: 'post',
    data: data,
    success: function(data) {
      toggleLoading(false);
      if (data.success) {
        var user = data.data;
        chrome.storage.sync.set({user: user}, function(result) {});
        setPopDOM(user);
      }
    },
    error: function(err) {
      toggleLoading(false);
      console.log(err);
    }
  });
}

function signUp(email, password) {
  var data = {
    "email": email,
    "password": password,
    "_csrf": csrf
  };
  userSignupOrLogin('http://localhost:5000/user/signup', data);
}

function login(email, password) {
  var data = {
    "email": email,
    "password": password,
    "_csrf": csrf
  };
  userSignupOrLogin('http://localhost:5000/user/login', data);
}

function logout() {
  chrome.storage.sync.set({user: null}, function() {
    setPopDOM(null);
  });
}

function toggleLoading(loading) {
  var cliperContainer = document.querySelector('.cliper_container');
  if (loading) {
    cliperContainer.className = 'cliper_container active';
  } else {
    cliperContainer.className = 'cliper_container';
  }
}

function setPopDOM(user) {
  var userform = document.getElementById('cliper_userform');
  var userinfo = document.getElementById('cliper_userinfo');
  if (user && user.username) {
    userform.className = "disabled";
    userinfo.className = "active";
    $('.user_name').text(user.username);
  } else {
    userform.className = "active";
    userinfo.className = "disabled";
  }
  toggleLoading(false);
}

toggleLoading(true);
getCsrf();

// signup
document.getElementById('cliper_signup').onclick = function() {
  var email = getValidateEmail('cliper_email');
  var password = getValidatePassword('cliper_password');
  if (email && password) {
    toggleLoading(true);
    signUp(email, password);
  }
}
// login
document.getElementById('cliper_login').onclick = function() {
  var email = getValidateEmail('cliper_email');
  var password = getValidatePassword('cliper_password');
  if (email && password) {
    toggleLoading(true);
    login(email, password);
  }
}
// logout
document.getElementById('cliper_logout').onclick = function() {
  logout();
}

chrome.storage.sync.get('user', function(result) {
  setPopDOM(result && result.user);
});
