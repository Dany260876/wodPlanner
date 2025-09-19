/*
* Page manager : display html pages and content from templates
*/
var pageManager = {
	renderPage: (pageName, data) => {
		var result = $.Deferred();
		templateHelper.buildTemplate('page/' + pageName, data).done(function(res) {
			$('#divContent').html(res);
			result.resolve(res);
		})
		.fail(function() {
			result.reject(null);
		});
		return result.promise();
	},
	renderElement: (elementName, data, containerName) => {
		var result = $.Deferred();
		templateHelper.buildTemplate('element/' + elementName, data).done(function(res) {
			$('#' + containerName).html(res);
			result.resolve(res);
		})
		.fail(function() {
			result.reject(null);
		});
		return result.promise();
	},
	renderFooter: (footerPageName) => {
		var result = $.Deferred();
		templateHelper.buildTemplate('footer/' + footerPageName).done(function(res) {
			$('#divFooter').html(res);
			result.resolve(res);
		})
		.fail(function() {
			result.reject(null);
		});
		return result.promise();
	}
};