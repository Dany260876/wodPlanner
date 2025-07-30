class Exercice extends injectableObject {
	constructor(i, n, c, z, di, de, custom) {
		super();
		this.id = i;
	    this.nom = n;
	    this.categorie_id = c;
	    this.zone_du_corps_id = z;
	    this.difficulte_id = di;
	    this.description = de;
		this.isCustom = custom;
	}
}

class Categorie extends injectableObject {
	constructor(i,n,d) {
		super();
		this.id = i;
		this.nom = n;
		this.description = d;
	}
}

class Difficulte extends injectableObject {
	constructor(i,n) {
		super();
		this.id = i;
		this.nom = n;
	}
}

class Zone extends injectableObject {
	constructor(i,n) {
		super();
		this.id = i;
		this.nom = n;
	}
}