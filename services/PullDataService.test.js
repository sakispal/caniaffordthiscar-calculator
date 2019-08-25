const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const PullDataService = require ("./PullDataService")
const Car = require('../models/carSchema');

const pullDataService = new PullDataService();


mongoose.connect("mongodb://localhost/caniaffordthiscar");

var userFail = {
    "make": "BMW",
    "model": "6 Series",
    "year": "2018",
    "budget": "5008",
    "frequency": "monthly",
    "mileage": "72500",
    "car": "2018 BMW 6 Series"
}

var userPass = {
    "make": "Audi",
    "model": "A4",
    "year": "2010",
    "budget": "500",
    "frequency": "monthly",
    "mileage": "8500",
    "car": "2010 Audi A4"
};

// describe('Search by test user', function(){
// 	it('should return a valid comparison outcome', async function(){

// 		const res = await pullDataService.fullListing(userPass);
		
	
// 	});
// });

const outcome =  {
    "car": "2010 Audi A4",
    "mileage": "8500",
    "listing": [
        "https://www.truecar.com/used-cars-for-sale/listing/WAUBFAFL5AN034208/2010-Audi-A4/",
    ],
    "price": {
        "monthly": 155,
        "annual": 1860,
        "pulled": 8306,
        "status": true
    },
    "gas": {
        "price": {
            "monthly": 86,
            "annual": 1028
        },
        "status": true
    },
    "tax": {
        "monthly": 73,
        "annual": 875
    },
    "insurance": {
        "monthly": 108,
        "annual": 1296
    },
    "maintenance": {
        "monthly": 47,
        "annual": 565
    },
    "budget": {
        "amount": "500",
        "frequency": "monthly"
    },
    "outcome": {
        "comparison": "affordable",
        "totalCost": {
            "monthly": 469,
            "annual": 5624
        }
    }
};


var testSchema = {
	make : ["Acura", "BMW", "Audi"],
	model : [
		'Rapide S',
		'Vanquish S',
		'DB11',
		'DB7',
		'Arnage',
		'Continental GT',
		'Flying Spur',
		'Continental Supersports',
		'Mulsanne',
		'Brooklands',
		'Azure',
		'Bentayga',
		'500',
		'124 Spider',
		'500X',
		'500L',
		'A4',
		'A3',
		'A5',
		'TT',
		'Q7',
		'Q5',
		'A6',
		'A8',
		'S4',
		'Q3',
		'S5',
		'allroad',
		'S6',
		'A7',
		'SQ5',
		'S3',
		'RS 5',
		'TTS',
		'A4 allroad',
		'S7',
		'RS 3',
		'Cabriolet',
		'S8',
		'RS 4',
		'RS6',
		'TT RS',
		'R8',
		'RS 7',
		'i3',
		'3 Series',
		'5 Series',
		'X3',
		'X1',
		'1 Series',
		'X5',
		'Z4',
		'7 Series',
		'4 Series',
		'2 Series',
		'6 Series',
		'M3',
		'X2',
		'X4',
		'X5 M',
		'X6',
		'M4',
		'M5',
		'Z3',
		'X6 M',
	],
	year : ['2013', '2014', '2015', '2016', '2017', '2018', '2019']
}