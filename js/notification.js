chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.method === 'add_cliper_success') {
    showNotification(message.data);
  }
});

function notificationTemplate(title) {
  return "<div class='cliper_notification active'><div class='notification_title'>成功添加摘记，收录在：</div><div class='notification_content'>" + title + "</div></div>";
}

function showNotification(title) {
  var $notification = $(notificationTemplate(title));
  $('body').append($notification);
  $notification.addClass('active');
  setTimeout(function() {
    removeNotification($notification);
  }, 2000);
}

function removeNotification($target) {
  $target.removeClass('active');
  setTimeout(function() {
    $target.remove();
  }, 500);
}
