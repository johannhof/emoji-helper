(function() {

  // local vars for linting (and performance)
  var vendor = window.vendor;

  var VERSION = "1.2.0";

  // upper bar
  var logos = document.querySelectorAll(".group-logo");
  logos = Array.prototype.slice.call(logos);
  var recentButton = document.querySelector(".group-logo[data-group=recent]");
  var searchInput = document.getElementById("search");

  // group divs
  var groups = document.querySelectorAll(".group[data-emoji=true]");
  groups = Array.prototype.slice.call(groups);
  var recentDiv = document.getElementById("recent");
  var searchContainer = document.getElementById("search-container");

  // detail area
  var detailInput = document.getElementById("detail-input");
  var unicodeInput = document.getElementById("unicode-input");
  var detailLogo = document.getElementById("detail-logo");
  var aboutButton = document.getElementById("about-button");
  var settingsButton = document.getElementById("settings-button");
  var insertButton = document.getElementById("insert-button");
  var clearHistoryButton = document.getElementById("clear-history-button");

  var copyMessage = document.getElementById("copy-message");
  var copyName = document.getElementById("copy-name");
  var copyUnicode = document.getElementById("copy-unicode");
  var copyImg = document.getElementById("copy-img");
  var insertName = document.getElementById("insert-name");

  var whatToCopy = "name";
  var lastCopyValue = "";

  var hotkeyGroup = document.getElementsByName("hotkey");

  function selectHotkeySetting(setting){
    document.getElementById("hotkey-" + setting).checked = true;
  }

  // recently used emojis
  var recent = [];

  // maximum number of recents
  var MAX_RECENT = 50;

  // maximum displayed search results for performance
  var MAX_SEARCH_RESULTS = 200;

  // very simple utility http get function
  function getJSON(url, cb) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        cb(request.responseText);
      }
    };
  }

  // load emojis from json
  var emojis = [];
  getJSON("./data/sprite.json", function(res) {
    // flatten and objectify emojis
    var map = JSON.parse(res);
    Object.keys(map).forEach(function(group) {
      Object.keys(map[group]).forEach(function(k) {
        var emoji = map[group][k];
        emojis.push({
          name: k,
          unicode: emoji.unicode,
          pos: -emoji.x / 2 + "px " + -emoji.y / 2 + "px"
        });
      });
    });
  });

  // show an emoji in the bottom detail screen
  function showDetail(item) {
    detailLogo.style.backgroundPosition = item.pos;
    detailInput.value = ":" + item.name + ":";
    if (unicodeInput) {
      unicodeInput.value = item.unicode || "";
    }
  }

  var showMessage = (function() {
    var timer;
    return function(text) {
      if(!copyMessage){
        return;
      }
      copyMessage.classList.add("show");
      copyMessage.textContent = text;
      clearTimeout(timer);
      timer = setTimeout(function() {
        copyMessage.classList.remove("show");
      }, 1000);
    };
  }());

  function showCopyMessage(val){
    showMessage(val + " copied to clipboard");
  }

  function addEmojiClickListener(node) {
    node.addEventListener("click", function(event) {
      var item = {
        name: node.dataset.name,
        unicode: node.dataset.unicode,
        pos: node.style.backgroundPosition
      };

      // save last in local storage
      vendor.setLocal("last", item);

      // set item in recent
      recent = [item].concat(recent.filter(function(el) {
        return el.name !== item.name;
      }));

      // remove last if number too high
      if (recent.length > MAX_RECENT) {
        recent.splice(MAX_RECENT, 1);
      }

      // persist recent
      vendor.setLocal("recent", recent);

      // show selected emoji in detail
      showDetail(item);
      switch(whatToCopy){
        case "unicode":
          lastCopyValue = unicodeInput.value;
          vendor.copyToClipboard(unicodeInput);
          showCopyMessage(unicodeInput.value);
        break;
        case "copyimg":
          lastCopyValue = "https://raw.githubusercontent.com/johannhof/emoji-helper/master/shared/img/emoji/" + detailInput.value.substr(1, detailInput.value.length - 2) + ".png";
          vendor.copyToClipboard(lastCopyValue);
          showCopyMessage("Image");
        break;
        case "insertname":
            vendor.insertToActive(detailInput.value);
            showMessage("Added " + detailInput.value + " to active page input.");
        break;
        // name
        default:
          lastCopyValue = detailInput.value;
          vendor.copyToClipboard(detailInput);
          showCopyMessage(detailInput.value);
      }
    });
  }

  function appendItem(container, item) {
    var cont = document.createElement("div");
    cont.classList.add("emoji");
    cont.title = item.name;
    cont.dataset.name = item.name;
    cont.dataset.unicode = item.unicode || "";
    cont.style.backgroundPosition = item.pos;

    addEmojiClickListener(cont);
    container.appendChild(cont);
  }

  function updateRecent() {
    recentDiv.textContent = "";

    if(recent.length){
      recentDiv.style.backgroundImage = "";
      // intermediate container to render the dom as few times as possible
      var cont = document.createElement("div");
      recent.forEach(appendItem.bind(null, cont));
      recentDiv.appendChild(cont);
    }else{
      // help screen if new install
      recentDiv.style.backgroundImage = 'url("./img/emoji-help.png")';
    }
  }

  groups.forEach(function(group) {
    var nodes = Array.prototype.slice.call(group.childNodes);
    nodes.forEach(addEmojiClickListener);
  });

  var setActiveGroup = (function() {
    // show first group
    var activeGroup = groups[0];
    activeGroup.style.display = "block";
    var activeLogo = logos[0];
    activeLogo.classList.add("selected");

    return function(logo) {
      if (activeLogo !== logo) {
        logo.classList.add("selected");
        activeLogo.classList.remove("selected");
        activeLogo = logo;
        var newActive = document.getElementById(logo.dataset.group);
        activeGroup.style.display = "none";
        newActive.style.display = "block";
        activeGroup = newActive;
      }
    };
  }());

  aboutButton.addEventListener("click", function() {
    setActiveGroup(aboutButton);
  });

  if(settingsButton){
    settingsButton.addEventListener("click", function() {
      setActiveGroup(settingsButton);
    });
  }

  clearHistoryButton.addEventListener("click", function() {
    var item = {
      name: "lemon",
      pos: "0px 0px",
      unicode: "🍋"
    };
    recent = [];
    vendor.setLocal("recent", recent);
    vendor.setLocal("last", item);
    showDetail(item);
  });

  detailInput.addEventListener("click", function() {
    lastCopyValue = detailInput.value;
    vendor.copyToClipboard(detailInput);
    showCopyMessage(detailInput.value);
  });

  if(insertButton){
    insertButton.addEventListener("click", function(event) {
      event.preventDefault();
      vendor.insertToActive(lastCopyValue);
      showMessage("Added " + lastCopyValue + " to active page input.");
    }, true);
  }

  if(unicodeInput){
    unicodeInput.addEventListener("click", function() {
      lastCopyValue = unicodeInput.value;
      vendor.copyToClipboard(unicodeInput);
      showCopyMessage(unicodeInput.value);
    });
  }

  recentButton.addEventListener("click", updateRecent);

  // add click listener to logo that changes the displayed group
  logos.forEach(function(logo) {
    logo.addEventListener("click", setActiveGroup.bind(null, logo));
  });

  // search functionality
  (function() {
    var lastVal;
    searchInput.addEventListener("keyup", function() {
      setActiveGroup(searchInput);
      var val = searchInput.value;
      // prevent flickering
      setTimeout(function() {
        if (searchInput.value === val && val !== lastVal) {
          lastVal = val;
          searchContainer.textContent = "";

          // intermediate container to render the dom as few times as possible
          var cont = document.createElement("div");
          var filtered = emojis.filter(function(emoji) {
            return emoji.name.indexOf(val) !== -1;
          });
          filtered = filtered.slice(0, MAX_SEARCH_RESULTS);
          filtered.forEach(appendItem.bind(null, searchContainer));
          recentDiv.appendChild(cont);
        }
      }, 200);
    });
  }());

  // wait for plugin to be fully loaded before querying data
  window.addEventListener("load", function() {
    // get last used emoji from user locals and display
    vendor.getLocal("last", function(item) {
      if (item) {
        showDetail(item);
        lastCopyValue = detailInput.value || "";
      }else{
        showDetail({
          name: "lemon",
          pos: "0px 0px",
          unicode: "🍋"
        });
      }
    });

    // get recents from user locals
    vendor.getLocal("recent", function(rec) {
      if (rec && rec.length) {
        recent = rec;
      }
      updateRecent();
    });

    // show info in blue when updated
    vendor.getLocal("version", function(ver) {
      if (ver !== VERSION) {
        aboutButton.classList.add("update");
        aboutButton.addEventListener("click", function() {
          aboutButton.classList.remove("update");
          vendor.setLocal("version", VERSION);
        });
      }
    });

    // copy settings
    vendor.getLocal("copy-setting", function(which) {
      if (which) {
        whatToCopy = which;
        switch(whatToCopy){
          case "unicode":
            copyUnicode.checked = true;
          break;
          case "name":
            copyName.checked = true;
          break;
          case "copyimg":
            copyImg.checked = true;
          break;
          case "insertname":
            insertName.checked = true;
          break;
        }
      }
    });

    // combo settings

    if(hotkeyGroup){
      vendor.getLocal("combo", function(combo) {
        if(combo){
          selectHotkeySetting(combo);
        }
      });
      var listener = function (e) {
        vendor.setHotkey(e.target.value);
      };
      for(var i = 0; i < hotkeyGroup.length; i++){
        hotkeyGroup[i].addEventListener("change", listener);
      }

    }

  }, false);

  copyName.addEventListener("click", function () {
    whatToCopy = "name";
    vendor.setLocal("copy-setting", "name");
  });

  copyUnicode.addEventListener("click", function () {
    whatToCopy = "unicode";
    vendor.setLocal("copy-setting", "unicode");
  });

  if(insertName) {
      insertName.addEventListener("click", function () {
        whatToCopy = "insertname";
        vendor.setLocal("copy-setting", "insertname");
      });
  }

  copyImg.addEventListener("click", function () {
    whatToCopy = "copyimg";
    vendor.setLocal("copy-setting", "copyimg");
  });

  var alphaNum = /[a-zA-Z0-9]/;
  document.addEventListener("keydown", function(event) {
    if (event.target === searchInput) {
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey){
      return;
    }
    switch (event.keyCode) {
      case 49:
        // show recent
        updateRecent();
        setActiveGroup(logos[0]);
        break;
      case 50:
        // show people
        setActiveGroup(logos[1]);
        break;
      case 51:
        // show nature
        setActiveGroup(logos[2]);
        break;
      case 52:
        // show objects
        setActiveGroup(logos[3]);
        break;
      case 53:
        // show places
        setActiveGroup(logos[4]);
        break;
      case 54:
        // show symbols
        setActiveGroup(logos[5]);
        break;
      default:
        var str = String.fromCharCode(event.keyCode);
        if (alphaNum.test(str)) {
          searchInput.value = "";
          searchInput.focus();
        }
        break;
    }
  });

}());
