const expect = require('expect');
const request = require('supertest');
const {app} = require('./app');
const User = require('./models/userSchema');
const {mongoose} = require("./config/mongoose");


const user = {
	working : [
		{
			"make": "Audi",
			"model": "A4",
			"year": "2010",
			"budget": "500",
			"frequency": "monthly",
			"mileage": "8500"
		},
		{
			"make": "Audi",
			"model": "A4",
			"year": "2010",
			"budget": "500",
			"frequency": "monthly",
			"mileage": "1"
		},
		{
		   	"make": "BMW",
			"model": "6 Series",
			"year": "2018",
			"budget": "500",
			"frequency": "monthly",
			"mileage": "7250"
		},
		{
		   	"make": "Ferrari",
			"model": "360",
			"year": "2005",
			"budget": "3000",
			"frequency": "annual",
			"mileage": "10000"
		}
	],
	dropdownError : [
		{
			makeOnly : {
				"make": "Audi",
				"budget": "500",
				"frequency": "monthly",
				"mileage": "8500"
			}
		},
		{
			makeModel : {
				"make": "Audi",
				"model": "A4",
				"year": "2010",
				"budget": "500",
				"frequency": "monthly",
				"mileage": "8500"
			}
		}
	],
	replaceMileage : {
	   	"make": "Ferrari",
		"model": "360",
		"year": "2005",
		"budget": "3000",
		"frequency": "annual",
		"mileage": "asfodelos"
	},
	databaseFail : {
	   	"make": "Honda",
		"model": "6 Series",
		"year": "2018",
		"budget": "500",
		"frequency": "monthly",
		"mileage": "7250"
	},
	noBudget : {
	   	"make": "Ferrari",
		"model": "360",
		"year": "2005",
		"budget": "john",
		"frequency": "annual",
		"mileage": "10,000"
	}
};


describe('POST /', function (){
	user.working.forEach((user) => {
		it('should return full car query', (done) => {
			// console.log(`user is ${JSON.stringify(user,undefined, 4)}`);
			request(app)
			.post('/')
			.send(user)
			.expect(200)
			.expect((res) => {
				expect(res.body.car).toBeTruthy();
				expect(res.body.mileage).toBe(user.mileage);
				expect(typeof res.body.listing[0]).toBe("string");
				expect(typeof res.body.price.pulled).toBe("number");
				expect(res.body.price.status).toBe(true);
				expect(typeof res.body.tax.monthly).toBe('number');
				expect(res.body.outcome.comparison).toBeTruthy();
				expect(typeof res.body.outcome.totalCost.monthly).toBe('number');
				console.log(JSON.stringify(res.body, undefined, 4));
			})
			.end((err,res) =>{
				if (err){
					return done(err);
				} 
				done();
			});		
		});
	});

	user.dropdownError.forEach((user) => {
		it('Make or model only should fail the database', (done) => {
			// console.log(`user is ${JSON.stringify(user,undefined, 4)}`);
			request(app)
			.post('/')
			.send(user)
			.expect(400)
			.end((err,res) =>{
				if (err){
					return done(err);
				} 
				done();
			});		
		});
	});
	
	it('Database should fail upon incorrect car input', (done) =>{
		// console.log(`user is ${JSON.stringify(user,undefined, 4)}`);
		request(app)
		.post('/')
		.send(user.databaseFail)
		.expect(400)
		.end((err,res) =>{
			if (err){
				return done(err);
			} 
			done();
		});	
	});
	

	it('should replace mileage with default upon wrong input', (done) =>{
		// console.log(`user is ${JSON.stringify(user.replaceMileage,undefined, 4)}`);
		request(app)
		.post('/')
		.send(user.replaceMileage)
		.expect(200)
		.expect((res) => {
			expect(res.body.mileage).toBe("10000");
			console.log(JSON.stringify(res.body, undefined, 4));
		})
		.end((err,res) =>{
			if (err){
				return done(err);
			} 
			done();
		});	
	});
	
	it('should return a listing but with undefined outcome with undefined budget', (done) => {
		request(app)
		.post('/')
		.send(user.noBudget)
		.expect(200)
		.expect((res)=>{
			expect(res.body.outcome.comparison).toBe('unspecified');
		})
		.end((err,res) =>{
			if (err){
				return done(err);
			} 
			done();
		});	
	})	
});

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