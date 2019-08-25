//Bullshit value to emit
var spaceForMessage = document.getElementById("customerMessage");
var spaceForComparison = document.getElementById("comparisonMessage");

let search = "<a href='/' target = 'blank' >search</a>";

var comparison = {
	"affordable" : "Congrats!! You can afford a ",
	"unaffordable" : "A bit expensive. Looks like you can't afford a ",
	"unspecified" : "You haven't specified your budget for a ",
	"error" : "We apologize but couldn't retrieve some data for your selected model "
};

var customerMessage = {
	"failedGas" : "Please note that we were not able to retrieve mileage data for this model, and we have assumed an average of 22 miles per gallon",
	"failedPrice" : `Apologies. We can't retrieve a relevant price for this model. Would you like to ${search} for another model?`
};

//Get feedback from the backend on what to display
var socket = io();

//RECEIVE the full car listing from the server side and render some customer messages to the client
socket.on('listing', function(listing){
	// console.log("Received listing " + listing.gasStatus + listing.car + listing.gasPrice);
	emptyDOMelements(customerMessage);
	emptyDOMelements(comparisonMessage);

	//Take the comparison string from listing outcome, use it as a key to the loacl comparison object.
	spaceForComparison.append(comparison[listing.outcome.comparison]);

	if (!listing.gas.status){
		$("#customerMessage").append(customerMessage.failedGas);
	}
	if (!listing.price.status){
		// We have to remove the budgeting information, as we have failed to retrieve price data
		emptyDOMelements(comparisonMessage);
		$("#comparisonMessage").append(customerMessage.failedPrice);
	}
});

//Note that this is vanilla JS. Above I have some jQuery, which may be confusing.
function emptyDOMelements(selector){
	while (selector.firstChild) {
    	selector.firstChild.remove();
	}
};