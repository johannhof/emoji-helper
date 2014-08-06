casper.test.begin('Navigation', 2, function suite(test) {
    casper.start("http://localhost:8000", function() {
        test.assertExists('.group-logos', "main container is found");
        test.assertElementCount('.group-logos > button', 6, "there are 6 logo buttons");
    });

    casper.run(function() {
        test.done();
    });
});
