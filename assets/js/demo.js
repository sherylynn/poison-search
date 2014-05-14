Array.prototype.indexOf = function (vItem) {
    for (var i=0; i<this.length; i++) {
        if (vItem == this[i]) {
            return i;
        }
    }
    return -1;
};

//

var app = angular.module('MobileAngularUiExamples', [
  "ngRoute",
  "ngTouch",
  "ngResource",
  "mobile-angular-ui",
  "ngSanitize",
  "wiz.markdown",
  "btford.markdown"
]);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/',          {templateUrl: "assets/view/home.html"});
  $routeProvider.when('/bbc',    {templateUrl: "assets/view/bbc.html"});
  $routeProvider.when('/toggle',    {templateUrl: "assets/view/toggle.html"});
  $routeProvider.when('/tabs',      {templateUrl: "assets/view/tabs.html"});
  $routeProvider.when('/detail/:poison_name', {templateUrl: "assets/view/detail.html"});
  $routeProvider.when('/login',   {templateUrl: "assets/view/login.html"});
  $routeProvider.when('/search',     {templateUrl: "assets/view/search.html"});
  $routeProvider.when('/carousel',  {templateUrl: "assets/view/carousel.html"});
});

app.service('analytics', [
  '$rootScope', '$window', '$location', function($rootScope, $window, $location) {
    var send = function(evt, data) {
      ga('send', evt, data);
    }
  }
]);



app.service('MDpoison', [
    '$resource', function($resource) {
        return $resource('assets/md_json/:md_name.json', {}, {
            query: {method:'GET', params:{md_name:'md_all'}, isArray:true}
        });
    }
]);


app.service('Apoison', [
  '$resource', function($resource) {
    return $resource('poisons/:poison_name.json', {}, {
      query: {method:'GET', params:{poison_name:'poisons'}, isArray:true}
    });
  }
]);

app.directive( "carouselExampleItem", function($rootScope, $swipe){
  return function(scope, element, attrs){
      var startX = null;
      var startY = null;
      var endAction = "cancel";
      var carouselId = element.parent().parent().attr("id");

      var translateAndRotate = function(x, y, z, deg){
        element[0].style["-webkit-transform"] = "translate3d("+x+"px,"+ y +"px," + z + "px) rotate("+ deg +"deg)";
        element[0].style["-moz-transform"] = "translate3d("+x+"px," + y +"px," + z + "px) rotate("+ deg +"deg)";
        element[0].style["-ms-transform"] = "translate3d("+x+"px," + y + "px," + z + "px) rotate("+ deg +"deg)";
        element[0].style["-o-transform"] = "translate3d("+x+"px," + y  + "px," + z + "px) rotate("+ deg +"deg)";
        element[0].style["transform"] = "translate3d("+x+"px," + y + "px," + z + "px) rotate("+ deg +"deg)";
      }

      $swipe.bind(element, {
        start: function(coords) {
          startX = coords.x;
          startY = coords.y;
        },

        cancel: function(e) {
          translateAndRotate(0, 0, 0, 0);
          e.stopPropagation();
        },

        end: function(coords, e) {
          if (endAction == "prev") {
            $rootScope.carouselPrev(carouselId);
          } else if (endAction == "next") {
            $rootScope.carouselNext(carouselId);
          }
          translateAndRotate(0, 0, 0, 0);
          e.stopPropagation();
        },

        move: function(coords) {
          if( startX != null) {
            var deltaX = coords.x - startX;
            var deltaXRatio = deltaX / element[0].clientWidth;
            if (deltaXRatio > 0.3) {
              endAction = "next";
            } else if (deltaXRatio < -0.3){
              endAction = "prev";
            }
            translateAndRotate(deltaXRatio * 200, 0, 0, deltaXRatio * 15);
          }
        }
      });
    }
});

app.controller('MainController', function($rootScope, $scope, $routeParams, Apoison, MDpoison, analytics){

  $rootScope.$on("$routeChangeStart", function(){
    $rootScope.loading = true;
  });

  $rootScope.$on("$routeChangeSuccess", function(){
    $rootScope.loading = false;
  });

  var scrollItems = [];

  for (var i=1; i<=5; i++) {
    scrollItems.push("Item " + i);
  }

  $scope.forums = [
      {title:"毒物信息纠错板块"},
      {title:"技术交流板块"},
      {title:"疑难解答板块"}
  ];

  $scope.markdown="#你好";

  $scope.search={

  };
  $scope.search_page={
      fuck:function(){
        console.log(MDpoison.query());
        console.log($scope.markdown);
      },
      point:0,
      get_point:function(_a){//方法二是讲数组直接用函数传递,如果数量多了还是不适合遍历的,但是ng-click的部分未解决
          this.point=_a;
          //console.log($routeParams.poison_name);//可以传递,但是会迟一个才传出,应该和点击次序有关,搞不懂了,不过确实有两个方法,一个应该更适合
      }
  };
  $scope.poisons=Apoison.query();
  $scope.MDpoisons=MDpoison.query();
  //$scope.test="<img src='http://d.hiphotos.baidu.com/image/pic/item/30adcbef76094b36dfd52ee7a1cc7cd98d109d70.jpg'>";
  //上面的结果是直接显示了标点,而不是图片
  $scope.character=["一、理化性质","二、快速检测参考方法"];
  $scope.ways=["方法原理","试剂","方法步骤（前处理）","试验结果（图片或视频）","相关评价","注意事项","方法出处"];
  $scope.phys=["分子式","分子量","结构式","外观（纯品与商业品）","图片（另存）","密度","熔点","沸点","气味","可燃性","溶解性","酸碱性","LD50","中毒剂量（人）","致死剂量（人）","其他理化性质（特殊反应）"]
  $scope.names=["中文通用名","化学名","俗称（商品名）","英文名","CASNo"];//Apoison["中文通用名"]();
  $scope.abouts=["毒物来源","中毒机制及体内代谢","临床表现","尸检情况","急救措施"];
  //console.log(1234);
  //$scope.search.name= $routeParams.poison_name;//一种方法是传递毒物名,详细界面再做一次检索,另一种是直接传递参数好像也不适合








  $scope.userAgent =  navigator.userAgent;

});