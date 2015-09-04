'use strict';

//this allows loading only the required js files with initial application
require.config({
  baseUrl: (typeof allTestFiles !== 'undefined') ? 'base/app' : '',
  urlArgs: '@@buildHash',
  paths: {
  },
  modules: [
    {
      name: 'aaf/core/corePkg'
    },
    {
      name: 'aaf/common/commonPkg'
    },
    {
      name: 'aaf/aafPkg'
    }
  ]
});

