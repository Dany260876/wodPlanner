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
	getDataFromStorage: (name) => {
		var result = $.Deferred();
		var dataString = window.sessionStorage.getItem(name);
		if (!dataString) 
			result.reject();	 
		else {
			var jsonData = JSON.parse(dataString);
			var listData = [];
			jsonData.forEach((d) => { 
				if (name=='categ') listData.push(new Categorie(d.id, d.nom, d.description));
				if (name=='exerc') listData.push(new Exercice(d.id, d.nom, d.categorie_id, d.zone_du_corps_id, d.difficulte_id, d.description));
				if (name=='diff') listData.push(new Difficulte(d.id, d.nom));
				if (name=='zones') listData.push(new Zone(d.id, d.nom));
			});
			result.resolve(listData);
		}
		return result.promise();
	},
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
			window.sessionStorage.setItem(name, JSON.stringify(jsonData));
			result.resolve(jsonData);
		})
		.fail(function() {
			result.reject([]);
		});	
		return result.promise();
    },
	getCategories: () => {
		return dataManager.getDataFromStorage('categ');
	},
	getExercices: () => {
		return dataManager.getDataFromStorage('exerc');
	},
    getDifficultes: () => {
		return dataManager.getDataFromStorage('diff');
	},
    getZones: () => {
		return dataManager.getDataFromStorage('zones');
	},
	getCategorie: (id) => {
		var result = $.Deferred();
		dataManager.getCategories().done((data) => {
			var itemFound = null;
			data.forEach((item, index, arr) => {
				if (item.id==id) itemFound = item;
			});
			if (itemFound)
				result.resolve(itemFound);
			else
				result.reject(null);
		});
		return result.promise();
	},
	getDifficulte: (id) => {
		var result = $.Deferred();
		dataManager.getDifficultes().done((data) => {
			var itemFound = null;
			data.forEach((item, index, arr) => {
				if (item.id==id) itemFound = item;
			});
			if (itemFound)
				result.resolve(itemFound);
			else
				result.reject(null);
		});
		return result.promise();
	},
	getExercice: (id) => {
		var result = $.Deferred();
		dataManager.getExercices().done((data) => {
			var itemFound = null;
			data.forEach((item, index, arr) => {
				if (item.id==id) itemFound = item;
			});
			if (itemFound)
				result.resolve(itemFound);
			else
				result.reject(null);
		});
		return result.promise();
	},
};

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
};

/*
* Popin Manager : display popin
*/
var popinManager = {
	show: (type) => {
		var popinName = '';
		if (type=='OK') popinName = 'popinElementOK';
		if (type=='OKCancel') popinName = 'popinElementOKCancel';		
		return pageManager.renderElement(popinName, null, 'divPopin');
	},
	hide: () => {
		$("#divPopin").html("");
		$("#divPopin").hide();
	},
	validate: () => {
		console.log('validate');
	}
};