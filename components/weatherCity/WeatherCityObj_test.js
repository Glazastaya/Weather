'use strict';

describe('myApp.WeatherCityObj', function() {
    var WeatherCity, $httpBackend, city;
    beforeEach(module('myApp.WeatherCityObj'));
    beforeEach(module('myApp.googleApisServ'));

    beforeEach(inject(function(_WeatherCity_, $injector) {
        WeatherCity = _WeatherCity_;
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
    }));

    beforeEach(function(){
        city = new WeatherCity('Kyiv');
    });


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should record the weather property an object', function() {
        $httpBackend.expectJSONP('https://api.forecast.io/forecast/c3e78f911c0a1025b8801aadb7f36857/50.4501,30.5234/?callback=JSON_CALLBACK')
            .respond('weather');

        city.init({ lat:50.4501, lng:30.5234}).then(function () {
            expect(city.weather).toEqual("weather");
        });
        $httpBackend.flush();
    });

    it('should update the properties of an object', function() {
        $httpBackend.expectJSONP('https://api.forecast.io/forecast/c3e78f911c0a1025b8801aadb7f36857/50.4501,30.5234/?callback=JSON_CALLBACK')
            .respond('weather');

        city.init({ lat:50.4501, lng:30.5234}).then(function () {
            $httpBackend.expectJSONP('https://api.forecast.io/forecast/c3e78f911c0a1025b8801aadb7f36857/50.4501,30.5234/?callback=JSON_CALLBACK')
                .respond('new weather');
            city.update().then(function () {
                expect(city.weather).toEqual('new weather');

            })
        });
        $httpBackend.flush();
    });



});
