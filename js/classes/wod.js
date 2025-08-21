class WodItem extends injectableObject {
	constructor(exoId, reps, infos) {
		super();
		this.exerciceId = exoId;
		this.nbReps = reps;
		this.infos = infos;
	}
}

class Wod extends injectableObject {
	constructor(id , listItems) {
		super();
		this.id = id;
		this.listItems = listItems;
		this.startDate = null;
		this.endDate = null;
	}
}