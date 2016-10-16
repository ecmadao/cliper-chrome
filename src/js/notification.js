class Notification {
  listen() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.method === 'add_cliper_success') {
        this._showNotification(message.data);
      }
    });
  }

  notificationTemplate(title) {
    return `<div class='cliper_notification active'><div class='notification_title'>成功添加摘记，收录在：</div><a class='notification_content' href="http://cliper.com.cn" target="_blank">${title}</a></div>`;
  }

  _showNotification(title) {
    const $notification = $(this.notificationTemplate(title));
    $('body').append($notification);
    $notification.addClass('active');
    setTimeout(() => {
      this._removeNotification($notification);
    }, 3500);
  }

  _removeNotification($target) {
    $target.removeClass('active');
    setTimeout(() => {
      $target.remove();
    }, 500);
  }
}

export default Notification;
