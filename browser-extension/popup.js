'use strict';

document.getElementById('openRhineLab').addEventListener('click', function () {
  chrome.tabs.create({ url: 'https://halleylab.github.io/Rhine_Lab/?app=1#dashboard' }, function () {
    window.close();
  });
});
