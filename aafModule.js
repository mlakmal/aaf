'use strict';

define(['aaf/core/coreUtils'], function (coreUtils) {
  var mod = angular.module('aafModule', [
      'aafCommonModule'
    ]);

    coreUtils.InitAngularModule(mod);

    return mod;
});
