/*
* Page manager : display html pages and content from templates
*/
var pageManager = {
	renderPage: (pageName, data) => {
		templateHelper.buildTemplate('page/' + pageName, data).done(function(res) {
			$('#tdContent').html(res);
		});
	},
	renderElement: (elementName, data, containerName) => {
		templateHelper.buildTemplate('element/' + elementName, data).done(function(res) {
			$('#' + containerName).html(res);
		});
	},
	renderFooter: (footerPageName) => {
		templateHelper.buildTemplate('footer/' + footerPageName).done(function(res) {
			$('#tdFooter').html(res);
		});
	}
};

/*
* Data Manager : get data from json
*/
var dataManager = {
    getDataFromJson: (name) => {
        var result = $.Deferred();
		$.getJSON("json/"+ name +".json", function(data) {
	        // create array of injectableObject
	        var jsonData = [];
	        data.forEach((d) => { 
                if (name=='categ') jsonData.push(new Categorie(d.id, d.nom, d.description));
                if (name=='exerc') jsonData.push(new Exercice(d.id, d.nom, d.categorie_id, d.zone_du_corps_id, d.difficulte, d.description));
                if (name=='diff') jsonData.push(new Difficulte(d.id, d.nom));
                if (name=='zones') jsonData.push(new Zone(d.id, d.nom));
	        });
			result.resolve(jsonData);
	    })
		.fail(function() {
			result.reject([]);
		});
		return result.promise();
    },
	getCategories: () => {
		return dataManager.getDataFromJson('categ');
	},
	getExercices: () => {
        return dataManager.getDataFromJson('exerc');
	},
    getDifficultes: () => {
        return dataManager.getDataFromJson('diff');
	},
    getZones: () => {
        return dataManager.getDataFromJson('zones');
	},
}