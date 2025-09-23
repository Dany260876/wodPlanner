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
	},
	renderHeader: (headerName) => {
		var result = $.Deferred();
		templateHelper.buildTemplate('header/' + headerName).done(function(res) {
			$('#divHeader').html(res);
			result.resolve(res);
		})
		.fail(function() {
			result.reject(null);
		});
		return result.promise();
	},
	navigateTo: (pageName) => {
		var result = $.Deferred();
		let pageConfig = program.configuration.pages.find((obj) => obj.name==pageName);
		popinManager.hide();		
		pageManager.renderHeader(pageConfig.header).done(() => {
			pageManager.renderFooter(pageConfig.footer).done(() => {
				pageManager.renderPage(pageConfig.page).done(() => {
					result.resolve();
				}).fail(function() {
					result.reject(null);
				});
			})
			.fail(function() {
					result.reject(null);
			});
		})
		.fail(function() {
			result.reject(null);
		});
		return result.promise();
	}
};