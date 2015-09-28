/*meanApp.factory('myService', function($http) {
   return {
     getFoo: function() {
       //since $http.get returns a promise,
       //and promise.then() also returns a promise
       //that resolves to whatever value is returned in it's 
       //callback argument, we can return that.
       return $http.get('/getcontacts').then(function(result) {
                return result.data;
       });
     }
   }
   function myfun(myService,$scope){
           myService.getFoo().then(function(data) {
           //this will execute when the 
              //AJAX call completes.
           $scope.contactList= data;
	          $scope.contact = "";
     
   })
   }
   myfun();
})
*/
angular.module('meanApp').directive('ngReallyClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}]);

/*meanApp.run(function($rootScope) {
   // $rootScope.fun();
    $rootScope.refresh= function($scope, $http){
      	$http.get('/getcontacts').success(function(responce){
		console.log('i get the data i requested');
		$scope.contactList = responce;	
		$scope.contact = "";
	});
    }
    
})*/