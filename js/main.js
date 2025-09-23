/* 
* Main program
*/
var program = {
	configuration: {},
	loadConfiguration:() => {
		var result = $.Deferred();
		$.getJSON("./config.json", function(data) {		
			// insert scripts
			program.configuration.scripts = data.scripts;
			data.scripts.forEach((d) => { 
				$('head').append("<script type='text/javascript' src='" + d + "'></script>");
			});
			
			// get pages configuration
			program.configuration.pages = data.pages;
			
			result.resolve();
		})
		.fail(function() {
			result.reject([]);
		});	
		return result.promise();
	},
	resizeView: () => {
		let headerHeight = 30;
		let footerHeight = 70;
		
		$(".divMainContent").css('position','absolute');
		$(".divMainContent").css('left','0');
		$(".divMainContent").css('top','0');
		$(".divMainContent").width('100%');
		$(".divMainContent").height('100%');
		
		let tblContentHeight = $(".divMainContent").height();
		
		$("#divHeader").css('left','0');
		$("#divHeader").css('top','0');
		$("#divHeader").width('100%');
		$("#divHeader").height(headerHeight + 'px');
		
		$("#divContent").css('overflow-y','scroll');
		$("#divContent").css('left','0');
		$("#divContent").css('top',headerHeight + 'px');
		$("#divContent").width('100%');
		$("#divContent").height((tblContentHeight-headerHeight-footerHeight) + 'px');
		
		let tdContentHeight = $("#divContent").height();
		
		$("#divFooter").css('left','0');
		$("#divFooter").css('top', (headerHeight+tdContentHeight) + 'px');
		$("#divFooter").width('100%');
		$("#divFooter").height(footerHeight + 'px');
	},
	start: () => {
		// Add scripts
		program.loadConfiguration().done(() => {
			// resize components
			program.resizeView();
			$(window).on("resize", function() {
				program.resizeView();
			});	
			
			// preload data & render home page
			var get1 = dataManager.getDataFromJson('categ');
			var get2 = dataManager.getDataFromJson('zones');
			var get3 = dataManager.getDataFromJson('diff');
			var get4 = dataManager.getDataFromJson('exerc');
			$.when(get1, get2, get3, get4).done(() => {
				pageManager.navigateTo('home');
			});
		});
	}
};

