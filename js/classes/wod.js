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
	constructor(id, nom, wodItems, dateDebut, dateFin) {
		super();
		this.id = id;
		this.nom = nom;
		this.wodItems = wodItems;
		this.dateDebut = dateDebut;
		this.dateFin = dateFin;
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

			let resultat = "";
			if (dureeH>0) resultat = resultat + dureeH + "h";
			if (resteMin>0) resultat = resultat + resteMin + "min";
			if (resteSec>0) resultat = resultat + resteSec + "s";
			if (resultat=="") resultat = resultat + resteMs + "ms";
			
			return resultat;
		}
		return -1;		
	}
	getCurrentSerie(index) {
		for (i=index;i<this.wodItems.length;i++) {
			if (this.wodItems[i].type=='SERIE') return this.wodItems[i];
		}
		return null;
	}
	getZonesStatistics() {
		var result = $.Deferred();
		
		let exoIds = this.wodItems.map((ex) => { if (ex.type=='EXO') return ex.exerciceId; });
		
		this.tempData = {};
		dataManager.getExercicesByIds(exoIds).done((data) => {
			this.tempData.listeExercices = data;
			this.tempData.stats = [];
			this.wodItems.forEach((item, index) => {
				if (item.type=='EXO') {
					this.tempData.coef = 1;
					this.tempData.item = item;
					// get current loop value as x coef
					let serie = this.getCurrentSerie(index);
					if (serie!=null) this.tempData.coef = serie.quantite;	
					// get exercice details
					let exerciceDetails = this.tempData.listeExercices.find((ex) => { return ex.id==item.exerciceId; });
					// get exercice zones and add stat for each one
					dataManager.getZonesByIds(exerciceDetails.zone_du_corps_id).done((zones) => {
						zones.forEach((zone) => {
							let index = this.tempData.stats.findIndex((stat) => { return stat.zone==zone.nom; });
							if (index==-1) {
									this.tempData.stats.push({
									'zone':zone.nom,
									'qte':this.tempData.item.quantite*this.tempData.coef
								});	
							}
							else {
								let qte = this.tempData.stats[index].qte;
								qte = qte + this.tempData.item.quantite*this.tempData.coef;
								this.tempData.stats[index].qte = qte;
							}
						});
					});
				}
			});
			result.resolve(this.tempData.stats);
			this.tempData = undefined;
		});

		return result;
	}
}