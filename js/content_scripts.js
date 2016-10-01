function getSelectedText() {
  if (window.getSelection) {
    return window.getSelection().toString();
  } else if (document.getSelection) {
    return document.getSelection();
  } else if (document.selection) {
    return document.selection.createRange().text;
  }
}

window.onmouseup = function() {
  var text = getSelectedText();
  if (text) {
    chrome.runtime.sendMessage({
      method: 'get_selection',
      data: text
    }, function(response) {});
  }
};
