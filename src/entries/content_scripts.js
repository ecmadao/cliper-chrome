import '../css/notification.css';
import Notification from '../js/notification';
import Selection from '../js/selection';

const notification = new Notification();
notification.listen();

const selection = new Selection();
selection.listenKeyDown().listenMouseUp();
