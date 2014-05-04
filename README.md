Emoji Helper
============

An Emoji cheat sheet extension for Chrome, Firefox and Safari. Also a Bookmarklet. Built because I like spamming my coworkers with :mushroom: :pig: :rocket: :snail: but fortunately have more important things to keep in mind than the name for :moyai:

http://emoji-cheat-sheet.com is a great site, but opening a new tab distracts me too much..

Visit http://johannhof.github.io/emoji-helper for download links from the official stores.

## Development

Since nowadays most browsers allow plugins to be written in HTML/CSS/JS, it is very easy to build a cross-browser extension, especially when you're not interested in low-level browser functionality.

### Building

The build process is done through Gulp. Each submodule (`chrome`, `safari`, `firefox`, `bookmarklet`) has its own `Gulpfile` which takes care of building the corresponding extension build, e.g. copying required shared resources from the `shared` folder. 

The generated files are located in the `build` folders. To load the build folder into the browser, do the following:


#### Chrome

```
cd chrome
gulp build
```
Follow this guide https://developer.chrome.com/extensions/getstarted#unpacked and select the `build` folder.


#### Firefox

A good introduction to the Mozilla Add-on SDK is https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Getting_started

```
cd firefox
gulp build
cd build
cfx run
```

#### Safari

```
cd safari
gulp build
```

The `build` folder now contains `emoji.safariextension`, which can be loaded using the Extension Builder (https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/UsingExtensionBuilder/UsingExtensionBuilder.html)

#### Bookmarklet

```
cd bookmarklet
gulp dev
open test.html
```

`gulp dev` will start a server to deliver the bookmarklet. You can test/debug the bookmarklet using test.html.
