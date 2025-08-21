/*
* filter manager : filter data
*/
var filterManager = {
	// Filter all exercices by criterias
	filterExercices : (selectCategId, selectZoneId, selectDiffId) => {
		var result = $.Deferred();
		// Search exercices
		dataManager.getExercices()
			.done(function(listExercices) {
				// Get filter values
				var filterDiffId = $('#' + selectDiffId + ' select').val()*1;
				var filterCategId = $('#' + selectCategId + ' select').val()*1;
				var filterZoneId = $('#' + selectZoneId + ' select').val()*1;
	
				// filter results
				var results = listExercices;
				results = filterManager.filterExercicesByField(results, filterCategId, 'categ');
				results = filterManager.filterExercicesByField(results, filterDiffId, 'diff');
				results = filterManager.filterExercicesByField(results, filterZoneId, 'zone');
	
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
