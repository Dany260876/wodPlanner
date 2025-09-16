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
	getDateDebut() {
		if (!this.dateDebut) return "";
		return new Date(this.dateDebut).toLocaleDateString() + " " + new Date(this.dateDebut).toLocaleTimeString();
	}
	getDateFin() {
		if (!this.dateFin) return "";
		return new Date(this.dateFin).toLocaleDateString() + " " + new Date(this.dateFin).toLocaleTimeString();
	}
	getDureeSecondes() {
		if (this.dateFin && this.dateDebut) return (this.dateFin.getTime() - this.dateDebut.getTime())/1000;
		return -1;
	}
	getDureeMillisecondes() {
		if (this.dateFin && this.dateDebut) return (this.dateFin.getTime() - this.dateDebut.getTime());
		return -1;
	}
	getDuree() {
		if (this.dateFin && this.dateDebut) {
			let dureeMs = this.getDureeMillisecondes();
			let dureeSec = Math.floor(dureeMs/1000);
			let resteMs = dureeMs - (dureeSec*1000);
			let dureeMin = Math.floor(dureeSec/60);
			let resteSec = dureeSec - (dureeMin*60);
			let dureeH = Math.floor(dureeMin/60);
			let resteMin = dureeMin - (dureeH*60);
			return dureeH + ":" + resteMin + ":" + resteSec + "." + resteMs;
		}
		return -1;		
	}
}