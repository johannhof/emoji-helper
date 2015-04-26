(function() {
  var exports = {};

  function send(name, data){
    var event = document.createEvent("CustomEvent");
    event.initCustomEvent(name, true, true, data);
    document.documentElement.dispatchEvent(event);
  }

  function getImageHtml(src){
    var size = "19px";
    var copyDiv = document.createElement("img");
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.src = src;
    copyDiv.style.width = size;
    copyDiv.style.height = size;
    copyDiv.unselectable = "off";
    var resp = copyDiv.outerHTML;
    document.body.removeChild(copyDiv);
    return resp;
  }

  exports.getLocal = function(name, cb) {
    send("get", name);

    var listener = function(event) {
      if (event.detail) {
        cb(JSON.parse(event.detail));
      } else {
        cb();
      }
      window.removeEventListener("send_" + name, listener);
    };

    // suffix data name to have unique recepients
    window.addEventListener("send_" + name, listener, false);
  };

  exports.setLocal = function(key, value) {
    send("set", {key: key, value: value});
  };

  exports.copyToClipboard = function(domElement) {
    if(domElement){
      if(!domElement.value) {
        send("copy", getImageHtml(domElement));
      } else {
        domElement.focus();
        domElement.select();
        send("copy", domElement.value);
      }
    }
  };

  exports.insertToActive = function (text) {
    send("insert", text);
  };

  exports.setHotkey = function (combo) {
    send("combo", combo);
  };

  window.vendor = exports;
}());
