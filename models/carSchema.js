const {mongoose} = require("../config/mongoose");

var carSchema = new mongoose.Schema({
   "vin": String,
    "miles": Number,
    "price": Number,
    "location": Object,
    "make": String,
    "model": String,
    "year": String,
    "trim": String,
    "consumption": String,
    "transmission": String,
    "engine": String,
    "driveType": String,
    "fuel": String,
    "url": String,
});

var Car = mongoose.model("Car", carSchema, 'cars');

module.exports = Car;