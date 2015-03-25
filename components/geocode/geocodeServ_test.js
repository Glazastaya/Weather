'use strict';

describe('myApp.googleApisServ', function() {
    var googleApis, $httpBackend;
    beforeEach(module('myApp.googleApisServ'));

    beforeEach(inject(function(_googleApis_, $injector) {
        googleApis = _googleApis_;
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');


    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should return coordinates of city', function() {
        $httpBackend.expectGET('https://maps.googleapis.com/maps/api/geocode/json?address=Kiev&sensor=true_or_false')
            .respond({results: [{geometry: {location: { lat:50.4501, lng:30.5234}}}]});
        
        googleApis.geocode('Kiev').then(function (response) {
            expect(response).toEqual({ lat:50.4501, lng:30.5234});
        });
        $httpBackend.flush();
    });

    it('should return name of city', function() {
        $httpBackend.expectGET('https://maps.googleapis.com/maps/api/geocode/json?latlng=50.022709299999995,36.2270311&sensor=true_or_false')
            .respond({results: [{address_components: [{}, {}, {}, {long_name: 'Kharkiv'}] }]});

        googleApis.geocode({coords: {latitude: 50.022709299999995, longitude: 36.2270311}}).then(function (response) {
            expect(response).toEqual('Kharkiv');
        });
        $httpBackend.flush();
    });

});
