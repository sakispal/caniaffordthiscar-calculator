const fs = require("fs");
const json = JSON.parse(fs.readFileSync("./database/costs.json"));


async function getMiscCosts (parsed, userPrice, userMileage){
	let miscCosts =  await retrieveCosts(userPrice);
	// console.log("Calculated misc Costs" + JSON.stringify(miscCosts ,undefined, 2));
	return calculateMiscCosts(miscCosts, userMileage);;
};

function retrieveCosts(userPrice) {

	return new Promise (function(resolve, reject){
		let costArray = ['costs10k', 'costs20k', 'costs30k', 'costs40k', 'costs50k', 'costs60k', 'costs70k', 'costs80k'];
		//price check, 10k incrementation
		let lowerLimit = 0;
		let upperLimit = 10000;

		for (let i = 0; i < 8; i++){
			if (userPrice > lowerLimit && userPrice < upperLimit){
				var index = costArray[i];
				resolve(json[index]);

			} else {
				lowerLimit += 10000;
				upperLimit += 10000;
			}
		};

		resolve(json[costArray[7]]);
	});
};

function calculateMiscCosts(costs, userMileage){
	//TIRE COST CALCULATED SEPARATELY ASSUMING CHANGE EVERY 15,000 MILES
	var tireCost = Math.round((((costs.tires*userMileage)/15000)));
	let miscCosts = {
		"tax" : {
			"monthly" : Math.round(costs.tax / 12),
			"annual" : Math.round(costs.tax)
		},
		"insurance" : {
			"monthly" : Math.round(costs.insurance / 12),
			"annual" : Math.round(costs.insurance)
		},
		//THIS COST IS INCORPORATING TIRE COSTS FROM ABOVE
		"maintenance" : {
			"monthly" : Math.round(((costs.maintenance) + tireCost) / 12),
			"annual" : Math.round((costs.maintenance) + tireCost)
		},
		"total" : {
			"monthly" : null,
			"annual" : null
		}
	};
	//AGGREGATE ALL THE COSTS TOGETHER AND INCLUDE IN THE OBJECT AGAIN
	miscCosts.total.monthly = miscCosts.tax.monthly + miscCosts.insurance.monthly + miscCosts.maintenance.monthly;
	miscCosts.total.annual = miscCosts.tax.annual + miscCosts.insurance.annual + miscCosts.maintenance.annual;
	return 	miscCosts;
};

debugger;

module.exports = getMiscCosts;

