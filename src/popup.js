(function() {
  const VERSION = "2.1.0";

  function getLocal(name, cb) {
    chrome.storage.local.get(name, function(item) {
      cb(item[name]);
    });
  };

  function setLocal(key, value) {
    let item = {};
    item[key] = value;
    chrome.storage.local.set(item);
  };

  function copyToClipboard(source) {
    if (source.value) {
      source.focus();
      source.select();
      document.execCommand("copy");
      return;
    }

    let size = "19px";
    let copyDiv = document.createElement("img");
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.src = source;
    copyDiv.style.width = size;
    copyDiv.style.height = size;
    copyDiv.unselectable = "off";
    let r = document.createRange();
    r.selectNode(copyDiv);
    let s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r); 
    document.execCommand("copy");
    document.body.removeChild(copyDiv);
  };

  function insertToActive(text) {
    chrome.tabs.executeScript({
      code: 'document.activeElement.value += "' + (text || "") + '"'
    });
  };

  // upper bar
  let logos = document.querySelectorAll(".group-logo");
  logos = Array.prototype.slice.call(logos);
  let recentButton = document.querySelector(".group-logo[data-group=recent]");
  let searchInput = document.getElementById("search");

  // group divs
  let groups = document.querySelectorAll(".group[data-emoji=true]");
  groups = Array.prototype.slice.call(groups);
  let recentDiv = document.getElementById("recent");
  let searchContainer = document.getElementById("search-container");

  // detail area
  let detailInput = document.getElementById("detail-input");
  let unicodeInput = document.getElementById("unicode-input");
  let detailLogo = document.getElementById("detail-logo");
  let aboutButton = document.getElementById("about-button");
  let settingsButton = document.getElementById("settings-button");
  let insertButton = document.getElementById("insert-button");
  let clearHistoryButton = document.getElementById("clear-history-button");

  let copyMessage = document.getElementById("copy-message");
  let copyName = document.getElementById("copy-name");
  let copyUnicode = document.getElementById("copy-unicode");
  let copyImg = document.getElementById("copy-img");
  let insertName = document.getElementById("insert-name");

  let whatToCopy = "name";
  let lastCopyValue = "";

  // recently used emojis
  let recent = [];

  // maximum number of recents
  const MAX_RECENT = 50;

  // maximum displayed search results for performance
  const MAX_SEARCH_RESULTS = 200;

  // load emojis from json
  let emojis = [];
  fetch("./emoji.json")
    .then(res => res.json())
    .then(function(map) {
      // flatten and objectify emojis
      for (let group of Object.keys(map)) {
        for (let emoji of map[group]) {
          emoji.pos = -emoji.x / 2 + "px " + -emoji.y / 2 + "px";
          emojis.push(emoji);
        }
      }
    });

  // show an emoji in the bottom detail screen
  function showDetail(item) {
    detailLogo.style.backgroundPosition = item.pos;
    detailInput.value = ":" + item.name + ":";
    if (unicodeInput) {
      unicodeInput.value = item.unicode || "";
    }
  }

  let showMessage = (function() {
    let timer;
    return function(text) {
      if(!copyMessage){
        return;
      }
      copyMessage.classList.add("show");
      copyMessage.textContent = text;
      clearTimeout(timer);
      timer = setTimeout(() => copyMessage.classList.remove("show"), 1000);
    };
  }());

  function showCopyMessage(val){
    showMessage(val + " copied to clipboard");
  }

  function addEmojiClickListener(node) {
    node.addEventListener("click", function(event) {
      let item = {
        name: node.dataset.name,
        unicode: node.dataset.unicode,
        pos: node.style.backgroundPosition
      };

      // save last in local storage
      setLocal("last", item);

      // set item in recent
      recent = [item].concat(recent.filter(el => el.name !== item.name));

      // remove last if number too high
      if (recent.length > MAX_RECENT) {
        recent.splice(MAX_RECENT, 1);
      }

      // persist recent
      setLocal("recent", recent);

      // show selected emoji in detail
      showDetail(item);
      switch(whatToCopy){
        case "unicode":
          lastCopyValue = unicodeInput.value;
          copyToClipboard(unicodeInput);
          showCopyMessage(unicodeInput.value);
        break;
        case "copyimg":
          lastCopyValue = "https://raw.githubusercontent.com/johannhof/emoji-helper/master/shared/img/emoji/" + detailInput.value.substr(1, detailInput.value.length - 2) + ".png";
          copyToClipboard(lastCopyValue);
          showCopyMessage("Image");
        break;
        case "insertname":
            insertToActive(detailInput.value);
            showMessage("Added " + detailInput.value + " to active page input.");
        break;
        // name
        default:
          lastCopyValue = detailInput.value;
          copyToClipboard(detailInput);
          showCopyMessage(detailInput.value);
      }
    });
  }

  function appendItem(container, item) {
    let cont = document.createElement("div");
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
      let cont = document.createElement("div");
      recent.forEach(appendItem.bind(null, cont));
      recentDiv.appendChild(cont);
    }else{
      // help screen if new install
      recentDiv.style.backgroundImage = 'url("./img/emoji-help.svg")';
    }
  }

  for (let group of groups) {
    let nodes = Array.prototype.slice.call(group.childNodes);
    nodes.forEach(addEmojiClickListener);
  }

  let setActiveGroup = (function() {
    // show first group
    let activeGroup = groups[0];
    activeGroup.style.display = "block";
    let activeLogo = logos[0];
    activeLogo.classList.add("selected");

    return function(logo) {
      if (activeLogo !== logo) {
        logo.classList.add("selected");
        activeLogo.classList.remove("selected");
        activeLogo = logo;
        let newActive = document.getElementById(logo.dataset.group);
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
    let item = {
      name: "lemon",
      pos: "-621px -184px",
      unicode: "🍋"
    };
    recent = [];
    setLocal("recent", recent);
    setLocal("last", item);
    showDetail(item);
  });

  detailInput.addEventListener("click", function() {
    lastCopyValue = detailInput.value;
    copyToClipboard(detailInput);
    showCopyMessage(detailInput.value);
  });

  if(insertButton){
    insertButton.addEventListener("click", function(event) {
      event.preventDefault();
      insertToActive(lastCopyValue);
      showMessage("Added " + lastCopyValue + " to active page input.");
    }, true);
  }

  if(unicodeInput){
    unicodeInput.addEventListener("click", function() {
      lastCopyValue = unicodeInput.value;
      copyToClipboard(unicodeInput);
      showCopyMessage(unicodeInput.value);
    });
  }

  recentButton.addEventListener("click", updateRecent);

  // add click listener to logo that changes the displayed group
  for (let logo of logos) {
    logo.addEventListener("click", () => setActiveGroup(logo));
  }

  // search functionality
  (function() {
    let lastVal;
    searchInput.addEventListener("focus", function() {
      setActiveGroup(searchInput);
    });
    searchInput.addEventListener("keyup", function() {
      let val = searchInput.value;
      // prevent flickering
      setTimeout(function() {
        if (searchInput.value === val && val !== lastVal) {
          lastVal = val;
          searchContainer.textContent = "";

          // intermediate container to render the dom as few times as possible
          let cont = document.createElement("div");
          let filtered = emojis.filter(function(emoji) {
            return emoji.name.includes(val) || emoji.tags.some(tag => tag.includes(val));
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
    getLocal("last", function(item) {
      if (item) {
        showDetail(item);
        lastCopyValue = detailInput.value || "";
      } else {
        showDetail({
          name: "lemon",
          pos: "-621px -184px",
          unicode: "🍋"
        });
      }
    });

    // get recents from user locals
    getLocal("recent", function(rec) {
      if (rec && rec.length) {
        recent = rec;
      }
      updateRecent();
    });

    // show info in blue when updated
    getLocal("version", function(ver) {
      if (ver !== VERSION) {
        aboutButton.classList.add("update");
        aboutButton.addEventListener("click", function() {
          aboutButton.classList.remove("update");
          setLocal("version", VERSION);
        });
      }
    });

    // copy settings
    getLocal("copy-setting", function(which) {
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

  }, false);

  copyName.addEventListener("click", function () {
    whatToCopy = "name";
    setLocal("copy-setting", "name");
  });

  copyUnicode.addEventListener("click", function () {
    whatToCopy = "unicode";
    setLocal("copy-setting", "unicode");
  });

  if(insertName) {
      insertName.addEventListener("click", function () {
        whatToCopy = "insertname";
        setLocal("copy-setting", "insertname");
      });
  }

  copyImg.addEventListener("click", function () {
    whatToCopy = "copyimg";
    setLocal("copy-setting", "copyimg");
  });

  let alphaNum = /[a-zA-Z0-9]/;
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
        let str = String.fromCharCode(event.keyCode);
        if (alphaNum.test(str)) {
          searchInput.value = "";
          searchInput.focus();
        }
        break;
    }
  });

  // Show the correct keyboard shortcut on Mac.
  let shortcut = document.getElementById("shortcut");
  if (navigator.userAgent.includes("Macintosh")) {
    shortcut.textContent = "⌘-Shift-E";
  }

}());
