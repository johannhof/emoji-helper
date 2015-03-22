(function() {
  var exports = {};

  var chrome = window.chrome;

  exports.getLocal = function(name, cb) {
    chrome.storage.local.get(name, function(item) {
      cb(item[name]);
    });
  };

  exports.setLocal = function(key, value) {
    var item = {};
    item[key] = value;
    chrome.storage.local.set(item);
  };

  exports.copyToClipboard = function(domElement) {
    if(domElement){
      domElement.focus();
    }
    document.execCommand('SelectAll');
    document.execCommand('copy');
  };

  exports.insertToActive = function (text) {
    chrome.tabs.executeScript({
      code: 'document.activeElement.value += "' + (text || "") + '"'
    });
  };

  window.vendor = exports;
}());
