var deweyController = angular.module('deweyControllers', ['ngMaterial']);

deweyController.controller('topicController', function ($scope,$rootScope,$mdDialog,$location,$window,$http,topicService) {

    var getTopicList = function() {
        topicService.list().then(function(jobs){
            $scope.topics = jobs.data;
        });
    };

    topicService.registerObserverCallback(getTopicList);
    getTopicList();

    $rootScope.token = $location.search().code
    if($rootScope.token != undefined) {
        $http.get('/token/'+$rootScope.token)
        .success(function (data) {
            $rootScope.userId = data.id
            $rootScope.userName = data.name
            $rootScope.userImage = data.image
        }).error(function (data) {
            console.log('error')
        })
    }

    $scope.login = function(){
        $window.location.href = '/login'
    }

    $scope.openDialog = function(ev){
        $mdDialog.show({
            templateUrl: 'template/dialog.html'
        })
    }

    $scope.addNewTopic = function() {
        $mdDialog.hide()
        var name = $scope.topic.name
        var description = $scope.topic.description
        var startDate = new Date($scope.topic.year,$scope.topic.month,$scope.topic.day,17,30,0,0)
        var endDate = new Date($scope.topic.year,$scope.topic.month,$scope.topic.day,18,00,0,0)
        topicService.create({name: name,description: description,user: {id: $rootScope.userId,name: $rootScope.userName,image: $rootScope.userImage}, startDate: startDate,endDate: endDate})
            .then(function(){
                $scope.topics = topicService.list()
            }
        )
    }

    $scope.deleteTopic = function(ev,topic){

        var confirm = $mdDialog.confirm()
            .title('Do you want to delete this topic ?')
            .targetEvent(ev)
            .ok('OK')
            .cancel('Cancel')

        $mdDialog.show(confirm).then(function() {
            topicService.delete(topic).then(function(){
                $scope.topics = topicService.list()
            })
        }, function() {
            console.log("cancel")
        });
    }

})
