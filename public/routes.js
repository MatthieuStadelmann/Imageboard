// app/routes.js
angular.module('app.routes', ['ui.router'])

  .config(
    function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/')
      $stateProvider
        .state('home', {
          url: '/',
          views: {
            'home': {
              templateUrl: '/templates/home.html',

            }
          }
        })

        .state('singleImage', {
          url: '/image/:imageId',
          views: {
            'home': {
              templateUrl: '/templates/assets/singleImage.html',
              controller: function($scope, $http, $stateParams) {
                $http.get('/image/' + $stateParams.imageId).then((res) => {
                  $scope.image = res.data[0]
                  if (res.data[1] === null) {
                    $scope.comment = "";
                  } else {
                    var commentObj = res.data[1];
                    console.log(commentObj)
                    $scope.comments = commentObj;
                    $scope.limit = 3;
                    $scope.loadMore = function() {
                      $scope.limit = $scope.limit + 3;
                    }
                  }

                })
              }
            },
          }
        })

        .state('about', {
          url: '/about',
          views: {
            'home': {
              templateUrl: '/templates/assets/about.html'
            },

          }
        })

        .state('upload', {
          url: '/upload',
          views: {
            'home': {
              templateUrl: '/templates/assets/upload.html'
            }
          }
        })
    }
  );
