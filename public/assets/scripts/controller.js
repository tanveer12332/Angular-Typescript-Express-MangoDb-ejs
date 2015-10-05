var meanApp = angular.module('meanApp', ['ui.bootstrap']);

meanApp.controller('AppCtrl', function($scope, $rootScope, $http, $modal, $log, myService){
 
 $scope.totalItems = 2;
 $scope.currentPage = 1;

  $scope.setPage = function (pageNo) {
  $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    $log.log('Page changed to: ' + $scope.currentPage);
  };
	
	$rootScope.contactList=[];
	myService.refresh($http).then(function(data){
    $rootScope.contactList = data.data;
    $scope.contact = "";
  });
  

  $scope.showModel = function () {
   var  modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
        templateUrl: 'myModal',
      controller: 'ModalInstanceCtrl'
     });
  };

 $scope.remove = function(id){

	 $http.delete('/delcontacts/' + id).success(function(responce){
		myService.refresh($http).then(function(data){
      $rootScope.contactList = data.data;
      $scope.contact= "";
    });
	 })
 }
 
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
  // $timeout(function() {
     
  //     console.log('Refresh function execute');
  //  }, 2000)
	// refresh();
 };
 
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

     
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