//Create our prototype object
function InputService(){};
var method = InputService.prototype;

// Everytime we reload/disconnect, we want a few things to go blank
method.clearOnReload = function(){
  makeArray = [];
};


method.getBudget = function(userInputBudget, userInputFrequency){
    var budget = {
        amount : userInputBudget,
        freq : "monthly"
    };

    if (!userInputBudget || !Number(userInputBudget)){
        budget.amount = '';
    }

    if (userInputFrequency  === "annual"){
        budget.freq = "annual";
    } 

    return budget;
};

//FUNCTION THAT GETS RID OF ANNOYING ELEMENTS OF USER INPUT
method.cleanseUserInput = function(userMileage){
    var input = userMileage.replace(/,/g,"");
    return input.replace(/\./g,"");;
};


module.exports = InputService;