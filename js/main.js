/* 
* Main program
*/
var program = {
	loadScripts:() => {
		var result = $.Deferred();
		$.getJSON("./config.json", function(data) {
			data.forEach((d) => { 
				$('head').append("<script type='text/javascript' src='" + d + "'></script>");
			});
			result.resolve();
		})
		.fail(function() {
			result.reject([]);
		});	
		return result.promise();
	},
	start: () => {
		// Add scripts
		program.loadScripts().done(() => {
			// preload data & render home page
			var get1 = dataManager.getDataFromJson('categ');
			var get2 = dataManager.getDataFromJson('zones');
			var get3 = dataManager.getDataFromJson('diff');
			var get4 = dataManager.getDataFromJson('exerc');
			$.when(get1, get2, get3, get4).done(() => {
				popinManager.hide();
				pageManager.renderPage("homePage");
				pageManager.renderFooter("footerMenu");
			});
		});
	}
};

