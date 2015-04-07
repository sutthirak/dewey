var deweyServices = angular.module('deweyServices', ['ngResource']);

deweyServices.service('topicService', function($http) {

    var observerCallbacks = [];
    this.registerObserverCallback = function(callback){
        observerCallbacks.push(callback);
    };

    var notifyObservers = function(){
        angular.forEach(observerCallbacks, function(callback){
            callback();
        });
    };

    this.list = function() {
        return $http.get('topics')
            success(function(data) {
                return data;
            });
    };

    this.create = function(topic) {
        return $http.post('topics', topic).success(function() {
            notifyObservers();
        });
    };

    this.delete = function(topic){
        return $http.delete('topics/'+topic).success(function(){
            notifyObservers();
        })
    }

});