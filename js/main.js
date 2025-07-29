/* 
* Main program
*/
var program = {
	start: () => {
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
	}
};

