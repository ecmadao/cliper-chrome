var selection = '';
var userId = '';

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.method === 'get_selection') {
    selection = message.data;
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

function handleMenuClick(info) {
  if (info.menuItemId === 'save_page') {
    alert('save_page');
    alert(userId);
  }
  if (info.menuItemId === 'save_selection') {
    alert(selection);
    alert(userId);
  }
}

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
