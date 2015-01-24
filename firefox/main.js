var data = require("sdk/self").data;
var ss = require("sdk/simple-storage");
var clipboard = require("sdk/clipboard");
var Panel = require("sdk/panel").Panel;
var ToggleButton = require('sdk/ui/button/toggle').ToggleButton;
var Hotkey = require("sdk/hotkeys").Hotkey;

var panel, button;

panel = Panel({
  width: 510,
  height: 370,
  contentURL: data.url("popup.html"),
  contentScriptFile: data.url("helper.js"),
  onHide: function() {
    button.state('window', {checked: false});
  }
});

panel.port.on("copy", function(text) {
  clipboard.set(text);
});

panel.port.on("set", function(item) {
  ss.storage[item.key] = item.value;
});

panel.port.on("get", function(key) {
  panel.port.emit("send", {
    key: key,
    value: ss.storage[key]
  });
});

// Create a button
button = ToggleButton({
  id: "show-emoji-panel",
  label: "Show Emoji Helper",
  icon: {
    "16": "./icon.png",
    "32": "./icon.png",
    "64": "./icon.png"
  },
  onChange: function (state) {
    if (state.checked) {
      panel.show({
        position: button
      });
    }
  }
});

// create a keyboard shortcut
Hotkey({
  combo: "accel-e",
  onPress: function() {
    if (panel.isShowing) {
      panel.hide();
    }else{
      panel.show({
        position: button
      });
    }
  }
});
