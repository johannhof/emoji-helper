(function() {
  var exports = {};

  var chrome = window.chrome;

  function getImageTagSelect(src){
    var size = "19px";
    var copyDiv = document.createElement("img");
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.src = src;
    copyDiv.style.width = size;
    copyDiv.style.height = size;
    copyDiv.unselectable = "off";
    var r = document.createRange();
    r.selectNode(copyDiv);
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
    return copyDiv;
  }

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
    if(domElement.value){
      domElement.focus();
      document.execCommand("SelectAll");
    } else {
      var copyDiv = getImageTagSelect(domElement);
    }

    document.execCommand("copy");
    if(copyDiv){
      document.body.removeChild(copyDiv);
    }
  };

  exports.insertToActive = function (text) {
    chrome.tabs.executeScript({
      code: 'document.activeElement.value += "' + (text || "") + '"'
    });
  };

  window.vendor = exports;
}());
