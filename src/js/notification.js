class Notification {
  listen() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.method === 'add_cliper_success') {
        this._showNotification(message.data);
      }
    });
  }

  notificationTemplate() {
    return `<div class='cliper_notification active'><div class='notification_title'>成功添加摘记，收录在：</div><div class='notification_content'>${title}</div></div>`;
  }

  _showNotification() {
    const $notification = $(this.notificationTemplate(title));
    $('body').append($notification);
    $notification.addClass('active');
    setTimeout(() => {
      this._removeNotification($notification);
    }, 2000);
  }

  _removeNotification() {
    $target.removeClass('active');
    setTimeout(() => {
      $target.remove();
    }, 500);
  }
}

export default Notification;
