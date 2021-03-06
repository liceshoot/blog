'use strict';

angular.module('pagination', []).
directive('paginator', [function(){
    return {
        restrict: 'EA',
        template: '<div class="page-list">' +
        '<ul class="pagination" ng-show="conf.totalItems > 0">' +
        '<li ng-class="{disabled: conf.currentPage == 1}" ng-click="prevPage()"><span>&laquo;</span></li>' +
        '<li ng-repeat="item in pageList track by $index" ng-class="{active: item == conf.currentPage, separate: item == \'...\'}" ' +
        'ng-click="changeCurrentPage(item)">' +
        '<span>{{ item }}</span>' +
        '</li>' +
        '<li ng-class="{disabled: conf.currentPage == conf.numberOfPages}" ng-click="nextPage()"><span>&raquo;</span></li>' +
        '</ul>' +
        '<div class="page-total" ng-show="conf.totalItems > 0">' +
        '第<input type="text" ng-model="jumpPageNum"  ng-keyup="jumpToPage($event)"/>页' +
        '每页<select ng-model="conf.itemsPerPage" ng-options="option for option in conf.perPageOptions " ng-change="changeItemsPerPage()"></select>' +
        '/共<strong>{{ conf.totalItems }}</strong>条' +
        '</div>' +
        '<div class="no-items" ng-show="conf.totalItems <= 0">暂无数据</div>' +
        '</div>',
        replace: true,
        scope: {
            conf: '='
        },
        link: function(scope, element, attrs){

            scope.changeCurrentPage = function(item){
                if(item == '...'){
                    return;
                }else{
                    scope.conf.currentPage = item;
                }
            };

            scope.conf.pagesLength = parseInt(scope.conf.pagesLength) ? parseInt(scope.conf.pagesLength) : 9 ;
            if(scope.conf.pagesLength % 2 === 0){
                scope.conf.pagesLength = scope.conf.pagesLength -1;
            }

            if(!scope.conf.perPageOptions){
                scope.conf.perPageOptions = [10, 15, 20, 30, 50];
            }

            function getPagination(){
                scope.conf.currentPage = parseInt(scope.conf.currentPage) ? parseInt(scope.conf.currentPage) : 1;
                scope.conf.totalItems = parseInt(scope.conf.totalItems);

                if(scope.conf.rememberPerPage){
                    if(!parseInt(localStorage[scope.conf.rememberPerPage])){
                        localStorage[scope.conf.rememberPerPage] = parseInt(scope.conf.itemsPerPage) ? parseInt(scope.conf.itemsPerPage) : 15;
                    }

                    scope.conf.itemsPerPage = parseInt(localStorage[scope.conf.rememberPerPage]);


                }else{
                    scope.conf.itemsPerPage = parseInt(scope.conf.itemsPerPage) ? parseInt(scope.conf.itemsPerPage) : 15;
                }

                scope.conf.numberOfPages = Math.ceil(scope.conf.totalItems/scope.conf.itemsPerPage);

                if(scope.conf.currentPage < 1){
                    scope.conf.currentPage = 1;
                }

                if(scope.conf.currentPage > scope.conf.numberOfPages){
                    scope.conf.currentPage = scope.conf.numberOfPages;
                }

                scope.jumpPageNum = scope.conf.currentPage;

                var perPageOptionsLength = scope.conf.perPageOptions.length;
                var perPageOptionsStatus;
                for(var i = 0; i < perPageOptionsLength; i++){
                    if(scope.conf.perPageOptions[i] == scope.conf.itemsPerPage){
                        perPageOptionsStatus = true;
                    }
                }
                if(!perPageOptionsStatus){
                    scope.conf.perPageOptions.push(scope.conf.itemsPerPage);
                }

                scope.conf.perPageOptions.sort(function(a, b){return a-b});

                scope.pageList = [];
                if(scope.conf.numberOfPages <= scope.conf.pagesLength){
                    for(i =1; i <= scope.conf.numberOfPages; i++){
                        scope.pageList.push(i);
                    }
                }else{
                    var offset = (scope.conf.pagesLength - 1)/2;
                    if(scope.conf.currentPage <= offset){
                        for(i =1; i <= offset +1; i++){
                            scope.pageList.push(i);
                        }
                        scope.pageList.push('...');
                        scope.pageList.push(scope.conf.numberOfPages);
                    }else if(scope.conf.currentPage > scope.conf.numberOfPages - offset){
                        scope.pageList.push(1);
                        scope.pageList.push('...');
                        for(i = offset + 1; i >= 1; i--){
                            scope.pageList.push(scope.conf.numberOfPages - i);
                        }
                        scope.pageList.push(scope.conf.numberOfPages);
                    }else{
                        scope.pageList.push(1);
                        scope.pageList.push('...');

                        for(i = Math.ceil(offset/2) ; i >= 1; i--){
                            scope.pageList.push(scope.conf.currentPage - i);
                        }
                        scope.pageList.push(scope.conf.currentPage);
                        for(i = 1; i <= offset/2; i++){
                            scope.pageList.push(scope.conf.currentPage + i);
                        }

                        scope.pageList.push('...');
                        scope.pageList.push(scope.conf.numberOfPages);
                    }
                }

                if(scope.conf.onChange){
                    scope.conf.onChange();
                }
                scope.$parent.conf = scope.conf;
            }

            scope.prevPage = function(){
                if(scope.conf.currentPage > 1){
                    scope.conf.currentPage -= 1;
                }
            };
            scope.nextPage = function(){
                if(scope.conf.currentPage < scope.conf.numberOfPages){
                    scope.conf.currentPage += 1;
                }
            };

            scope.jumpToPage = function(){
                scope.jumpPageNum = scope.jumpPageNum.replace(/[^0-9]/g,'');
                if(scope.jumpPageNum !== ''){
                    scope.conf.currentPage = scope.jumpPageNum;
                }
            };

            scope.changeItemsPerPage = function(){
                if(scope.conf.rememberPerPage){
                    localStorage.removeItem(scope.conf.rememberPerPage);
                }
            };

            scope.$watch(function(){
                var newValue = scope.conf.currentPage + ' ' + scope.conf.totalItems + ' ';

                if(scope.conf.rememberPerPage){

                    if(localStorage[scope.conf.rememberPerPage]){
                        newValue += localStorage[scope.conf.rememberPerPage];
                    }else{
                        newValue += scope.conf.itemsPerPage;
                    }
                }else{
                    newValue += scope.conf.itemsPerPage;
                }
                return newValue;

            }, getPagination);

        }
    };
}]);