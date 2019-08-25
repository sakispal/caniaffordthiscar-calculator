const expressSanitizer = require("express-sanitizer");

//REQUIRE SERVICES 
const InputService = require("./InputService");
//Instantiate inputservice
const inputService = new InputService();


function UserService(){};
const method = UserService.prototype;

//Remake with static / Class function
// class UserFromPost = {
// 	constructor(req){
// 		this.make = req.sanitize(req.body.make),
// 		this.model = req.sanitize(req.body.model),
// 		this.year = req.sanitize(req.body.year),
// 		this.budget = req.sanitize(req.body.budget),
// 		this.frequency = req.sanitize(req.body.frequency),
// 		this.email = req.sanitize(req.body.email),
// 		this.mileage = req.sanitize(inputService.defaultInput(req.body.mileage)),
// 		this.car = this.year + " " + this.make + " " + this.model
// 	}
// };

method.userFromPost = function(req){
	//SANITIZE THE INFORMATION SO THAT IT IS ALWAYS A LOWERCASE STRING
	this.make = req.sanitize(req.body.make);
	this.model = req.sanitize(req.body.model);
	this.year = req.sanitize(req.body.year);
	this.budget = req.sanitize(req.body.budget);
	this.frequency = req.sanitize(req.body.frequency);
	this.email = req.sanitize(req.body.email);
	this.mileage = (!Number(req.body.mileage)) ? "10000" : inputService.cleanseUserInput(req.body.mileage);
	this.car = this.year + " " + this.make + " " + this.model;
};

module.exports = UserService;