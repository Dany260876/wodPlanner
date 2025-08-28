/*
* filter manager : filter data
*/
var filterManager = {
	// Filter all exercices by criterias
	filterExercices : (listElements) => {
		var result = $.Deferred();
		// Search exercices
		dataManager.getExercices()
			.done(function(listExercices) {
				// filter results
				var results = listExercices;
				listElements.forEach((element) => {
					let elementValue = $(element).val()*1;
					let type = $(element).data('type');
					results = filterManager.filterExercicesByField(results, elementValue, type);
				});
				result.resolve(results);
			})
			.fail(function() {
				result.reject(null);
			});
		return result.promise();
	},
	// Filter exercices list by Field id
	filterExercicesByField: (list, id, field) => {
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
