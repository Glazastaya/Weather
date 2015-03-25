'use strict';

angular.module('myApp.WeatherCityObj', [])
    .factory('WeatherCity', ['$http', function ($http) {
        var Weather = function (city) {
            this.API_KEY = 'c3e78f911c0a1025b8801aadb7f36857';
            this.name = city;
        };

        Weather.prototype.init = function (coords) {
            var self = this;

            self.coords = coords;
            self.url = 'https://api.forecast.io/forecast/' + self.API_KEY + '/' + self.coords.lat + ',' + self.coords.lng + '/?callback=JSON_CALLBACK';

            return $http.jsonp(self.url).then(function (response) {
                self.weather = response.data;
                return self;

            });
        };

        Weather.prototype.update = function () {
            var self = this;

            return $http.jsonp(self.url).then(function (response) {
                self.weather = response.data;
                return self;
            })

        };

        return Weather;
    }]);