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

casper.test.begin('Navigation', 5, function suite(test) {
  casper
    .start("http://localhost:8000", function() {
      test.assertExists('.group-logos', "main container is found");
      test.assertElementCount('.group-logos > button', 6, "there are 6 logo buttons");
    })
    .then(function() {
      this.click('button[data-group="nature"]');
    })
    .then(function() {
      test.assertVisible('#nature', "button click changes the content of the main container");
    })
    .then(function() {
      this.sendKeys('body', '6');
    })
    .then(function() {
      test.assertVisible('#symbols', "keyboard shortcut changes the content of the main container");
      test.assertNotVisible('#nature', "... and hides the other container div");
    })

  casper.run(function() {
    test.done();
  });
});
