function getSelectedText() {
  if (window.getSelection) {
    return window.getSelection().toString();
  } else if (document.getSelection) {
    return document.getSelection();
  } else if (document.selection) {
    return document.selection.createRange().text;
  }
}

window.onmouseup = function(e) {
  if (!e.button === 2) {
    return;
  }
  var text = getSelectedText();
  var title = document.title;
  var url = window.location.href;
  var data = {
    text: text,
    title: title,
    url: url
  };
  var message = {
    method: 'get_selection',
    data: data
  }
  if (text) {
    message['method'] = 'get_page';
  }
  chrome.runtime.sendMessage(message, function(response) {});
};
