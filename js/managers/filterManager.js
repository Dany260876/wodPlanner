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
