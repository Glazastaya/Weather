'use strict';

angular.module('myApp.degreesFilter', [])
    .filter('degrees', function () {
        return function (input, scale) {
            if(scale == 'F'){
                return parseInt(input).toFixed(0);
            } else {
                return ((input - 32) / 1.8).toFixed(0);
            }
        }
    });
