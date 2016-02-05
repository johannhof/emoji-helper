# Emoji Helper [![](https://travis-ci.org/johannhof/emoji-helper.svg?branch=master)](https://travis-ci.org/johannhof/emoji-helper) [![](https://img.shields.io/github/release/johannhof/emoji-helper.svg?style=flat)](https://github.com/johannhof/emoji-helper/releases)


An Emoji cheat sheet extension for Chrome, Firefox, Safari and Opera. Also a Bookmarklet. Built because I like spamming my coworkers with :mushroom: :pig: :rocket: :snail: but fortunately have more important things to keep in mind than the name for :moyai:

Visit http://johannhof.github.io/emoji-helper for download links from the official stores.

![](https://raw.githubusercontent.com/johannhof/emoji-helper/master/resources/tile1.png)


## Development

Since nowadays most browsers allow plugins to be written in HTML/CSS/JS, it is very easy to build a cross-browser extension, especially when you're not interested in low-level browser functionality.

### Building

The build process is done through Gulp. Each submodule (`chrome`, `safari`, `firefox`, `bookmarklet`) has its own `Gulpfile` which takes care of building the corresponding extension build, e.g. copying required shared resources from the `shared` folder. 

The generated files are located in the `build` folders. To load the build folder into the browser, do the following:


#### Chrome/Opera

```bash
$ cd chrome
$ gulp build
```
Follow this guide https://developer.chrome.com/extensions/getstarted#unpacked and select the `build` folder.


#### Firefox

A good introduction to the Mozilla Add-on SDK is https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Getting_started

__Running it once__
```bash
$ cd firefox
$ gulp build
$ cd build
$ jpm run
```

__Auto-reload on changes__ (recommended)
- Install the [Extension Auto-Installer](https://addons.mozilla.org/en-US/firefox/addon/autoinstaller/)
```bash
$ cd firefox
$ gulp watch
```

#### Safari

```bash
$ cd safari
$ gulp build
```

The `build` folder now contains `emoji.safariextension`, which can be loaded using the Extension Builder (https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/UsingExtensionBuilder/UsingExtensionBuilder.html)

#### Bookmarklet

```bash
$ cd bookmarklet
$ gulp dev
$ open test.html
```

`gulp dev` will start a server to deliver the bookmarklet. You can test/debug the bookmarklet using test.html.

### Testing

Since the extension is mostly about the shared frontend, we're using CasperJS for headless browser testing.
CasperJS launches a series of tests on the development page of the bookmarklet.

Check out http://docs.casperjs.org/en/latest/installation.html for instructions on how to install CasperJS.

To run the tests, start up the bookmarklet dev task

```bash
$ cd bookmarklet
$ gulp dev
```

Now run the test task with npm

```bash
$ npm test
```
