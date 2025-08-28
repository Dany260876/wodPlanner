/*
* Data Manager : get data from json
*/
var dataManager = {
	getDataFromStorage: (name) => {
		var result = $.Deferred();
		// get data from storage (session then local)
		var dataString = window.sessionStorage.getItem(name);
		if (!dataString) dataString = window.localStorage.getItem(name);
		// Convert & return data
		if (!dataString) 
			result.resolve(null);	 
		else {
			var jsonData = JSON.parse(dataString);
			var listData = [];
			jsonData.forEach((d) => { 
				if (name=='categ') listData.push(new Categorie(d.id, d.nom, d.description));
				if (name=='exerc') listData.push(new Exercice(d.id, d.nom, d.categorie_id, d.zone_du_corps_id, d.difficulte_id, d.description, false, d.etapes));
				if (name=='customExerc') listData.push(new Exercice(d.id, d.nom, d.categorie_id, d.zone_du_corps_id, d.difficulte_id, d.description, true, d.etapes));
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
				if (name=='exerc') jsonData.push(new Exercice(d.id, d.nom, d.categorie_id, d.zone_du_corps_id, d.difficulte_id, d.description, false, d.etapes));
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
		var result = $.Deferred();
		var ex1 = dataManager.getDataFromStorage('exerc');
		var ex2 = dataManager.getDataFromStorage('customExerc');
		$.when(ex1, ex2).done((data1, data2) => {
			if (data2!=null)
				result.resolve(data1.concat(data2));
			else
				result.resolve(data1);
		});
		
		return result.promise();
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
	getExercicesByIds: (listIds) => {
		var result = $.Deferred();
		dataManager.getExercices().done((data) => {
			let items = [];
			data.forEach((item, index, arr) => {
				if (listIds.indexOf(item.id)>-1) items.push(item);
			});
			if (items.length>0)
				result.resolve(items);
			else
				result.reject(null);
		});
		return result.promise();
	},
	getZonesByIds: (listIds) => {
		var result = $.Deferred();
		dataManager.getZones().done((data) => {
			var items = [];
			data.forEach((item, index, arr) => {
				if (listIds.indexOf(item.id)>-1) items.push(item);
			});
			if (items.length>0)
				result.resolve(items);
			else
				result.reject(null);
		});
		return result.promise();
	},
	addCustomExercice: (newExercice) => {
		dataManager.getDataFromStorage('customExerc').done((data) => {
			var customExerciceList = [];
			if (data!=null) customExerciceList = customExerciceList.concat(data);
			customExerciceList.push(newExercice);
			window.localStorage.setItem('customExerc', JSON.stringify(customExerciceList));
		});
	},
	deleteCustomExercice: (idExercice) => {
		var result = $.Deferred();
		dataManager.getDataFromStorage('customExerc').done((customExerciceList) => {
			var found = false;
			$(customExerciceList).each(function(index, value) {
				if (value.id==idExercice) {
					found = true;
					customExerciceList.splice(index, 1);
				}
			});
			if (found) {
				window.localStorage.setItem('customExerc', JSON.stringify(customExerciceList));
				result.resolve();
			} 
			else {
				result.reject();
			}
		});
		return result.promise();
	},
};
