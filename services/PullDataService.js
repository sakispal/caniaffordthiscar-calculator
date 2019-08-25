//NPM PACKAGES REQUIRES
const express = require('express');
const app = express();
const request = require("request");
const bodyParser = require("body-parser");
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const expressSanitizer = require("express-sanitizer");
const fs = require('fs');
const dotenv = require('dotenv').config();

var {mongoose} = require("../config/mongoose");

//DB Schema
const Car = require("../models/carSchema");
//REQUIRE SERVICES 
const sendMail = require("../functions/sendMail");
const CarService = require("./CarService");
//Instantiate inputservice
const carService = new CarService();
// Switch mongoose from callback to promises
mongoose.Promise = global.Promise;

//Import mongoose here. ONLY FOR DEVELOPMENT PURPOSES
// mongoose.connect(process.env.LOCAL_DB_URL);

function PullDataService(){};
var method = PullDataService.prototype;

method.makeList = () => {
    let makeArray = [];
    let makeDatabase = JSON.parse(fs.readFileSync("./database/makes.json", "utf8"));
    makeDatabase.make.forEach(function(make){
      makeArray.push(make);  
    });
    return makeArray.sort();
};

//MODEL
method.modelList = (make, socket) =>{
	// 
	Car.distinct("model" , {make})
	.then(arr => {
		//Sort these models in an array and return the array
		socket.emit('dropdown.model', arr.sort());
		// console.log('Pulldataservice about to emit model list ' + arr.sort());
	})
	.catch(err => {
		console.log(`modelList function returned error ${err}`)
	});
};
//EXEC
// method.modelList('Acura');

//TRIM
method.trimList = (model, socket) =>{
	Car.distinct("trim" , {model})
	.then(arr => {
		//Sort these models in an array and return the array
		socket.emit('dropdown.trim', arr.sort());
	})
	.catch(err => {
		console.log(`trimList function returned error ${err}`)
	});
}
//EXEC
// method.trimList('ILX')

//YEAR
method.yearList = (trim, model, socket) => {
	params = {
		model : model
	};

	//Make the TRIM optional!!!
	if (trim){
		params.trim = trim;
	}

	Car.distinct("year" , params)
	.then(arr => {
		//Sort these models in an array and return the array
		socket.emit('dropdown.year', arr.sort());
	})
	.catch(err => {
		console.log(`yearList function returned error ${err}`)
	});
}
//EXEC
// method.yearList("Sedan", "ILX");

method.fullListing = async function(user){
	// console.log("Invoked fullListing function");
	try {
		let retrievedCars = await method.getResultsFromDatabase(user);
		let data = await carService.getFullListing(user, retrievedCars);
		return new Promise((resolve, reject) => {
	        // console.log(`About to resolve data ${JSON.stringify(data, undefined, 4)}`);
	        resolve(data);    
	    });   
	} 
	catch(error){
		// console.log("Pulldataservice.fullListing function had error " + error);
		return new Promise((resolve, reject) => {
	        reject(error);    
	    }); 
	} 
};

method.getResultsFromDatabase = (user) =>{
	return new Promise((resolve, reject) =>{
		if (!user.make || !user.model){
			reject('User has not provided the exact make or model');
		}

		Car.find({
			make : user.make,
			model : user.model,
			year : user.year
		})
		.limit(20)
		.then((result) =>{
			// console.log(result);
			if (!result[0]){
				reject("Couldn't find this car in the database");
			}
			resolve(result)
		})
		.catch(error=>{
            reject(error);
        })
	})
}


module.exports = PullDataService;
