const {mongoose} = require("../config/mongoose");

var userSchema = new mongoose.Schema({
	"make" : String,
	"model" : String,
	"year" : Number,
	"budget" : String,
	"mileage" : {
		type: String,
		default : "10000"
	},
	"email" : String
});

var User = mongoose.model("User", userSchema, 'users');

module.exports = User;