/*
* Page manager : display html pages and content from templates
*/
var pageManager = {
	renderPage: (pageName, data) => {
		var result = $.Deferred();
		templateHelper.buildTemplate('page/' + pageName, data).done(function(res) {
			$('#tdContent').html(res);
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
			$('#tdFooter').html(res);
			result.resolve(res);
		})
		.fail(function() {
			result.reject(null);
		});
		return result.promise();
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
				if (name=='exerc') jsonData.push(new Exercice(d.id, d.nom, d.categorie_id, d.zone_du_corps_id, d.difficulte_id, d.description));
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
	getCategorie: (id) => {
		var result = $.Deferred();
		dataManager.getCategories().done((data) => {
			data.forEach((item, index, arr) => {
				if (item.id==id) result.resolve(item);
			});
			result.reject(null);
		});
		return result.promise();
	},
	getDifficulte: (id) => {
		var result = $.Deferred();
		dataManager.getDifficultes().done((data) => {
			data.forEach((item, index, arr) => {
				if (item.id==id) result.resolve(item);
			});
			result.reject(null);
		});
		return result.promise();
	}
}

/*
* filter manager : filter data
*/
var filterManager = {
	filterExercices: (list, id, field) => {
		var results = [];
		if (id<0) return list;
		list.forEach((e) => { 
			if (field=='categ' && e.categorie_id==id) results.push(e);
			if (field=='diff' && e.difficulte_id==id) results.push(e);
			if (field=='zone' && e.zone_du_corps_id.indexOf(id)>-1) results.push(e);
		});
		return results;
	}
}