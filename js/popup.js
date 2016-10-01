var csrf = '';

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

getCsrf();

document.getElementById('info_submit').onclick = function() {
  $.ajax({
    url: 'http://localhost:5000/user/signup',
    method: 'post',
    data: {
      "email": 'wlec@outlook.com',
      "password": '123456789',
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
