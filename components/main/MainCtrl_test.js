'use strict';

xdescribe('myApp.main module', function() {

    beforeEach(module('myApp.main'));
    beforeEach(module('myApp.WeatherCityObj'));
    beforeEach(module('myApp.googleApisServ'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('MainCtrl controller', function(){

        it('should ....', (function() {
            //spec body
            var $scope = {};
            var MainCtrl = $controller('MainCtrl', { $scope: $scope });
            expect(MainCtrl).toBeDefined();
        }));

    });
});
