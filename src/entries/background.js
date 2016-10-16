import Background from '../js/background';

const background = new Background();
background.initial();

(() => {
	chrome.tabs.query({currentWindow: true, active : false}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.reload(tab.id);
    });
	});
})();
