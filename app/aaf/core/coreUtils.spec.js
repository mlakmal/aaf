'use strict';

/*jshint unused:false*/
var printStackTrace;
define(['aaf/core/coreUtils'], function (CoreUtils) {

    describe('unit tests coreUtils', function () {
        var fakeModule,
            injector,
            controller,
            scope,
            compile,
            fakeProv;

        //load dependencies before running test
        beforeEach(function () {
            fakeModule = angular.module('fakeModule', []);

            CoreUtils.InitAngularModule(fakeModule);
            fakeModule.register('provider', 'fakeProv', function () {
                this.$get = function () {
                    return this;
                };

                this.test = function () { };
            });
            fakeModule.config(function (fakeProvProvider) {
                fakeProv = fakeProvProvider;
            });
            module('fakeModule');
            inject(function ($injector, $controller, $rootScope, $compile) {
                injector = $injector;
                controller = $controller;
                scope = $rootScope;
                compile = $compile;
            });
        });

        //unit tests
        it('registered service should be defined', function () {
            fakeModule.register('service', 'fakeService', function () {
                this.sampleCall = function () { };
            });
            fakeModule.register('controller', 'fakeCtrl', function () {
                this.sampleCall = function () { };
            });
            fakeModule.register('filter', 'fakeFltr', function () {
                return function (value) { return value; };
            });
            fakeModule.register('directive', 'fakeDir', function () {
                return {
                    restrict: 'AEC',
                    scope: {
                    },
                    link: function (scope, element, attrs, ctrl) {
                        scope.sampleTest = 2;
                    }
                };
            });
            fakeModule.register('service', 'fakeService', function () {
                this.sampleCall = function () { };
            });
            fakeModule.register('factory', 'fakeFactory', function () {
                return {
                    sample: function () { }
                };
            });

            var fakeService = injector.get('fakeService');
            var fakeCtrl = controller('fakeCtrl', {});
            var filter = injector.get('$filter');
            var filterVal = filter('fakeFltr')('mockfilter');
            var fakeFactory = injector.get('fakeFactory');

            var elm = angular.element(
                '<div data-fake-dir></div>');
            compile(elm)(scope);
            scope.$digest();
            var eleScope = elm.isolateScope();

            expect(fakeService).toBeDefined();
            expect(fakeCtrl).toBeDefined();
            expect(filterVal).toBe('mockfilter');
            expect(eleScope.sampleTest).toBe(2);
            expect(fakeFactory).toBeDefined();
            expect(fakeProv).toBeDefined();
        });

        afterEach(function () {
        });
    });

});
