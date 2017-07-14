# Emoji Helper [![](https://travis-ci.org/johannhof/emoji-helper.svg?branch=master)](https://travis-ci.org/johannhof/emoji-helper) [![](https://img.shields.io/github/release/johannhof/emoji-helper.svg?style=flat)](https://github.com/johannhof/emoji-helper/releases)

An Emoji cheat sheet extension for Chrome, Firefox and Opera. Built because I like spamming my coworkers with :mushroom: :pig: :rocket: :snail: but fortunately have more important things to keep in mind than the name for :moyai:

Visit http://johannhof.github.io/emoji-helper for download links from the official stores.

![](https://raw.githubusercontent.com/johannhof/emoji-helper/master/resources/tile1.png)

## Development

### Building

The build process is done through Gulp.

```bash
$ gulp build
```

The `watch` command automatically re-builds the sources on change:

```bash
$ gulp watch
```

The generated files are located in the `build` folders. To load the build folder into the browser, do the following:

#### Firefox

You can follow this guide to install a WebExtension temporarily: https://developer.mozilla.org/Add-ons/WebExtensions/Temporary_Installation_in_Firefox

#### Chrome

Follow this guide https://developer.chrome.com/extensions/getstarted#unpacked and select the `build` folder.

## Release

To create a zipped release package of the extension that can be uploaded to one of the stores, run

```bash
$ gulp release
```

## Fetching an updated Emoji list

Our Emoji list is taken from the [gemoji project](https://github.com/github/gemoji) (https://api.github.com/emojis). Whenever GitHub updates their list of Emoji, you can run

```bash
$ gulp fetch-images
$ gulp sprite
```

to download the updated images and generate a new sprite.
