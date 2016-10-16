import {
  fetchCsrf,
  signupOrLogin,
  fetchUserInfo,
  validateEmail,
  getValidateEmail,
  getValidatePassword
} from './utils';

class Popup {
  constructor() {
    this.csrf = '';
    this._fetchCsrf();
    this._signUp = this._signUp.bind(this);
    this._login = this._login.bind(this);
    this._submit = this._submit.bind(this);
  }

  initialDOM() {
    this._bindAction();
    chrome.storage.sync.get('user', (result) => {
      result && this._setPopDOM(result.user);
    });
    return this;
  }

  _fetchCsrf() {
    fetchCsrf().then((csrf) => {
      this.csrf = csrf;
    });
  }

  _fetchUserInfo(userId) {
    if (userId === null) {
      chrome.storage.sync.get('user', (result) => {
        if (result && result.user) {
          fetchUserInfo(result.user.objectId).then((data) => {
            $('.user_info').text(data);
          });
        }
      });
      return;
    }
    fetchUserInfo(userId).then((data) => {
      $('.user_info').text(data);
    });
  }

  _bindAction() {
    // signup
    document.getElementById('cliper_signup').onclick = () => {
      this._submit(this._signUp);
    }
    // login
    document.getElementById('cliper_login').onclick = () => {
      this._submit(this._login);
    }
    // logout
    document.getElementById('cliper_logout').onclick = () => {
      this._logout();
    }
  }

  _submit(func) {
    const email = getValidateEmail('cliper_email');
    const password = getValidatePassword('cliper_password');
    if (email) {
      $('#cliper_email').removeClass('error');
    } else {
      $('#cliper_email').addClass('error');
      return;
    }
    if (password) {
      $('#cliper_password').removeClass('error');
    } else {
      $('#cliper_password').addClass('error');
      return;
    }
    this._toggleLoading(true);
    func(email, password);
  }

  _signUp(email, password) {
    var data = {
      email,
      password,
      "_csrf": this.csrf
    };
    this._userSignupOrLogin('/user/signup', data);
  }

  _login(email, password) {
    const data = {
      email,
      password,
      "_csrf": this.csrf
    };
    this._userSignupOrLogin('/user/login', data);
  }

  _logout() {
    chrome.storage.sync.set({user: null}, () => {
      this._setPopDOM(null);
    });
  }

  _userSignupOrLogin(url, data) {
    this._toggleLoading(true);
    signupOrLogin(url, data).then((user) => {
      chrome.storage.sync.set({user: user}, (result) => {});
      this._setPopDOM(user);
    }).catch((err) => {
      this._toggleLoading(false);
    });
  }

  _setPopDOM(user) {
    const userform = document.getElementById('cliper_userform');
    const userinfo = document.getElementById('cliper_userinfo');
    if (user && user.username) {
      userform.className = "disabled";
      userinfo.className = "active";
      $('.user_name').text(user.username);
      this._fetchUserInfo(user.objectId);
    } else {
      userform.className = "active";
      userinfo.className = "disabled";
    }
    this._toggleLoading(false);
  }

  _toggleLoading(loading) {
    const cliperContainer = document.querySelector('.cliper_container');
    if (loading) {
      cliperContainer.className = 'cliper_container active';
    } else {
      cliperContainer.className = 'cliper_container';
    }
  }
}

export default Popup;
