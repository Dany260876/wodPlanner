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
				if (name=='exerc') listData.push(new Exercice(d.id, d.nom, d.categorie_id, d.zone_du_corps_id, d.difficulte_id, d.description, false));
				if (name=='customExerc') listData.push(new Exercice(d.id, d.nom, d.categorie_id, d.zone_du_corps_id, d.difficulte_id, d.description, true));
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
				if (name=='exerc') jsonData.push(new Exercice(d.id, d.nom, d.categorie_id, d.zone_du_corps_id, d.difficulte_id, d.description, false));
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
	addCustomExercice: (newExercice) => {
		dataManager.getDataFromStorage('customExerc').done((data) => {
			var customExerciceList = [];
			if (data!=null) customExerciceList = customExerciceList.concat(data);
			customExerciceList.push(newExercice);
			window.localStorage.setItem('customExerc', JSON.stringify(customExerciceList));
		});
	}
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
	load: (type) => {
		var popinName = '';
		if (type=='OK') popinName = 'popinElementOK';
		if (type=='OKCancel') popinName = 'popinElementOKCancel';		
		return pageManager.renderElement(popinName, null, 'divPopin');
	},
	hide: () => {
		$("#divPopin").hide();
		$(".tblContent").show();
	},
	show: () => {
		$("#divPopin").show();
        $(".tblContent").hide();
	},
	validate: () => {
		// get keys & values and build result
		var keyObj = $('.keyForm');
		var valueObj = $('.valueForm');
		var result = "";
		for (i=0;i<keyObj.length;i++) {
			if (result!='') result += "|";
			result += $(keyObj[i]).attr('field') + "=" + $(valueObj[i]).val();
		}
		// Call callback function
		var callbackFunc = sessionStorage.getItem('popinCallbackFunction');
		if (callbackFunc && callbackFunc!='') {
			callbackFunc = callbackFunc.replace('(','').replace(')','');
			var arrayCF = callbackFunc.split('.');
			if (arrayCF.length==2) window[arrayCF[0]][arrayCF[1]](result);
			if (arrayCF.length==1) window[arrayCF[0]](result);
		}
		// reset callback function
		popinManager.setCallbackFunction('');
		// hide popin
		popinManager.hide();
	},
	setCallbackFunction: (funcName) => {
		sessionStorage.setItem('popinCallbackFunction', funcName);
	}
};