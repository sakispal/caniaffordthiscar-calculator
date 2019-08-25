const Xray = require ("x-ray");
const x = Xray();

function crawlGasPrice(){
	if (process.env.NODE_ENV === "production"){
		gasCrawler(function (err, res){
			global.gasPrice = res;
			if (err){
				console.log(`Couldn't crawl gas prices, got error ${err} and had to set default gas value to 2.6$`);
			} else {
				//Has to be global
				console.log(`app.js reports gasPrice ${gasPrice}`);
			}
		});
	} else {
		global.gasPrice = 2.6;
		console.log("Default gas price is " + gasPrice);
	};
};

let gasCrawler = (callback) => {

	x("https://gasprices.aaa.com/", ".numb")
	.then(function(res)
{		callback(null, enumerateGas(res));
	})
	.catch(function(err){
		callback(err, 2.8);
	});
};

let enumerateGas = (gasPrice) => {
	let n = gasPrice.indexOf("$");
	let price = Number(gasPrice.slice(n+1, n+5));
	return price;
}

module.exports = {crawlGasPrice};

