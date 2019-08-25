//NPM PACKAGES REQUIRES
const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const request = require("request");
const bodyParser = require("body-parser");

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const expressSanitizer = require("express-sanitizer");
const file = require('file-system');
const fs = require('fs');
const ejs = require("ejs");
const nodemailer = require('nodemailer');
const helmet = require ("helmet");
const compression = require('compression');
const minify = require('express-minify');
const minifyHTML = require('express-minify-html');

//NPM PACKAGE CONFIGURATION
app.use(express.static("public"));
app.use(helmet());
// compress all responses
app.use(compression())

// Minify CSS & JS
app.use(minify());
// Minify HTML
app.use(minifyHTML({
    override:      true,
    exception_url: false,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  false
    }
}));

//Coming from HTML
app.use(bodyParser.urlencoded({extended : true}));
//Coming from Postman/API
app.use(bodyParser.json());
app.use(expressSanitizer());


// configure mongoose
const {mongoose} = require("./config/mongoose.js");

//CONFIGURE OUR MONGOOSE MODEL SCHEMA
const User = require("./models/userSchema");
const Car = require("./models/carSchema");

//REQUIRE split functions
const emitter = require("./functions/emitter");
const gasCrawler = require("./functions/gasCrawler");

//REQUIRE SERVICES 
const InputService = require("./services/InputService");
//Instantiate inputservice
const inputService = new InputService(); 
const UserService = require ("./services/UserService");
const userService = new UserService();
const PullDataService = require("./services/PullDataService");
const pullDataService = new PullDataService();

//DECLARE GLOBAL VARIABLES
var make, model, year, budget;
var dropdown = {
	"make" :[],
	"model":[],
	"year": []
};

// Everytime we start the server, we want to update the current gasprices.
gasCrawler.crawlGasPrice();

//ROUTES

//INDEX ROUTE
app.get("/", function(req, res){
	res.render("index.ejs");
});

//ABOUT US PAGE
app.get("/about", function(req, res){
	res.render("about.ejs");
});

//PRIVACY PAGE
app.get("/privacy", function(req, res){
	res.render("privacy.ejs");
});

//HOW IT WORKS PAGE
app.get("/howitworks", function(req, res){
	res.render("howitworks.ejs");
});

//CONTACT PAGE
app.get("/contact", function(req, res){
	res.render("contact.ejs");
});

// CONTACT ROUTE
app.post("/contact", function(req,res){
	// take req.body and send e-mail
})

//NEW SEARCH ROUTE
app.post("/",function(req,res){
	//Instantiate a user from the constructor
	var user = new userService.userFromPost(req);
	//take the User information and save it to mongoDb
	var newUser = User.create(user);

	// console.log(`user is ${JSON.stringify(user,undefined, 4)}`);

	pullDataService.fullListing(user)
	.then(response =>{
		console.log(`After the comparison we came up with ${JSON.stringify(response, undefined, 4)}`);
		//Necessary for testing purposes && for POSTMAN endpoint testing
		if (process.env.TEST){
			res.status(200).send(response);
		} else {
			emitter(io, "listing", response);
			res.status(200).render("budget.ejs", response);			
		}
	})
	//The error handling here needs improvement. Any error will show the same log.
	.catch((error) => {
		// Necessary for testing purposes && for POSTMAN endpoint testing
		if (process.env.TEST){
			res.status(400).send(error);
		} else {
			emitter(io, "listing", error);
			res.status(400).render("error.ejs");
		}		
		console.log("App experienced error number " + error);
	});
});


//BIDIRECTIONAL COMMUNICATION
io.on('connection', function(socket){ 
	// console.log('Server socket started running!')
	socket.on("disconnect", function(){
		inputService.clearOnReload();
	});
	//Call another function here, that will search the available listings for "fisker" and return "models"
	socket.emit("dropdown.make", pullDataService.makeList());
	
	socket.on("selectedMake", function(input){
		// console.log('Server received make ' + input);
		// Received selected make and started searching for model
		pullDataService.modelList(input, socket);
	});  
	socket.on("selectedModel", function(input){
		//If I implement trim as well, null below should be trim!
		pullDataService.yearList(null, input, socket);  
	});

});

// START THE SERVER
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "localdb"){
	server.listen(3000, () => {
		console.log("Listening to local port 3000!");
	});
} else { 
	//Listen to heroku's default port
	server.listen(process.env.PORT, () => {
		console.log("Listening to whatever heroku set" + process.env.PORT);
	});
}



module.exports = {app};