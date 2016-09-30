var selection = '';

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.method === 'get_selection') {
    selection = message.data;
  }
});

function handleMenuClick(info) {
  if (info.menuItemId === 'save_page') {
    alert('save_page')
  }
  if (info.menuItemId === 'save_selection') {
    alert(selection);
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
