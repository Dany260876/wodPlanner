class Exercice extends injectableObject {
	constructor(i, n, c, z, di, de, custom, et) {
		super();
		this.id = i;
	    this.nom = n;
	    this.categorie_id = c;
	    this.zone_du_corps_id = z;
	    this.difficulte_id = di;
	    this.description = de;
		this.isCustom = custom;
		this.etapes = et;
	}
}