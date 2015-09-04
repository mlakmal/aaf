'use strict';

/**
 * @author Lakmal Molligoda
 * @description this component allows other angular components to be registered for given module after angular bootstrap.
 * this helps angular components loaded asyc through requirejs to be registered easily without going through multiple if/else cases.
 */
define(function () {
  var CoreUtils = (function () {
    var aafCommonInjector = null;
    var aafAppBootUtil = null;

    var getAppBootUtil = (function () {
      if (aafCommonInjector === null) {
        aafCommonInjector = angular.injector(['ng', 'aafCommonModule']);
      }

      if (aafAppBootUtil === null) {
        aafAppBootUtil = aafCommonInjector.get('aafAppBootUtil');
      }

      return aafAppBootUtil;
    });

    var initAngularModule = (function (mod) {

      //below code is to support AMD component registering when unit test runner is executed.
      if (typeof allTestFiles !== 'undefined') {
        mod.asyncRegister = mod;
      }

      mod.config(function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
        mod.asyncRegister =
        {
          controller: $controllerProvider.register,
          directive: $compileProvider.directive,
          filter: $filterProvider.register,
          factory: $provide.factory,
          service: $provide.service
        };
      });

      mod.register = function (cmpType, cmpName, component) {
        switch (cmpType) {
          case 'controller':
            if (typeof this.asyncRegister !== 'undefined') {
              this.asyncRegister.controller(cmpName, component);
            }
            else {
              this.controller(cmpName, component);
            }

            break;
          case 'directive':
            if (typeof this.asyncRegister !== 'undefined') {
              this.asyncRegister.directive(cmpName, component);
            }
            else {
              this.directive(cmpName, component);
            }

            break;
          case 'service':
            if (typeof this.asyncRegister !== 'undefined') {
              this.asyncRegister.service(cmpName, component);
            }
            else {
              this.service(cmpName, component);
            }

            break;
          case 'factory':
            if (typeof this.asyncRegister !== 'undefined') {
              this.asyncRegister.factory(cmpName, component);
            }
            else {
              this.factory(cmpName, component);
            }

            break;
          case 'filter':
            if (typeof this.asyncRegister !== 'undefined') {
              this.asyncRegister.filter(cmpName, component);
            }
            else {
              this.filter(cmpName, component);
            }

            break;
          case 'provider':
            if (typeof this.asyncRegister !== 'undefined') {
              if (typeof this.provider !== 'undefined') {
                this.provider(cmpName, component);
              }
              else {
                console.log('async registering is not supported for providers');
              }
            }
            else {
              this.provider(cmpName, component);
            }

            break;
        }

      };
    });

    return {
      InitAngularModule: initAngularModule,
      GetAppBootUtil: getAppBootUtil
    };

  })();

  return CoreUtils;
});
