/*
* Stat Manager : display wod stats
*/
var statisticsManager = {
	showActivityStatistics: (listWods, divTargetId, titre) => {
		// get activity stats by day
		let dataStatsDuree = [];
		let dataStatsNbExo = [];

		// get date range
		let maxDate = new Date().toLocaleDateString();
		let minDate = new Date();
		minDate.setDate(minDate.getDate()-4);
		minDate = minDate.toLocaleDateString();

		// get stats
		listWods.forEach((wod) => {
			let currentDate = wod.getShortDate();
			if ((currentDate >= minDate) && (currentDate <= maxDate)) {
				let statsDuree = {
					'label': wod.getShortDate(),
					'y': wod.getDureeMillisecondes()/(1000*60)
				};
				let statsNbExo = {
					'label': wod.getShortDate(),
					'y': wod.wodItems.length
				};
				dataStatsDuree.push(statsDuree);
				dataStatsNbExo.push(statsNbExo);	
			}
		});

		// configure chart & display
		let configChart = [];
		configChart.push({
			type: "column",
			name: "Nb Exercices",
			legendText: "Nombre d'exercices",
			showInLegend: true,
			dataPoints: dataStatsNbExo
		});
		configChart.push({
			type: "column",
			name: "Durée",
			legendText: "Durée séance (minutes)",
			axisYType: "secondary",
			showInLegend: true,
			dataPoints: dataStatsDuree
		});

		var chart = new CanvasJS.Chart(divTargetId, {
			animationEnabled: true,
			title:{
				text: titre,
				fontSize: 14,
				fontColor: "black",
				fontWeight: "normal"
			},
			axisX: {
				labelAngle: 90,
				labelFontSize: 12
			},
			axisY: {
				title: "Nb d'exercices",
				titleFontColor: "#4F81BC",
				titleFontSize: 12,
				lineColor: "#4F81BC",
				labelFontColor: "#4F81BC",
				tickColor: "#4F81BC"
			},
			axisY2: {
				title: "Durée (mn)",
				titleFontColor: "#C0504E",
				titleFontSize: 12,
				lineColor: "#C0504E",
				labelFontColor: "#C0504E",
				tickColor: "#C0504E"
			},
			legend: {
				fontSize: 12
			},
			data: configChart
		});
		chart.render();
	},
	// show stats for wod zones
	showWodZonesStatistics: (objWod, divTargetId, titre) => {
		objWod.getZonesStatistics().done((stats) => {

			// Get stats data 
			let dataStats = [];
			let maxValue = 0;
			stats.forEach((stat) => maxValue = maxValue + stat.qte);
			stats.forEach((stat) => {
				dataStats.push({
					y: (stat.qte*100/maxValue) , name: stat.zone
				});
			});

			// configure chart & display
			let configChart = [];
			configChart.push({
				type: "pie",
				showInLegend: true,
				yValueFormatString: "##0.00'%'",
				indexLabel: "{y}",
				dataPoints: dataStats
			});
			let chart = new CanvasJS.Chart(divTargetId, {
				animationEnabled: false,
				title: {
					text: titre
				},
				data: configChart
			});
			chart.render();
		});
	}
};