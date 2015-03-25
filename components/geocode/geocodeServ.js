angular.module('myApp.googleApisServ', [])
    .factory('googleApis', ['$http', '$q', function ($http, $q) {
        return {
            geocode: function (params){
                var url;

                if (typeof params == "string"){
                    url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + params + '&sensor=true_or_false';

                    return $http.get(url).then(function (response){
                        return response.data.results[0].geometry.location
                    })
                } else {
                    url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + params.coords.latitude + ',' + params.coords.longitude + '&sensor=true_or_false';

                    return $http.get(url).then(function (response){
                        return response.data.results[0].address_components[3].long_name
                    })
                }
            }
        }
    }]);
