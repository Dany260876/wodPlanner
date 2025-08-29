class WodItem extends injectableObject {
	constructor(type, exoId, nom, qte, infos) {
		super();
		this.type = type;
		this.exerciceId = exoId;
		this.nom = nom;
		this.quantite = qte;
		this.infos = infos;
	}
}

class Wod extends injectableObject {
	constructor(id, nom, wodItems) {
		super();
		this.id = id;
		this.nom = nom;
		this.wodItems = wodItems;
		this.startDate = null;
		this.endDate = null;
	}
}