/* globals MashupPlatform, MockMP, beforeAll, beforeEach*/
(function () {
    "use strict";


    describe("Test DataTableViewer", function () {
        beforeAll(function () {
            window.MashupPlatform = new MockMP.MockMP();
        });

        beforeEach(function () {
            MashupPlatform.reset();
        });

        it("Dummy test", function () {
            expect(true).toBeTruthy();
        });

    });
})();
