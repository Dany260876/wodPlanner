/*
* Stat Manager : display wod stats
*/
var statisticsManager = {
	showWodZonesStatistics: (objWod, divTargetId, titre) => {
		objWod.getZonesStatistics().done((stats) => {

			// Get stats data 
			let dataStats = [];
			let maxValue = 0;
			stats.forEach((stat) => maxValue = maxValue + stat.qte);
			stats.forEach((stat) => {
				dataStats.push({
					y: (stat.qte*100/maxValue) , label: stat.zone
				});
			});

			// configure chart & display
			let configChart = [];
			configChart.push({
				type: "pie",
				startAngle: 240,
				yValueFormatString: "##0.00'%'",
				indexLabel: "{label} {y}",
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