angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('tabsController.listPage', {
    url: '/list',
    views: {
      'tab1': {
        templateUrl: 'templates/listPage.html',
        controller: 'listPageCtrl'
      }
    }
  })

  .state('tabsController.mapPage', {
    url: '/map',
    views: {
      'tab2': {
        templateUrl: 'templates/mapPage.html',
        controller: 'mapPageCtrl'
      }
    }
  })

  .state('tabsController.settingsPage', {
    url: '/settings',
    views: {
      'tab3': {
        templateUrl: 'templates/settingsPage.html',
        controller: 'settingsPageCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true,
  })

  .state('tabsController.detailsPage', {
    url: '/details',
    views: {
      'tab1': {
        templateUrl: 'templates/detailsPage.html',
        controller: 'detailsPageCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/page1/list')

  

});