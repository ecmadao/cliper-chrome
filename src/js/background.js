import {
  fetchCsrf,
  postCliper
} from './utils';

class Background {
  constructor() {
    this.userId = '';
    this.selectionObj = null;
    this._handleMenuClick = this._handleMenuClick.bind(this);
  }

  initial() {
    chrome.storage.sync.get('user', (result) => {
      const userObj = result.user;
      this.userId = userObj && userObj.objectId;
    });
    this._initialContextMenus();
    this._listenStorage();
    this._listenMessage();
  }

  _checkCanCliper() {
    if (!this.userId) {
      alert('请先点击插件icon以登录');
      return false;
    }
    if (!this.selectionObj) {
      alert('has no selection');
      return false;
    }
    return true;
  }

  _postCliper() {
    fetchCsrf().then((csrf) => {
      this._addNewCliper(csrf);
    });
  }

  _addNewCliper(csrf) {
    let cliper = this.selectionObj;
    this._sendSuccessMessage(cliper.title);
    cliper['userId'] = this.userId;
    const data = {
      '_csrf': csrf,
      cliper
    };
    postCliper(data).then((success) => {
      this.selectionObj = null;
    });
  }

  _sendSuccessMessage(title) {
    chrome.tabs.query(
      {active: true, currentWindow: true},
      (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id,
          {
            method: 'add_cliper_success',
            data: title
          }, (response) => {});
      }
    );
  }

  _handleMenuClick(info) {
    const result = this._checkCanCliper();
    if (result) {
      if (info.menuItemId === 'save_page' || info.menuItemId === 'save_selection') {
        this._postCliper();
      }
    }
  }

  _initialContextMenus() {
    chrome.runtime.onInstalled.addListener(() => {
      chrome.contextMenus.create({
        type: 'normal',
        title: 'save page',
        id: 'save_page'
      });
      chrome.contextMenus.create({
        type: 'normal',
        title: 'save selection',
        id: 'save_selection',
        contexts: ['selection']
      });
    });
    chrome.contextMenus.onClicked.addListener(this._handleMenuClick);
  }

  _listenStorage() {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      Object.keys(changes).forEach((key) => {
        if (key === 'user') {
          const storageChange = changes[key];
          const userObj = storageChange.newValue;
          this.userId = userObj && userObj.objectId;
        }
      });
    });
  }

  _listenMessage() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.method === 'get_selection' || message.method === 'get_page' || message.method === 'save_cliper') {
        this.selectionObj = message.data;
      }
      if (message.method === 'save_cliper' && this._checkCanCliper()) {
        this._postCliper();
      }
    });
  }
}

export default Background;
