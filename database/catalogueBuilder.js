const fs = require("fs");

let architecture = {
	make : [
		[
			{
				model : ""
			}, 
			{
				year : []
			}
		],
		[]
	],
}

var make = "honda";
const data = JSON.parse(fs.readFileSync(`database/vehicles/${make}.json`, "utf8"));

function buildCatalogue(make, data, callback){
	console.time("iteration")
 	//Iterate through the data input --has to be done with a promise.
 	buildFromInput(data)
 	.then((catalogue) => {
 		console.timeEnd("iteration");
 		console.log(`Vehicles in the end ${JSON.stringify(vehicleCatalogue, undefined, 2)}` );
 		fs.writeFileSync(`database/make-counts/${make}.json`, JSON.stringify(vehicleCatalogue, undefined, 4));
 		// Only in case we want to pass this to another function
 		callback(null, catalogue);
 	})
 	.catch((error) => {
 		console.log(`buildFromInput returned error ${error}`);
 	});	
};

buildCatalogue(make,data, function(err, res){
	if (err){
		console.log(err)
	} else {
		return res;
	}
});

module.exports = buildCatalogue;

function buildFromInput(data){
	debugger;
	return new Promise ((resolve, reject) => {
		//create new empty entry in the catalogue with the correct make name
		var vehicleCatalogue = catalogueConstructor();
		resolve(iterateData(data, vehicleCatalogue));
	});
};

async function iterateData(data, vehicleCatalogue){
	//2 Counters, i for the catalogue, k for the input data
	for (k = 0; k < data.vehicles.length; k++){
		let vehicle = data.vehicles[k];
		// console.log(`For index = ${k}, of ${data.vehicles.length} we currently have ${JSON.stringify( vehicleCatalogue, undefined, 2)}`);
		//The first time needs to be populated with something
		if (k === 0){
			vehicleCatalogue = firstIteration(vehicleCatalogue, vehicle.model, vehicle.year);	
			debugger;
		} else {
			//return an updated version of catalogue
			vehicleCatalogue = await searhForDuplicate(vehicleCatalogue , vehicle);
			if (k === data.vehicles.length-1){
				// console.log(`For index = ${k} we are about to return ${JSON.stringify(vehicleCatalogue, undefined, 2)}`);
				return vehicleCatalogue;
			};
		};
	};
};


async function searhForDuplicate(catalogue ,vehicle){
	// console.log("searhForDuplicate has been fed catalogue " + JSON.stringify(catalogue, undefined, 2))
	let result = await searchDuplicateModel(catalogue[make], vehicle.model);
	try {
		if (result.TOF === false){
			// push the model to the end of the array
			let afterModelAdd = await addModel(catalogue, vehicle);
			return afterModelAdd;
		} else {
			//if the model exists, first check if that year exists already BUT ONLY IN THAT PARTICULAR MODEL
			let existingModelTracker = catalogue[make][result.where];
			// If it doesn't , then just push the found year in that particular object!
			let yearExists = await searchDuplicateYear(existingModelTracker[1].year, vehicle.year);
			if (yearExists === false){
				//push that year to the model
				let finalCatalogue = await addYear(catalogue, result.where, vehicle.year);	
				// console.log(`Just pushed year ${vehicle.year} and about to return ${JSON.stringify(finalCatalogue, undefined, 2)}`);
				return finalCatalogue;
			} else {
				return catalogue;
			}
		}	
	} catch(err){
		console.log("Async function searhForDuplicate returned error " +err);
	}
};

function addYear(catalogue, where, vehicleYear){
	return new Promise((resolve,reject) => {
		if (catalogue === undefined){
			reject ("addYear function was passed undefined catalogue");
		} else {
			catalogue[make][where][1].year.push(vehicleYear);
			// console.log(`addYear about to resolve ${JSON.stringify( catalogue, undefined, 2)}`);
			resolve(catalogue);
		}
	});
}

function addModel(vehicleCatalogue, vehicle){
	return new Promise ((resolve, reject) => {
		let modelToPush = [
			{
				"model" : vehicle.model						
			},
			{
				"year" : [vehicle.year]
			}
		];
		if (vehicleCatalogue === undefined){
			reject ("addYear function was passed undefined catalogue");
		} else {
			vehicleCatalogue[make].push(modelToPush);
			// console.log(`addModel about to resolve ${JSON.stringify(vehicleCatalogue, undefined, 2)}`);
			resolve(vehicleCatalogue);
		}
		
	});
};

function searchDuplicateModel(previousArray, toInvestigate){
	return new Promise ((resolve, reject) => {
		if (!Array.isArray(previousArray)){
			reject ("The search duplicate function received non array as input")
		} else {
			iterateArray(previousArray, toInvestigate, (res) => {
				// console.log(`searchDuplicateModel is about to return ${JSON.stringify(res)}`);
				resolve(res);
			});
		}	
	});	
};

//put a new async function here
function iterateArray(array, toInvestigate, callback){
	let exists = {
		TOF : false,
		where : 0
	};
	array.forEach(function(current, index){
		// console.log(`Inside the Model check, current model is ${current[0].model} , ${current[1].year} and to investigate is ${toInvestigate}`);
		if (current[0].model === toInvestigate){
			exists = {
				TOF : true,
				where : index
			};	
		};
		//Only return the result when the loop has finished
		if (index === array.length-1){
			//Callback is the only way, as a return would return it to the inner function
			callback(exists);
		};			
	});
};


function searchDuplicateYear(yearArray, toInvestigate){
	return new Promise ((resolve, reject) => {
		let exists = false;
		yearArray.forEach(function(currentYear, index){
			// console.log(`In the duplicate year function, we received array ${yearArray} we are examining ${currentYear} for year ${toInvestigate}`);
			if (currentYear == toInvestigate){
				exists = true;
			};
			if (index === yearArray.length-1){
				resolve(exists);
			};		
		});
		
	});
};

function catalogueConstructor(){
	vehicleCatalogue = {};
	vehicleCatalogue[make] = [];
	vehicleCatalogue[make][0] = [
		{
			"model" : ""
		},
		{
			"year" : ""
		}
	];
	return vehicleCatalogue;
};

function firstIteration(vehicleCatalogue, currentModel, currentYear){
	//Save model
	vehicleCatalogue[make][0][0].model = currentModel;
	// Create a year array object && save year
	vehicleCatalogue[make][0][1].year = [currentYear];
	// console.log(`Vehicles at first iteration ${JSON.stringify(vehicleCatalogue, undefined, 2)}` );
	return vehicleCatalogue;
};