angular.module('app.controllers', [])

.run(function($rootScope, $log, dataService) {


	$rootScope.entryNum;
	$rootScope.rootLoc = [];

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

	firebase.database().ref('locations/').on("value", function(snapshot) {
  		// $log.info(snapshot.val());
  		$rootScope.rootLoc=snapshot.val();
  		$rootScope.entryNum = snapshot.val().length;
		if($scope.entryNum==undefined||$scope.entryNum==null){
			$rootScope.entryNum = 0;
		}
	
	}, function (errorObject) {
  		$log.info("The read failed: " + errorObject.code);
	});
    
})




///////////////////
//   LIST VIEW   //
//   CONTROLLER  //
/////////////////// 
.controller('listPageCtrl', function($scope, $log, $rootScope, dataService) {
	$scope.locations = [];

	$scope.testBut = function(){
		$log.info("Test Button");
	}


	$scope.sendData = function(data){
		dataService.details = data; 
	}


  	$scope.doRefresh = function(){
  		$log.info("Doing refresh");
  		document.getElementById('filterBox').value = "";
  		$rootScope.$broadcast('refreshMap');
  		$scope.$broadcast('scroll.refreshComplete');
  	}

  	$scope.filterVar;
  	$scope.filterList = function(){
  		$scope.filterVar = document.getElementById('filterBox').value.toUpperCase();
  		$log.info(input);
  	}

  	$scope.showFilter = function(name){
  		if($scope.filterVar==null||$scope.filterVar==undefined){
  			return true;
  		}
  		if(name.toUpperCase().includes($scope.filterVar)){
  			return true;
  		}else{
  			return false;
  		}
  	}



  	

})
   

