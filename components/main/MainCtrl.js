'use strict';

angular.module('myApp.main', [])
    .controller('MainCtrl', ['$scope', '$http', '$interval', 'WeatherCity', 'googleApis', 'localstorage', '$q', function (self, $http, $interval, Weather, googleApis, localstorage, $q) {
        self.timeUpdate = '';
        self.cities = [];
        self.newItem = {
            name: ''
        };
        self.settings = {
            days: 7,
            gap: 15,
            degrees: 'F'
        };
        self.intrvlUpdate = '';

        //if in localstorage saved cities, get them and save in self.cities
       if (localstorage.getObject('cities')) {
            var localCities = angular.copy(localstorage.getObject('cities')),
                localItem,
                promises = [];

                for (var prop in localCities){
                    localItem = new Weather(prop);
                    localItem.init(localCities[prop]);
                    localItem.chosen = false;
                    promises.push(localItem);
                }

                $q.all([promises])
                    .then(function () {
                        self.cities = promises;
                    });

        };

        //get the current location of the user and create object with weather
        navigator.geolocation.getCurrentPosition(function (position) {
            var coords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            googleApis.geocode(position).then(function (data) {
                self.current = new Weather(data);
                self.current.init(coords).then(function(){
                    self.timeUpdate = new Date;
                    (self.current.weather.daily.data).splice(self.settings.days);
                    self.intrvlUpdate = $interval(self.update, self.settings.gap * 60000);
                });
            })
        });

        //update the data with the weather for all cities
        self.update = function(){
            var promises = [];
            angular.forEach(self.cities, function(city){
                promises.push(city.update());
            });

            $q.all([promises, self.current.update()])
                .then(function () {
                    self.timeUpdate = new Date;
                    (self.current.weather.daily.data).splice(self.settings.days);
                });

        };

        //add new city, create appropriate object and record in localstorage
        self.addNew = function () {
            var cities = [];

            if (self.newItem.name) {
                googleApis.geocode(self.newItem.name).then(function (data) {

                    self.newItem = new Weather(self.newItem.name);
                    self.newItem.init(data).then(function () {

                        cities = localstorage.getObject('cities');
                        cities[self.newItem.name] = data;
                        localstorage.setObject('cities', cities);

                        self.newItem.chosen = false;
                        self.cities.push(self.newItem);
                        self.newItem = {};
                    })
                });
            }

        };

        //delete the selected city from list cities and from localstorage
        self.deleteItems = function(){
            var storage = localstorage.getObject('cities'),
                newItems = [];

            angular.forEach(self.cities, function (city) {
                if (!city.chosen) {
                    newItems.push(city);
                } else {
                    delete storage[city.name];
                }
            });

            self.cities = newItems;
            localstorage.setObject('cities', storage);
        };

        //if period of update is changed, set up new $interval
        self.$watch('settings.gap', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $interval.cancel(self.intrvUpdate);
                self.intrvUpdate = $interval(self.update, newValue * 60000);
            }

        });

        //if number of days to display is changed, then update current city and display the desired number of days
        self.$watch('settings.days', function (newValue, oldValue) {
            if (newValue !== oldValue && self.current.weather.daily.data) {
                self.current.update().then(function(){
                    (self.current.weather.daily.data).splice(self.settings.days);
                })
            }
        });




    }
    ]);
