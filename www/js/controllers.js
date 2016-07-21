angular.module('app.controllers', [])

///////////////////
//   LIST VIEW   //
//   CONTROLLER  //
///////////////////
  
.controller('listPageCtrl', function($scope, $log) {

	$scope.locations = [];

  	$scope.entry = {
	    name: 'name',
	    latitude: 'latitude',
	    longitude: 'longitude',
	    yayNay: 'nay'
  	};

  	$scope.addInfo = function(){
  		// $log.info("Add button clicked");
  		var newLoc = [{
  			latitude: $scope.entry.latitude, 
  			longitude: $scope.entry.longitude
  		}];
  		var oldArr = $scope.locations;
  		var newArr = oldArr.concat(newLoc);
  		$scope.locations = newArr;
  	}

	//Initialize Firebase
  	var config = {
	    apiKey: "AIzaSyCInzKfSb_EGLa3PPtSav91zVKB9ePgnII",
	    authDomain: "project-6627332274916979698.firebaseapp.com",
	    databaseURL: "https://project-6627332274916979698.firebaseio.com",
	    storageBucket: "",
  	};
  	firebase.initializeApp(config);
  	// Get a reference to the database service
  	var database = firebase.database();

	$scope.entryNum = $scope.locations.length;

  	$scope.writeData = function(){

	    firebase.database().ref('locations/' + $scope.entryNum).set({
	      name: $scope.entry.name,
	      latitude: $scope.entry.latitude,
	      longitude: $scope.entry.longitude,
	      yayNay: $scope.entry.yayNay
	    }); 
	    $scope.entryNum++;
  	} 	

  	$scope.doRefresh = function(){
		firebase.database().ref('locations/').once("value", function(snapshot) {
  			$log.info(snapshot.val());
  			$scope.locations=snapshot.val();
  			$scope.$broadcast('scroll.refreshComplete');
		}, function (errorObject) {
  			$log.info("The read failed: " + errorObject.code);
  			$scope.$broadcast('scroll.refreshComplete');
		});
  	}

 //  	var db = firebase.database();
	// var ref = db.ref("https://project-6627332274916979698.firebaseio.com/");

	firebase.database().ref('locations/').on("value", function(snapshot) {
  		$log.info(snapshot.val());
  		$scope.locations=snapshot.val();
	}, function (errorObject) {
  		$log.info("The read failed: " + errorObject.code);
	});



  	

})
   

///////////////////
//   MAP VIEW   //
//   CONTROLLER  //
///////////////////
.controller('mapPageCtrl', function($scope, $log) {

	// GOOGLE MAPS API
	var mapOptions = {
		center: {lat: 35.913129, lng: -79.055817},      	
		zoom: 15,
      	mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    $scope.map.addListener('click', function(e) {
    	$log.info("Clicked at: "+e.latLng)
    	$scope.placeMarkerAndPanTo(e.latLng, map);
    	$scope.addLocation(e.latLng);
 	});

	$scope.placeMarkerAndPanTo = function(latLng, map) {
		var marker = new google.maps.Marker({
		    position: latLng,
		    map: $scope.map
	  	});
	  	$scope.map.panTo(latLng);
	}


	// FIREBASE
	var config = {
	    apiKey: "AIzaSyCInzKfSb_EGLa3PPtSav91zVKB9ePgnII",
	    authDomain: "project-6627332274916979698.firebaseapp.com",
	    databaseURL: "https://project-6627332274916979698.firebaseio.com",
	    storageBucket: "",
  	};
  	firebase.initializeApp(config);

  	$scope.entryNum = 0;

	$scope.addLocation = function(latLng){


		
		firebase.database().ref('locations/' + $scope.entryNum).set({
		    name: "sample",
		    latLng: latLng.toString(),
		    // longitude: $scope.entry.longitude,
		    yayNay: "nay"
		}); 
		$scope.entryNum++;
	}
  	



})
   
.controller('settingsPageCtrl', function($scope) {

})
      
.controller('detailsPageCtrl', function($scope) {

})
 