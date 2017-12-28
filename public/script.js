angular.module('myApp', ['app.routes'])

  .controller('imagesCtrl', ($scope, $http) => {

    $http.get('/images').then(function(resp) {

      $scope.images = resp.data;
      $scope.title = "";
      $scope.username = "";
      $scope.file = {}
      $scope.limit = 10;
      $scope.loadMore = function() {
        $scope.limit = $scope.limit + 5;
      }
    })
  })

  .controller('uploadCtrl', ($scope, $http, $state) => {

    $scope.submit = function() {


      //GET THE FILE THE USER HAS SPECIFIED IN THE FORM=======================
      var file = $('input[type="file"]').get(0).files[0];
      var title = $scope.title;
      var username = $scope.username;
      var description = $scope.description;
      $scope.required = true;

      // IMAGE UPLOAD VIA AJAX================================================
      var formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('username', username);
      formData.append('description', description);
      $http({
        url: '/upload',
        method: 'POST',
        data: formData,
        headers: {
          'content-Type': undefined
        },
        transformRequest: angular.identity

      }).then(() => {
        console.log("it worked")
        $state.reload();

      })
    }
  })

  .controller('submitCommentCtrl', ($scope, $http, $stateParams, $state) => {

    $scope.submit = function() {

      var data = {
        comment: $scope.comment,
        author: $scope.author,
        imageId: $stateParams.imageId
      };
      $scope.required = true;
      console.log("var data", data);

      $http({
        url: '/singleImage',
        method: 'POST',
        data: data

      }).then(() => {
        console.log("commented")
        $state.reload();
      })
    }
  })
