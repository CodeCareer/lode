;
(function() {
    'use strict';
    angular.module('kt.lode')

    .directive('ktLogout', function($window, $rootScope, $state, ipCookie, CacheFactory) {
        return {
            restrict: 'A',
            link: function($scope, $element) {
                $element.on('click', function(event) {
                    event.stopPropagation()
                    event.preventDefault()

                    delete $window.localStorage.user
                    delete $window.localStorage.token
                    $rootScope.user = null
                    $rootScope.currentUrl = ''
                    $rootScope.wantJumpUrl = ''
                    ipCookie.remove('token')
                    CacheFactory.clearAll()

                    $state.go('account.login', {}, {
                        reload: true
                    })
                })
            }
        }
    })

    .directive('ktFixed', function() {

        return {
            restrict: 'A',
            link: function($scope, $element) {
                var headH = 56 // 顶栏高度
                var placeholder // 元素浮动时候原位置用占位元素填补

                $(window).on('scroll', function() {
                    var docViewTop = $(window).scrollTop();
                    // var docViewBottom = docViewTop + $(window).height() - headH;

                    var elemTop = $element.offset().top;
                    var elemBottom = elemTop + $element.height();
                    var marginTop = parseInt($element.css('margin-top'), 10)

                    if (!$element.hasClass('fixed-el') && (elemBottom <= docViewTop)) {
                        var rect = $element[0].getBoundingClientRect()
                        placeholder = $('<div/>').css({ height: rect.height, width: rect.width }).insertBefore($element.next())
                        $element.addClass('fixed-el').css('top', headH - marginTop).data('elemBottom', elemBottom)
                    } else if ($element.hasClass('fixed-el') && $element.data('elemBottom') >= docViewTop) {
                        placeholder.remove()
                        $element.removeClass('fixed-el')
                    }
                })
            }
        }
    })

    //导出table为xls格式
    .directive('ktExportTable', function() {
        return {
            restrict: 'AE',
            scope: {
                table: '@',
                download: '@'


            },
            link: function(scope, ele) {
                ele.on('click', function() {
                    var oldDownload = ele.attr('download')
                    var newDownload = oldDownload.replace('@time@', moment().format('YYYY年MM月DD日HH时mm分ss秒'))
                    ele.attr('download', newDownload)

                    return ExcellentExport.excel(ele[0], scope.table, newDownload.replace('.xls', ''));
                })
            }
        }
    })


})();
