var meanApp = angular.module('meanApp', ['ui.bootstrap']);

meanApp.controller('AppCtrl', function($scope, $rootScope, $http, $modal, $log, myService){
 //start paging
 $scope.totalItems = 2;
 $scope.currentPage = 1;

  $scope.setPage = function (pageNo) {
  $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    $log.log('Page changed to: ' + $scope.currentPage);
  };
	//end paging
  //start get request
	$rootScope.contactList=[];
	myService.refresh($http).then(function(data){
    $rootScope.contactList = data.data;
    $scope.contact = "";
  });
  //end
 //open model popup
  $scope.showModel = function () {
   var  modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
        templateUrl: 'myModal',
      controller: 'ModalInstanceCtrl'
     });
  };
 //end model
 //start remove user function
 $scope.remove = function(id){
	 $http.delete('/delcontacts/' + id).success(function(responce){
  		myService.refresh($http).then(function(data){
      $rootScope.contactList = data.data;
      $scope.contact= "";
    });
	 })
 }
 //end 
 //start edit function
  $scope.edit = function(id) {
    // console.log(id);
	  $modal.open({
       templateUrl: 'myModal',
       controller: 'editModalInstanceCtrl',
       resolve: {
                items: function () {
              return $scope.items;
            },id: function() {
                return id;
            }
          }
	    });
  }
  //end edit function

//end controller
})
//start search controller
 meanApp.controller('searchCtrl', function($scope,$http, $rootScope){
      $scope.userinput= "";
      $scope.SearchFun = function(){
      $http.get('/searchcontact/' + $scope.userinput).success(function(responce){
        console.log(responce);
        $rootScope.contactList = responce;
        $scope.userinput= "";
      });
      }
//end search controller 
})

meanApp.controller('ModalInstanceCtrl', function ($scope, $rootScope, $http, $modal, $modalInstance, myService, $timeout) {
  
  $scope.addContact = function(){
	    // console.log($scope.contact);
	    $http.post('/setcontacts', $scope.contact).success(function(responce){
	    $modalInstance.close();
      myService.refresh($http).then(function(data){
      $rootScope.contactList = data.data;
      $scope.contact = "";
    });
	 })
  };
 
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

//end modal controller    
});

meanApp.controller('editModalInstanceCtrl', function ($scope, $rootScope, $http, $modal, $modalInstance, items, id, myService) {
    $scope.IsVisible = true;
    $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
    $scope.id=id;
    $scope.items = $http.get('/editcontacts/'+ id).success(function(responce){
  
	  $scope.contact = responce;
  });
 
    $scope.update = function(){
     console.log($scope.contact._id);
     $http.put('/updatecontact/' + $scope.contact._id, $scope.contact).success(function(responce){
     $modalInstance.dismiss('cancel');
     myService.refresh($http).then(function(data){
        $rootScope.contactList = data.data;
        $scope.contact = "";
     });
     
     })
    }
//end controll  
});
meanApp.controller('loginCtrl', function ($scope, $http,$window) {
  $scope.usernamemsg = "";
  $scope.userpasmsg = "";
  $scope.data= ['user@gmail.com','123'];
  
  //user email  focus function 
  $scope.userfocus = function(){
    $scope.data.username = "";
    $scope.usernamemsg = "";
  };
  //user password  focus function 
  $scope.userpassfocus = function(){
   $scope.data.password = "";
   $scope.userpasmsg = "";
  };
  
  $scope.login = function () {
    if($scope.data.username ==  $scope.data[0]){
    
      if($scope.data.password == $scope.data[1]){
        console.log('user is login');   
        $http.get('/dashbord').success(function(responce){
        $window.location.href = '/dashbord';
        });   
         }else{
        console.log('rong password');
        $scope.userpasmsg = "Rong password";
         }
       } 
       else{
        console.log('user name and password is rong');
        $scope.usernamemsg = "User name is not valid";
      }
  }

});