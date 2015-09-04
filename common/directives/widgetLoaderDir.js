'use strict';

/**
 * @author Lakmal Molligoda
 * @description this directive will load another directive dynamically.
 * Usage: <div data-widget-loader-dir data-widget-name="tcpWidgetName" data-widget-script-path="/feature/directives/xyzDir,path/directives/abcDir"></div>
 */
define(['private_packages/aaf/common/commonModule'], function (mod) {

  var injectParams = ['$q',
    '$log',
    '$compile'];

  /* istanbul ignore next */
  var aafWidgetLoaderDir = function ($q, $log, $compile) {
    return {
      restrict: 'A',
      scope: {
      },
      template: '<div class="anthemAlert" style="width:300px;margin:0 auto;">' +
      '<div class="media-body">' +
      '<p><img alt="" src="assets/images/ajax-loader.gif" style="margin-top: -2px;" /> loading content (widget) ...</p>' +
      '</div>' +
      '</div>',
      link: function (scope, element, attrs, ctrl) {
        var widget = null;

        init();

        function init() {
          loadChildDirectiveScript();

          scope.$on('$destroy', function () {
            destroyChildWidget();
          });
        }

        function loadChildDirectiveScript() {
          if (attrs.widgetName.length !== 0 && attrs.widgetScriptPath.length !== 0) {
            var scriptDeps = attrs.widgetScriptPath.split(',');
            require(scriptDeps, function () {
              loadSuccess();
            }, function (error) {
              loadFail(error);
            });
          }
        }

        function loadSuccess() {
          appendChildWidget();
        }

        function loadFail(error) {
          element[0].innerHTML = '<div  class="anthemAlert negative" style="width:300px;margin:0 auto;">' +
          '<div class="media-left media-middle">' +
          '<span class="glyphicon glyphicon-exclamation-sign"></span>' +
          '</div>' +
          '<div class="media-body">' +
          '<p>Error loading content (widget)</p>' +
          '</div>' +
          '</div>';
          $log.error(error);
        }

        function appendChildWidget() {
          element[0].innerHTML = '';

          //convert cameCase widgetname to snake-case to be used in html
          var widgetName = convertToSnakeCase(attrs.widgetName);
          widget = angular.element('<div data-' + widgetName + getHtmlAttrs() + '></div>');

          //compile the directive and append it to current element
          element.append(widget);
          $compile(widget)(scope);
        }

        //manually destroy the child element and its scope. stops memory leaks
        function destroyChildWidget() {
          var widgetScope = widget.scope();
          widget.remove();

          if (widgetScope) {
            widgetScope.$destroy();
          }
        }

        function convertToSnakeCase(attr) {
          return attr.replace(/([A-Z])/g, function ($1) { return '-' + $1.toLowerCase(); });
        }

        function getHtmlAttrs() {
          var object = attrs.$attr;
          var attrString = '';
          for (var key in object) {
            if (object.hasOwnProperty(key)) {
              if (!(key.indexOf('aaf') === 0 || key.indexOf('widget') === 0)) {
                attrString += ' data-' + convertToSnakeCase(key) + '="' + attrs[key] + '"';
              }
            }
          }

          return attrString;
        }
      }
    };
  };

  aafWidgetLoaderDir.$inject = injectParams;

  mod.register('directive', 'aafWidgetLoaderDir', aafWidgetLoaderDir);
});
