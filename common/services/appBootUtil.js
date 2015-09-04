'use strict';

/**
 * @author Lakmal Molligoda
 *  helper service wrapped to support various jquery tasks
 */
define(['private_packages/aaf/common/commonModule'], function (mod) {
	var injectParams = ['$q'];

	var aafAppBootUtil = function ($q) {
		var dependencies = [];

		this.registerDependency = registerDependency;

		this.waitOnDependencies = waitOnDependencies;

		function registerDependency(promise) {
			dependencies.push(promise);
		}

		function waitOnDependencies() {
			return $q.all(dependencies);
		}
	};

	aafAppBootUtil.$inject = injectParams;

	mod.register('service', 'aafAppBootUtil', aafAppBootUtil);
});
