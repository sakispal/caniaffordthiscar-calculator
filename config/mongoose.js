const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//CONFIGURE MONGOOSE
//IF ELSE STATEMENT to evaluate whether we are in production or live
if (process.env.NODE_ENV === "development"){
	//If we are in development, use the local database
	mongoose.connect(process.env.LIVE_DB_URL, { useNewUrlParser: true }, (err, res)=>{
		if (err){
			console.log('Mongoose failed to connect ' + err);
		} else {
			console.log("We are in development" + res);			
		}
	});

} else if (process.env.NODE_ENV === "production"){
	//If we are in production, use the mongolab db
	mongoose.connect(process.env.LIVE_DB_URL, { useNewUrlParser: true }, (err, res)=>{
		if (err){
			console.log('Mongoose failed to connect ' + err);
		} else {
			console.log("We are in production" + res);
		}
	});
} else if (process.env.NODE_ENV === "localdb"){
	mongoose.connect(process.env.LOCAL_DB_URL, { useNewUrlParser: true }, (err, res)=>{
		if (err){
			console.log('Mongoose failed to connect ' + err);
		} else {
			console.log("We are in local db development" + res);
		}
	});
}



module.exports = {mongoose}