// fix .bind by injecting a shim before phantomjs has a chance to be retarded
casper.options.onPageInitialized = function() {
  // file path needs to be relative to execution context apparently ¯\_(ツ)_/¯
  this.page.injectJs('test/es5-shim.js');
};

//log errors
casper.on("page.error", function(msg, trace) {
  this.echo("Error:    " + msg, "ERROR");
  this.echo("file:     " + trace[0].file, "WARNING");
  this.echo("line:     " + trace[0].line, "WARNING");
  this.echo("function: " + trace[0]["function"], "WARNING");
});

casper.test.begin('Navigation', function suite(test) {
  casper
    .start("http://localhost:8000", function() {
      test.assertExists('.group-logos', "main container is found");
      test.assertElementCount('.group-logos > button', 6, "there are 6 logo buttons");
    })

    /* NAVIGATION */
    .then(function() {
      this.click('button[data-group="nature"]');
    })
    .then(function() {
      test.assertVisible('#nature', "button click changes the content of the main container");
    })

    /* KEYBOARD SHORTCUTS */
    .then(function() {
      this.sendKeys('body', '6');
    })
    .then(function() {
      test.assertVisible('#symbols', "keyboard shortcut changes the content of the main container");
      test.assertNotVisible('#nature', "... and hides the other container div");
    })

    /* SEARCH */
    .then(function() {
      this.sendKeys('body', 'sun');
    })
    .then(function() {
      test.assertVisible('#search-container', "entering text triggers the search");
      // wait for throttling
      this.wait(500, function () {
        test.assertElementCount('#search-container > .emoji', 9, "the query 'sun' finds 9 elements");
      });
    })

    /* ABOUT */
    .then(function() {
      this.click('#about-button');
    })
    .then(function() {
      test.assertVisible('#about-container', "clicking the about button triggers the about screen");
    })

    /* RECENT */
    .then(function() {
      // first go to other category
      this.click('button[data-group="nature"]');
    })
    .then(function() {
      // select an item
      this.click('[data-name="fish"]');
    })
    .then(function() {
      // go to recents
      this.click('button[data-group="recent"]');
    })
    .then(function() {
      test.assertVisible('#recent [data-name="fish"]', "after clicking on an item, it appears in the recents");
      test.assertEvalEquals(function() {
          return __utils__.findOne('#recent .emoji:first-of-type').dataset.name;
      }, 'fish', "...at first position");
    })

    /* SELECTION */
    .then(function() {
      // select an item
      this.click('[data-name="frog"]');
    })
    .then(function() {
      test.assertEvalEquals(function() {
          return __utils__.findOne('#detail-input').value;
      }, ':frog:', "after clicking an item its :code: is shown in the detail bar");
      test.assertEvalEquals(function() {
          return __utils__.findOne('#unicode-input').value;
      }, '🐸', "after clicking an item its unicode is shown in the detail bar");
    })

    /* NON-UNICODE EMOJI */
    .then(function() {
      // select an item
      this.click('[data-name="bowtie"]');
    })
    .then(function() {
      test.assertEvalEquals(function() {
          return __utils__.findOne('#detail-input').value;
      }, ':bowtie:', "after clicking a non-unicode item its :code: is shown in the detail bar");
      test.assertEvalEquals(function() {
          return __utils__.findOne('#unicode-input').value;
      }, '', "after clicking a non-unicode item nothing is shown in the detail bar");
    })

  casper.run(function() {
    test.done();
  });
});
