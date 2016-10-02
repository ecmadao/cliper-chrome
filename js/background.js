var selectionObj = null;
var userId = '';

function addCliper() {
  $.ajax({
    url: 'http://localhost:5000/csrf',
    method: 'get',
    success: function(data) {
      addNewCliper(data.data);
    },
    error: function(err) {
      console.log(err);
    }
  });
}

function addNewCliper(csrf) {
  var cliper = selectionObj;
  cliper['userId'] = userId;
  $.ajax({
    url: 'http://localhost:5000/cliper/new',
    method: 'post',
    data: {
      cliper: cliper,
      _csrf: csrf
    },
    success: function(data) {
      if (data.success) {
        var title = selectionObj.title;
        selectionObj = null;
        chrome.tabs.query(
          {active: true, currentWindow: true},
          function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id,
              {
                method: 'add_cliper_success',
                data: title
              }, function(response) {});
          }
        );
      }
    },
    error: function(err) {
      console.log(err);
    }
  });
}

function handleMenuClick(info) {
  if (!userId) {
    alert('请先点击插件icon以登录');
    return
  }
  if (!selectionObj) {
    alert('has no selection');
    return
  }
  if (info.menuItemId === 'save_page') {
    alert('save_page');
  }
  if (info.menuItemId === 'save_selection' && selectionObj.text) {
    addCliper();
  }
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.method === 'get_selection' || message.method === 'get_page') {
    selectionObj = message.data;
  }
});

chrome.storage.sync.get('user', function(result) {
  var userObj = result.user;
  userId = userObj && userObj.objectId;
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    if (key === 'user') {
      var storageChange = changes[key];
      var userObj = storageChange.newValue;
      userId = userObj && userObj.objectId;
    }
  }
});

chrome.contextMenus.onClicked.addListener(handleMenuClick);
chrome.runtime.onInstalled.addListener(function() {
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
