var data = require("sdk/self").data;
var ss = require("sdk/simple-storage");

var {Cc, Ci} = require("chrome");
var gClipboardHelper = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper);

// Construct a panel, loading its content from the "text-entry.html"
// file in the "data" directory, and loading the "get-text.js" script
// into it.
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
  console.log("Stored " + item);
});

text_entry.port.on("get", function(key) {
  text_entry.port.emit("send", ss.storage[key]);
  console.log(ss.storage[key]);
});

// Create a button
require("sdk/ui/button/action").ActionButton({
  id: "show-panel",
  label: "Show Panel",
  icon: {
    "16": "./icon.png",
    "32": "./icon.png",
    "64": "./icon.png"
  },
  onClick: function() {
    text_entry.show();
  }
});
