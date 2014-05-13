var app = angular.module('poison', [
    "ngRoute",
    "ngTouch",
    "mobile-angular-ui"
]);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('view/',          {templateUrl: "home.html"});
    $routeProvider.when('view/scroll',    {templateUrl: "scroll.html"});
    $routeProvider.when('view/toggle',    {templateUrl: "toggle.html"});
    $routeProvider.when('view/tabs',      {templateUrl: "tabs.html"});
    $routeProvider.when('view/accordion', {templateUrl: "accordion.html"});
    $routeProvider.when('view/overlay',   {templateUrl: "overlay.html"});
    $routeProvider.when('view/forms',     {templateUrl: "forms.html"});
    $routeProvider.when('view/carousel',  {templateUrl: "carousel.html"});
});

app.service('analytics', [
    '$rootScope', '$window', '$location', function($rootScope, $window, $location) {
        var send = function(evt, data) {
            ga('send', evt, data);
        }
    }
]);



app.controller('MainController', function($rootScope, $scope, analytics){

    $rootScope.$on("$routeChangeStart", function(){
        $rootScope.loading = true;
    });

    $rootScope.$on("$routeChangeSuccess", function(){
        $rootScope.loading = false;
    });

    var scrollItems = [];

    for (var i=1; i<=100; i++) {
        scrollItems.push("Item " + i);
    }

    $scope.scrollItems = scrollItems;
    $scope.invoice = {payed: true};

    $scope.userAgent =  navigator.userAgent;
    $scope.chatUsers = [
        { name: "Carlos  Flowers", online: true },
        { name: "Byron Taylor", online: true },
        { name: "Jana  Terry", online: true },
        { name: "Darryl  Stone", online: true },
        { name: "Fannie  Carlson", online: true },
        { name: "Holly Nguyen", online: true },
        { name: "Bill  Chavez", online: true },
        { name: "Veronica  Maxwell", online: true },
        { name: "Jessica Webster", online: true },
        { name: "Jackie  Barton", online: true },
        { name: "Crystal Drake", online: false },
        { name: "Milton  Dean", online: false },
        { name: "Joann Johnston", online: false },
        { name: "Cora  Vaughn", online: false },
        { name: "Nina  Briggs", online: false },
        { name: "Casey Turner", online: false },
        { name: "Jimmie  Wilson", online: false },
        { name: "Nathaniel Steele", online: false },
        { name: "Aubrey  Cole", online: false },
        { name: "Donnie  Summers", online: false },
        { name: "Kate  Myers", online: false },
        { name: "Priscilla Hawkins", online: false },
        { name: "Joe Barker", online: false },
        { name: "Lee Norman", online: false },
        { name: "Ebony Rice", online: false }
    ]

});

PouchDB.destroy('http://poison.duapp.com/db/test', function(err, info) {
    console.log(err);
});