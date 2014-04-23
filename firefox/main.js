var data = require("sdk/self").data;
var ss = require("sdk/simple-storage");

// get clipboard helper service
var {Cc, Ci} = require("chrome");
var gClipboardHelper = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper);

var text_entry = require("sdk/panel").Panel({
  width: 510,
  height: 350,
  contentURL: data.url("popup.html"),
  contentScriptFile: data.url("helper.js")
});

text_entry.port.on("copy", function(text) {
  gClipboardHelper.copyString(text);
});

text_entry.port.on("set", function(item) {
  var key = Object.keys(item)[0];
  ss.storage[key] = item[key];
});

text_entry.port.on("get", function(key) {
  text_entry.port.emit("send", {
    key: key,
    value: ss.storage[key]
  });
});

// Create a button
require("sdk/ui/button/action").ActionButton({
  id: "show-panel",
  label: "Show Emoji Helper",
  icon: {
    "16": "./icon.png",
    "32": "./icon.png",
    "64": "./icon.png"
  },
  onClick: function() {
    text_entry.show();
  }
});
