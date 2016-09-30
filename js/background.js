var selection = '';

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.method === 'get_selection') {
    selection = message.data;
  }
});

chrome.contextMenus.create({
  type: 'normal',
  title: 'save page',
  id: 'save_page',
  onclick: function() {
    alert('save_page');
  }
});

chrome.contextMenus.create({
  type: 'normal',
  title: 'save selection',
  id: 'save_selection',
  contexts: ['selection'],
  onclick: function() {
    alert(selection);
  }
});