///////////////////
//   MAP VIEW   //
//   CONTROLLER  //
///////////////////
.controller('mapPageCtrl', function($scope, $log, $rootScope, dataService) {


	// GOOGLE MAPS API

 	$scope.map;

 	$scope.initMap = function(){


 		var styledMapType = new google.maps.StyledMapType([{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"water","stylers":[{"color":"#84afa3"},{"lightness":52}]},{"stylers":[{"saturation":-17},{"gamma":0.36}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#3f518c"}]}],{name: 'Retro'});

	    $scope.map = new google.maps.Map(document.getElementById("map"), {
			center: {lat: 35.913129, lng: -79.055817},      	
			zoom: 15,
			mapTypeControlOptions: {mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain','styled_map']}
	      	
	    });

	    $scope.map.mapTypes.set('styled_map', styledMapType);
	    $scope.map.setMapTypeId('styled_map');


	    $scope.map.addListener('click', function(e) {
	    	var locName = prompt("Please enter location name for "+e.latLng, e.latLng);	
	  		if(locName != null){
	  			$scope.placeMarkerAndPanTo(e.latLng, $scope.map, locName);
	  			$scope.addLocation(e.latLng, locName);
	  		}
	 	});

	 	var locInfoWindow = new google.maps.InfoWindow({map: $scope.map});
		if (navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition(function(position) {

		     	var pos = {
		        	lat: position.coords.latitude,
		        	lng: position.coords.longitude
		      	};

		      	$log.info("position: "+pos);

		      	var marker = new google.maps.Marker({
			    	position: pos,
			    	map: $scope.map,
			    	title: 'Your Position',
			    	zIndex: 9999999999,
			    	icon: 'img/person.svg'
				});

				locInfoWindow.setPosition(pos);
				locInfoWindow.setContent('Location found.');
				$scope.map.setCenter(pos);

				// draw a radius at this location, editable
				var myRadius = new google.maps.Circle({
					strokeColor: '#283A21',
					strokeOpacity: 0.7,
					strokeWeight: 2,
					fillColor: '#4A9130',
					fillOpacity: 0.15,
					map: $scope.map,
					center: pos,
					radius: parseInt($scope.radiusVal.radius)
				});

				google.maps.Circle.prototype.contains = function(latLng) {
  					return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
				}

				// drop points w/i radius
    			$scope.populateMap(myRadius);

		    }, function() {
		    	$log.info("Error with getCurrentPosition");
		      	handleLocationError(true, locInfoWindow, $scope.map.getCenter());
		    });
		} else {
		  	$log.info("Error with navigator.geolocation");
		    handleLocationError(false, locInfoWindow, $scope.map.getCenter());
	}

		  // Geolocation failure
			function handleLocationError(browserHasGeolocation, locInfoWindow, pos) {
				$scope.populateMap();
		  		locInfoWindow.setPosition(pos);
		  		locInfoWindow.setContent(browserHasGeolocation ?
		                        'Error: The Geolocation service failed.' :
		                        'Error: Your browser doesn\'t support geolocation.');
			} 


		$scope.placeMarkerAndPanTo = function(latLng, map, locName) {

				var marker = new google.maps.Marker({
				    position: latLng,
				    map: $scope.map,
				    title: locName
		  		});
		  		marker.addListener('click', function(event) {
		  			$scope.geocoder.geocode({
						'latLng': event.latLng
					}, function(results, status) {
					    if (status == google.maps.GeocoderStatus.OK) {
					      if (results[0]) {
					      	var html = locName + "<br>" + results[0].formatted_address + "<br>" + latLng;

							var infowindow = new google.maps.InfoWindow({
						    	content: html
						    });
						    infowindow.open($scope.map,marker);
					      	$log.info(results[0]);
					      }
					    }
					});
		        });

		}


	  	$scope.entryNum;
	  	$scope.geocoder = new google.maps.Geocoder();

		$scope.populateMap = function(circle){
			setTimeout(function(){
				if(circle){
					var en = $rootScope.entryNum;
					for(var i=0; i<en; i++){
						var myLatlng = new google.maps.LatLng(parseFloat($rootScope.rootLoc[i].latitude),parseFloat($rootScope.rootLoc[i].longitude));
						$log.info("Is in ");
						var isIn = circle.contains(myLatlng);
						$log.info("Is in "+isIn);
						if(isIn){
							$log.info(myLatlng + " in");
							$scope.placeMarkerAndPanTo(myLatlng, $scope.map, $rootScope.rootLoc[i].name);
						}
						$log.info(myLatlng + " out");
					}	
					
				}else{
					var en = $rootScope.entryNum;
					for(var i=0; i<en; i++){
						var myLatlng = new google.maps.LatLng(parseFloat($rootScope.rootLoc[i].latitude),parseFloat($rootScope.rootLoc[i].longitude));
						$scope.placeMarkerAndPanTo(myLatlng, $scope.map, $rootScope.rootLoc[i].name);
					}	
				}
			}, 1000);
		}
		// $scope.populateMap();


		// add location to DB
		$scope.addLocation = function(latLng, locName){
			latLng = latLng.toString();
			latLng = latLng.replace('(','');
			latLng = latLng.replace(')','');
			latLng = latLng.replace(' ','');
			latLng = latLng.split(',');

			if($scope.entryNum==undefined||$scope.entryNum==null){
				$scope.entryNum = 0;
			}

			firebase.database().ref('locations/' + $scope.entryNum).set({
			    name: locName,
			    latitude: latLng[0],
			    longitude: latLng[1]
			}); 
		}


		// remove location from DB
		$scope.removePoint = function(value){
			$log.info("removing");
			firebase.database().ref('locations/'+value).remove();
		}
	}
	$scope.initMap();

	$rootScope.$on("refreshMap", function(){
		$log.info("About to refresh map");
        $scope.initMap();
    });

	$scope.radiusVal = {};
	$scope.radiusVal.radius = 1000;    
})
   

      



////////////////////
//  DETAILS VIEW  //
//   CONTROLLER   //
////////////////////
.controller('detailsPageCtrl', function($scope, $log, $rootScope, dataService) {
	$scope.data = dataService.details;
	$scope.position = {lat: parseFloat($scope.data.latitude), lng: parseFloat($scope.data.longitude)};

	var mapOptions = {
		center: $scope.position,      	
		zoom: 15,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var panoOptions = {
	    position: $scope.position,
	    pov: {
	        heading: 34,
	        pitch: 10
	    }
    };

    $scope.map;
    $scope.panorama;
    $scope.detMaps = function(){
		$log.info("getting maps");
		$scope.map = map = new google.maps.Map(document.getElementById('detMap'), mapOptions);
		$scope.panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoOptions);
		$scope.map.setStreetView($scope.panorama);
    }
    $scope.detMaps();

    $scope.placeInfo;


  	$scope.geocoder = new google.maps.Geocoder();
    $scope.geocoder.geocode({
		'latLng': $scope.position
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[0]) {
				$scope.placeInfo = results[0];
			}
		}
	});

	$scope.getDirections = function(){
		var url = "https://www.google.com/maps/place/"+$scope.data.latitude+","+$scope.data.longitude+"/@"+$scope.data.latitude+","+$scope.data.longitude;
		window.open(url);
	}
})
 