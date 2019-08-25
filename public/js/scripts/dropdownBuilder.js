var selectedMake = document.getElementById("makedropdown");
var selectedModel = document.getElementById("modeldropdown");

var socket = io();

//RECEIVE EMIT FROM SERVER SIDE AND RENDER TO CLIENT
socket.on('dropdown.make', (make) => {
	console.log('IO started on client');
	// console.log('Client received make list');
	//Dirty trick to avoid having an empty space for the first make
	$('#make option').remove();
	renderList(make, "make");
	$("option").toggleClass("toggle-dropdown");
});

//SOCKET.IO IMPLEMENTATION SHOULD START HERE: WE WANT THE CODE TO MAKE A REQUEST IN REAL TIME, AS SOON AS THE USER HAS SELECTED A MODEL
//EMIT FROM CLIENT SIDE TO SERVER SIDE THE CHANGE OF MAKE
selectedMake.addEventListener("change", function(){
	// console.log("Client emits selected make " + selectedMake.value);		
     //FIRST TRY IS TO EMIT THE BUILD UP URL BACK TO THE APP.
	socket.emit('selectedMake', selectedMake.value);
	//RECEIVE EMIT FROM SERVER SIDE AND RENDER TO CLIENT
	socket.on('dropdown.model', function(model){
		// console.log('Client received model list ' + model);
  		renderList(model, "model");
  	});
	//EVERYTIME WE CHANGE MAKE WE NEED TO EMPTY THE YEAR AND MODEL ARRAYS!
	$('#model option').remove();
	$('#year option').remove();
	//Here is great place to start rendering the rest of the input forms. Only upon completion of the previous one
});

//EMIT THE CHANGE OF MODELS
selectedModel.addEventListener("change", function(){
	// console.log("Client emits selected model " + selectedModel.value);		
  	//FIRST TRY IS TO EMIT THE BUILD UP URL BACK TO THE APP.
	socket.emit("selectedModel", selectedModel.value);
	//RECEIVE EMIT FROM SERVER SIDE AND RENDER TO CLIENT
	socket.on('dropdown.year', function(year){
  	renderList(year, "year");
  });
  //EVERYTIME WE CHANGE MODEL WE NEED TO EMPTY THE YEAR AND MODEL ARRAYS!
  $('#year option').remove();
});

//FUNCTION THAT TAKES AN ARRAY AND BUILDS DROPDOWNS
function renderList(array, type){
	array.forEach(function(element){
		//Sanitize the returned API element in case of API compromisation. The /s is for a white space, the /- is for a dash/hyphen
		if (element.match(/^[0-9a-zA-Z/s/-]{1,16}/)){
			var valElement = `"${element}"`;
			//EXTRACT THE VARIABLE'S NAME SO THAT WE CAN SELECT THE APPROPRIATE OBJECT WITH JQUERY
			var stringElement = `#${type}dropdown`;
			//Prevent appending any accidental white spaces
			if (element !== "" && element !== undefined && element !== null){
				//THE JQUERY ID SELECTS THE <SELECT> AND THEN ALL WE NEED TO DO IS RECURSIVELY APPEND OUR ARRAY
			  //THE STRING REGEXP IS SO COMPLICATED BECAUSE EXCEPT FOR DISPLAYING THE TEXT, WE ALSO WANT TO RETREIVE THE VALUE UPON USER SELECTION
			  $(stringElement).append(`<option value=${valElement}>${element}</option>`);
			};

		} else {
			console.log("API has been compromized, returned element to append " + element);
		}		
	});
};