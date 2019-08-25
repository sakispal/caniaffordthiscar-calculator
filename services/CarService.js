//REQUIRE FUNCTIONS
const getMiscCosts = require("../functions/getmisccosts");
//REQUIRE SERVICES 
const InputService = require("./InputService");
//Instantiate inputservice
const inputService = new InputService();

function CarService(){};
var method = CarService.prototype;

method.getListingUrl = function(objectArray){
    let urlArray = [];
    for (var i = 0; i < objectArray.length; i++){
        urlArray.push(objectArray[i].url || null);          
    };
    return urlArray;
}; 

method.getCarPrice = function(objectArray){
    // console.log(`Invoked getCarPrice function`);
    //DECLARE THE VARIABLES WE WILL NEED FOR THE FOLLOWING CALCULATIONS
    var price = {
        "monthly": "",
        "annual" : "",
        "pulledPrice" : "",
        "status" : true
    };
    
    let priceArray = extractPriceToArray(objectArray);
    let pulledPrice = calculateArrayAverage(priceArray);
    if (pulledPrice === 0 || isNaN(pulledPrice)){
        //Notify customer that we couldn't pull price info
        price.status = false;
    };
    //Update the object we are about to return
    price.monthly = reduceLoanToMonthly(pulledPrice);
    price.annual = price.monthly * 12;
    price.pulledPrice = pulledPrice;
    // console.log("getCarPrice about to return" + price);
    return price;
};

//Gas and mileage functions
method.getMileage = function(objectArray, userMileage){
    let mileage = extractMileage(objectArray);   
    let averageMPG = getAverage(mileage).average;           
    let gas = {
        "cost" :  {
            monthly : Math.round(getGasCost(averageMPG, userMileage)/12),
            annual : getGasCost(averageMPG, userMileage)
        },
        
        "status"  :  getAverage(mileage).status
    };
    return gas;
};

method.comparePrices = function(userBudget, userBudgetFrequency, calcPrice, calcGasCost, calcMiscCosts){
	var outcome ={
		comparison : "",
		cost : {
		    monthly : null,
		    annual : null
		}
	};
	// console.log("comparePrices is reading calcMiscCosts " + JSON.stringify(calcMiscCosts, undefined, 2));
	var totalCost = Number(calcPrice.annual) + Number(calcGasCost.annual) + Number(calcMiscCosts.total.annual);

	//Do the comparison based only on the annual price and then report whatever you want to the user.
	if (userBudgetFrequency === "monthly"){
		userBudget = userBudget*12;
		// console.log(`We have compared a ${userBudgetFrequency} budget of ${userBudget/12} against a total cost of ${totalCost/12} `);
	} else if (userBudgetFrequency === "annual"){
		// console.log(`We have compared a ${userBudgetFrequency} budget of ${userBudget} against a total cost of ${totalCost} `);
	}
	//Total cost always based on the annual
	if (userBudget > totalCost){
	    outcome.comparison = "affordable";
	} else if (userBudget === ""|| userBudget === null || userBudget === undefined){
	    outcome.comparison = "unspecified";
	} else if (isNaN(totalCost)){
	    outcome.comparison = "error --- total Cost is not a number";
	} else {
	    outcome.comparison = "unaffordable";
	};

	outcome.cost.monthly = Math.round(totalCost/12);
	outcome.cost.annual = totalCost;
	return outcome;
};

method.getFullListing = async function(user, objectArray){
    //This is called a singleton. It's essentially an object that is only instantiated once. It's one way to access a value from a previous key-value pair inside the object.
    let listing = new function(){
		this.price = method.getCarPrice(objectArray),
		this.url = method.getListingUrl(objectArray)
    };
    let miscCosts = await getMiscCosts(objectArray, listing.price.pulledPrice, user.mileage);
    let userBudget = inputService.getBudget(user.budget, user.frequency);
    
    let gas = method.getMileage(objectArray, user.mileage);
    let outcome = method.comparePrices(userBudget.amount, userBudget.freq, listing.price, gas.cost, miscCosts);

    let data = {
        car : user.car,
        mileage : user.mileage,
        listing : listing.url,         
        price : {
          monthly : listing.price.monthly, 
          annual : listing.price.annual,
          pulled : listing.price.pulledPrice,
          status : listing.price.status
        },
        gas : {
          price : {
            monthly : gas.cost.monthly,
            annual : gas.cost.annual
          },
          status : gas.status
        },
        tax : {
            monthly : miscCosts.tax.monthly,
            annual : miscCosts.tax.annual
        },
        insurance : {
            monthly : miscCosts.insurance.monthly,
            annual : miscCosts.insurance.annual
        },
        maintenance : {
            monthly : miscCosts.maintenance.monthly,
            annual : miscCosts.maintenance.annual
        },

        budget : {
            amount : userBudget.amount,
            frequency : userBudget.freq
        },
        
        outcome : {
            comparison : outcome.comparison,
            totalCost : {
                monthly : outcome.cost.monthly,
                annual : outcome.cost.annual
            },
        }       
    };
    // console.log("About to return" + data);
    return data;
};

module.exports = CarService;

function extractMileage (objectArray){
    var mileage =  [];
    for (var i = 0; i < objectArray.length; i++){
        var cityMileage = objectArray[i].consumption;
        var range = cityMileage[0] + cityMileage[1];
        mileage.push(Number(range));
    }    
    return mileage;
};

function getAverage(mileage){
    let averageMPG = 0;
    let gasStatus = true;
    //CALCULATE THE AVERAGE OF THE FIRST 10 LISTINGS
    for (var i = 0; i < mileage.length; i++){
        averageMPG += mileage[i];
    };

    //Do an error check in case the seller has not listed mileage data to avoid getting a NaN
    if (averageMPG === 0 || isNaN(averageMPG)){
        averageMPG = 22;
        gasStatus = false;
    } else {
        averageMPG = averageMPG/i;
    }
    let gas = {
        "average" : averageMPG,
        "status"  : gasStatus
    };
    return gas;
};  


function getGasCost(averageMPG, userMileage){
  //gasPrice here is a global variable;
    var gasCost = (gasPrice/averageMPG)*userMileage;
    return Math.round(gasCost);
};

//REDUCE THE PRICE TO THE MONTHLY PAYMENT
function reduceLoanToMonthly(pulledPrice){
    let monthlyPrice = Math.round(pulledPrice);
    //CALCULATE THE PRICE ASSUMING A 60-month loan, with 0 down payment and 4.5% interest
    let months = 60;
    let downPayment = 0;
    let interest = 0.045;
    let monthlyInterest = interest/12;
    let principal = monthlyPrice - downPayment;
    monthlyPrice = (principal * monthlyInterest)/((1-(Math.pow(1 + monthlyInterest,-months))));
    return Math.round(monthlyPrice);
};

function extractPriceToArray(objectArray){
    // console.log(`Invoked extractPriceToArray function`);
    let priceArray = [];
    for (var i = 0; i < objectArray.length; i++){
        priceArray.push(objectArray[i].price);     
    };
    // console.log("extractPriceToArray about to return" + priceArray);
    return priceArray;
};


//CALCULATE THE AVERAGE OF THE ARRAY
function calculateArrayAverage(priceArray){
    let totalPrice = 0;
    for (var i = 0; i < priceArray.length; i++){
        totalPrice += priceArray[i];
        //FINAL AVERAGE PRICE FOR THE CAR, ROUNDING IT UP WITH A NICE FUNCTION
        pulledPrice = Math.round(totalPrice/priceArray.length);
    };          
    // console.log("The average pulled price is $ " + pulledPrice);
    return pulledPrice;
};