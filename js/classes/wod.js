class WodItem extends injectableObject {
	constructor(type, exoId, nom, qte, unite) {
		super();
		this.type = type;
		this.exerciceId = exoId;
		this.nom = nom;
		this.quantite = qte;
		this.unite = unite;
	}
}

class Wod extends injectableObject {
	constructor(id, nom, wodItems) {
		super();
		this.id = id;
		this.nom = nom;
		this.wodItems = wodItems;
		this.dateDebut = null;
		this.dateFin = null;
	}
}