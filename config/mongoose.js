const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//IF ELSE STATEMENT to evaluate whether we are in production or live
if (process.env.NODE_ENV === "development"){
	//If we are in development, use the local database
	var url = process.env.LOCAL_DB_URL;
	var mode = 'development';
} else if (process.env.NODE_ENV === "production" || process.env.TEST === true){
	//If we are in production, use the mongolab db
	var url = process.env.LIVE_DB_URL;
	var mode = 'production'
} else if (process.env.NODE_ENV === "localdb"){
	var url = process.env.ATLAS_DB_URL;
	var mode = 'localdbtesting'
}
//connect
mongoose.connect(url, { useNewUrlParser: true })
.then((res)=>{
	console.log(`We are in ${mode} and connected with object ${res}`);
})
.catch((err)=>{
	console.log('Mongoose failed to connect ' + err);
});

mongoose.connection.on('error', err => {
  console.log('After intial connection we had error ' + err);
});

module.exports = {mongoose}