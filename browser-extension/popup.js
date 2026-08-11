'use strict';

document.getElementById('openRhineLab').addEventListener('click', function () {
  chrome.tabs.create({ url: 'https://halleylab.github.io/Rhine_Lab/' }, function () {
    window.close();
  });
});
