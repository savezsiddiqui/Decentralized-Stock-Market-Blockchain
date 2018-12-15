var express = require('express');
const Web3 = require('web3');
const web3 = new Web3();
var bodyParser = require('body-parser');
var path = require("path");
var app = express();
var solc = require('solc');
var fs = require('fs');
//var users = ["admin","adr1", "adr2", "adr3"]
//var pass = [0, 1, 2, 3]
var flag = 0;
var contracts = [];
var loggedInUser = "Default";
var receiverAddr = "0xF4Ba3Ccc5d7BB56aAaC04c0a30B74c099b59f03B";
var senderAddr = "";


var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;


MongoClient.connect('mongodb://localhost:27017/stockexchange', (err, db) => {
  if (err) throw err

  db = db.db("stockexchange");
  
  db.listCollections().toArray(function (err, result) {
	if (err) throw err
 
	console.log(result);
	
	var cursor = db.collection('users').find({});
	
	cursor.forEach(function(user) {
		
	});
  })
});

//var abi = require("./Abi.json");

app.use(bodyParser.urlencoded({ extended: true}));

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))

var curUserAddr = web3.eth.accounts[0];
web3.eth.defaultAccount = web3.eth.accounts[0];  //Needed to get rid of the "invalid address" problem otherwise an address has to be used in the solidity code to solve this issue
												 //Probably means the sol code needs to change and be adapted to this so that the logged-in user can interact instead of the user at [0]
var _stockName = "Stock" ;
var _stockAmount = 1000 ;
var stock_marketContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"target_stock_name","type":"string"},{"name":"target_stock_amount","type":"uint32"}],"name":"sell_stock","outputs":[{"name":"","type":"string"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_stockName","type":"string"}],"name":"validStock","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"printStockName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"printStockAmount","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"target_stock_name","type":"string"},{"name":"target_stock_amount","type":"uint32"},{"name":"_receiverAddr","type":"address"}],"name":"buy_stock","outputs":[{"name":"","type":"string"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"stockName","type":"string"},{"name":"currentUserAddress","type":"address"}],"name":"ownedStockAmounts","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_stockName","type":"string"},{"name":"_stockAmount","type":"uint32"}],"payable":true,"stateMutability":"payable","type":"constructor"}]);
var stock_market = stock_marketContract.new(
   _stockName,
   _stockAmount,
   {
     from: curUserAddr, 
     data: '0x6080604052604051610f42380380610f4283398101806040528101908080518201929190602001805190602001909291905050508160019080519060200190610049929190610071565b50806000806101000a81548163ffffffff021916908363ffffffff1602179055505050610116565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100b257805160ff19168380011785556100e0565b828001600101855582156100e0579182015b828111156100df5782518255916020019190600101906100c4565b5b5090506100ed91906100f1565b5090565b61011391905b8082111561010f5760008160009055506001016100f7565b5090565b90565b610e1d806101256000396000f300608060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806321aa49b21461007d57806338209622146101625780634857b96a146101e3578063522fd67214610273578063aefea9a7146102aa578063ba63bcc4146103af575b600080fd5b6100e7600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803563ffffffff169060200190929190505050610458565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561012757808201518184015260208101905061010c565b50505050905090810190601f1680156101545780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561016e57600080fd5b506101c9600480360381019080803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506107ab565b604051808215151515815260200191505060405180910390f35b3480156101ef57600080fd5b506101f861089b565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561023857808201518184015260208101905061021d565b50505050905090810190601f1680156102655780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561027f57600080fd5b5061028861093d565b604051808263ffffffff1663ffffffff16815260200191505060405180910390f35b610334600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803563ffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610956565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610374578082015181840152602081019050610359565b50505050905090810190601f1680156103a15780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156103bb57600080fd5b50610436600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c76565b604051808263ffffffff1663ffffffff16815260200191505060405180910390f35b6060610463836107ab565b80156104f657506003836040518082805190602001908083835b6020831015156104a2578051825260208201915060208101905060208303925061047d565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060009054906101000a900463ffffffff1663ffffffff168263ffffffff1611155b156106bb57816000809054906101000a900463ffffffff16016000806101000a81548163ffffffff021916908363ffffffff160217905550816003846040518082805190602001908083835b6020831015156105675780518252602082019150602081019050602083039250610542565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060008282829054906101000a900463ffffffff160392506101000a81548163ffffffff021916908363ffffffff1602179055506040805190810160405280601081526020017f5375636365737366756c2073616c65210000000000000000000000000000000081525060029080519060200190610618929190610d4c565b5060028054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106af5780601f10610684576101008083540402835291602001916106af565b820191906000526020600020905b81548152906001019060200180831161069257829003601f168201915b505050505090506107a5565b6040805190810160405280601281526020017f556e7375636365737366756c2073616c6521000000000000000000000000000081525060029080519060200190610706929190610d4c565b5060028054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561079d5780601f106107725761010080835404028352916020019161079d565b820191906000526020600020905b81548152906001019060200180831161078057829003601f168201915b505050505090505b92915050565b60008060009050826040518082805190602001908083835b6020831015156107e857805182526020820191506020810190506020830392506107c3565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902060001916600160405180828054600181600116156101000203166002900480156108765780601f10610854576101008083540402835291820191610876565b820191906000526020600020905b815481529060010190602001808311610862575b5050915050604051809103902060001916141561089257600190505b80915050919050565b606060018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109335780601f1061090857610100808354040283529160200191610933565b820191906000526020600020905b81548152906001019060200180831161091657829003601f168201915b5050505050905090565b60008060009054906101000a900463ffffffff16905090565b6060610961846107ab565b801561098a57508263ffffffff166000809054906101000a900463ffffffff1663ffffffff1610155b15610b8557826000809054906101000a900463ffffffff16036000806101000a81548163ffffffff021916908363ffffffff160217905550826003856040518082805190602001908083835b6020831015156109fb57805182526020820191506020810190506020830392506109d6565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060008282829054906101000a900463ffffffff160192506101000a81548163ffffffff021916908363ffffffff1602179055506040805190810160405280601481526020017f5375636365737366756c2070757263686173652100000000000000000000000081525060029080519060200190610aac929190610d4c565b508173ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051600060405180830381858888f193505050505060028054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610b795780601f10610b4e57610100808354040283529160200191610b79565b820191906000526020600020905b815481529060010190602001808311610b5c57829003601f168201915b50505050509050610c6f565b6040805190810160405280601681526020017f556e7375636365737366756c207075726368617365210000000000000000000081525060029080519060200190610bd0929190610d4c565b5060028054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610c675780601f10610c3c57610100808354040283529160200191610c67565b820191906000526020600020905b815481529060010190602001808311610c4a57829003601f168201915b505050505090505b9392505050565b6000801515610c84846107ab565b1515148015610cbe57508173ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff16145b15610cc857600080fd5b6003836040518082805190602001908083835b602083101515610d005780518252602082019150602081019050602083039250610cdb565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060009054906101000a900463ffffffff16905092915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610d8d57805160ff1916838001178555610dbb565b82800160010185558215610dbb579182015b82811115610dba578251825591602001919060010190610d9f565b5b509050610dc89190610dcc565b5090565b610dee91905b80821115610dea576000816000905550600101610dd2565b5090565b905600a165627a7a72305820788f519dd0d8df0aba799d1b2af0683c793e71228c1bd66e2135e51ea87cbf2f0029', 
     gas: 3000000
   }, function(e, contract){
    console.log(e, contract);
    if (typeof contract.address != 'undefined') {
        console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
})

contracts.push(stock_market);

//var contract = new web3.eth.Contract(abi);

//contract.deploy().send();



app.post('/submit-form', (req, res) => {
    const submittedAddress = req.body.user;
    const submittedPassword = req.body.password;
	var contract;
	
	MongoClient.connect('mongodb://localhost:27017/stockexchange', function(err, mongoclient) {
		
		var db = mongoclient.db("stockexchange");
		var cursor = db.collection('users').find({});
		
		contract = cursor.forEach(function(user) {
			if (user.address == submittedAddress && user.password == submittedPassword) {
				flag = 1;
				loggedInUser = user;
				curUserAddr = user.address;
				senderAddr = user.address;
				web3.eth.defaultAccount = curUserAddr;
				console.log("default account",web3.eth.defaultAccount);
				console.log("You have successfully logged in.");
				if (user.isAdmin == 1) {
					res.redirect("/AdminSettings")
				} else {
					res.redirect("/ValidatedUser")
				}
			} else {
				console.log("Such a user was not found in our database. Please try again.");
            }        
		});
		contracts.push(contract);
	});
	
/*
    var contract = users.forEach( function (user, index) {
        if(user == submittedAddress && pass[index] == submittedPassword){
            flag = 1;
            //res.sendFile(path.join(__dirname + '/Validated.html'));
            loggedInUser = user;
            if(user.localeCompare("admin") == 0){
                res.redirect("/AdminSettings")
            }
            else{
                res.redirect("/ValidatedUser")
            }
            //res.send("/ValidatedUser")
        }
    });
*/
    setTimeout(function() { if(flag == 0){
        res.send("Invalid user")
        flag = 1 
    } }, 10000);

    setTimeout(function() { flag = 0 }, 10000);

    setTimeout(function() { res.end() }, 10000);
})

app.post('/buyStock', (req, res) => {
    const requestedStock = req.body.buyName;
    const requestedBuyAmount = parseInt(req.body.buyAmount);
    console.log(requestedStock, requestedBuyAmount);
    stock_market.buy_stock(requestedStock, requestedBuyAmount, receiverAddr);
	var stockAmountAfterPurchase = 0;
	var ownedStockAmountAfterPurchase = 0;
	
	MongoClient.connect('mongodb://localhost:27017/stockexchange', function(err, mongoclient) {
		
		var db = mongoclient.db("stockexchange");
		var cursor = db.collection('stocks').find({});
		
		cursor.forEach(function(stock) {
			if (stock.stock_name.localeCompare(requestedStock) == 0) {
				console.log(stock.stock_amount, requestedBuyAmount);
				stockAmountAfterPurchase = stock.stock_amount - requestedBuyAmount;
				console.log(stockAmountAfterPurchase);
			}
		});
		
		var cursor = db.collection('users').find({});
		
		cursor.forEach(function(user) {
			if (user.address == curUserAddr) {
				ownedStockAmountAfterPurchase = user.ownedStockAmount + requestedBuyAmount;
				console.log("owned:",ownedStockAmountAfterPurchase);
			}
		});
		
		setTimeout(function() { db.collection('stocks').updateOne({"stock_name":requestedStock},{$set:{"stock_amount":stockAmountAfterPurchase}}) }, 5000);
		setTimeout(function() { db.collection('users').updateOne({"address":curUserAddr},{$set:{"ownedStockAmount":ownedStockAmountAfterPurchase}}) }, 5000);
		
	});
	
	console.log("Rerouting you back to user home page in 3 seconds!")
	
	var value = stock_market.printStockAmount();
	var name = stock_market.printStockName();
	
	setTimeout(function() { res.render('Validated.ejs', { stockName: name, stockVal: value, currUser: loggedInUser}) }, 3000);	
})

app.post('/sellStock', (req, res) => {
    const requestedStock = req.body.sellName;
    const requestedSellAmount = parseInt(req.body.sellAmount);
    stock_market.sell_stock(requestedStock,requestedSellAmount);
	var stockAmountAfterSale = 0;
	
	MongoClient.connect('mongodb://localhost:27017/stockexchange', function(err, mongoclient) {
		
		var db = mongoclient.db("stockexchange");
		var cursor = db.collection('stocks').find({});
		
		cursor.forEach(function(stock) {
			if (stock.stock_name.localeCompare(requestedStock) == 0) {
				console.log(stock.stock_amount, requestedSellAmount);
				stockAmountAfterSale = stock.stock_amount + requestedSellAmount;
				console.log(stockAmountAfterSale);
			}
		});
		
		setTimeout(function() { db.collection('stocks').updateOne({"stock_name":requestedStock},{$set:{"stock_amount":stockAmountAfterSale}}) }, 5000);
		
	});
	
	console.log("Rerouting you back to user home page in 3 seconds!")
	
	var value = stock_market.printStockAmount();
	var name = stock_market.printStockName();
	
	setTimeout(function() { res.render('Validated.ejs', { stockName: name, stockVal: value, currUser: loggedInUser}) }, 3000);	
})

app.post('/addStock', (req, res) => {
    var stockToAdd = req.body.stockName;
    var amountToAdd = req.body.stockAmount;
    stock_marketContract.new(
    stockToAdd,
    amountToAdd,
   {
     from: web3.eth.accounts[0], 
     data: '6080604052604051610eeb380380610eeb83398101806040528101908080518201929190602001805190602001909291905050508160019080519060200190610049929190610071565b50806000806101000a81548163ffffffff021916908363ffffffff1602179055505050610116565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100b257805160ff19168380011785556100e0565b828001600101855582156100e0579182015b828111156100df5782518255916020019190600101906100c4565b5b5090506100ed91906100f1565b5090565b61011391905b8082111561010f5760008160009055506001016100f7565b5090565b90565b610dc6806101256000396000f300608060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806321aa49b21461007d57806323dd53f91461016257806338209622146102475780634857b96a146102c8578063522fd67214610358578063ba63bcc41461038f575b600080fd5b6100e7600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803563ffffffff169060200190929190505050610438565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561012757808201518184015260208101905061010c565b50505050905090810190601f1680156101545780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101cc600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803563ffffffff16906020019092919050505061078b565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561020c5780820151818401526020810190506101f1565b50505050905090810190601f1680156102395780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561025357600080fd5b506102ae600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610a74565b604051808215151515815260200191505060405180910390f35b3480156102d457600080fd5b506102dd610b64565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561031d578082015181840152602081019050610302565b50505050905090810190601f16801561034a5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561036457600080fd5b5061036d610c06565b604051808263ffffffff1663ffffffff16815260200191505060405180910390f35b34801561039b57600080fd5b50610416600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c1f565b604051808263ffffffff1663ffffffff16815260200191505060405180910390f35b606061044383610a74565b80156104d657506003836040518082805190602001908083835b602083101515610482578051825260208201915060208101905060208303925061045d565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060009054906101000a900463ffffffff1663ffffffff168263ffffffff1611155b1561069b57816000809054906101000a900463ffffffff16016000806101000a81548163ffffffff021916908363ffffffff160217905550816003846040518082805190602001908083835b6020831015156105475780518252602082019150602081019050602083039250610522565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060008282829054906101000a900463ffffffff160392506101000a81548163ffffffff021916908363ffffffff1602179055506040805190810160405280601081526020017f5375636365737366756c2073616c652100000000000000000000000000000000815250600290805190602001906105f8929190610cf5565b5060028054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561068f5780601f106106645761010080835404028352916020019161068f565b820191906000526020600020905b81548152906001019060200180831161067257829003601f168201915b50505050509050610785565b6040805190810160405280601281526020017f556e7375636365737366756c2073616c65210000000000000000000000000000815250600290805190602001906106e6929190610cf5565b5060028054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561077d5780601f106107525761010080835404028352916020019161077d565b820191906000526020600020905b81548152906001019060200180831161076057829003601f168201915b505050505090505b92915050565b606061079683610a74565b80156107bf57508163ffffffff166000809054906101000a900463ffffffff1663ffffffff1610155b1561098457816000809054906101000a900463ffffffff16036000806101000a81548163ffffffff021916908363ffffffff160217905550816003846040518082805190602001908083835b602083101515610830578051825260208201915060208101905060208303925061080b565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060008282829054906101000a900463ffffffff160192506101000a81548163ffffffff021916908363ffffffff1602179055506040805190810160405280601481526020017f5375636365737366756c20707572636861736521000000000000000000000000815250600290805190602001906108e1929190610cf5565b5060028054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109785780601f1061094d57610100808354040283529160200191610978565b820191906000526020600020905b81548152906001019060200180831161095b57829003601f168201915b50505050509050610a6e565b6040805190810160405280601681526020017f556e7375636365737366756c2070757263686173652100000000000000000000815250600290805190602001906109cf929190610cf5565b5060028054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610a665780601f10610a3b57610100808354040283529160200191610a66565b820191906000526020600020905b815481529060010190602001808311610a4957829003601f168201915b505050505090505b92915050565b60008060009050826040518082805190602001908083835b602083101515610ab15780518252602082019150602081019050602083039250610a8c565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405180910390206000191660016040518082805460018160011615610100020316600290048015610b3f5780601f10610b1d576101008083540402835291820191610b3f565b820191906000526020600020905b815481529060010190602001808311610b2b575b50509150506040518091039020600019161415610b5b57600190505b80915050919050565b606060018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bfc5780601f10610bd157610100808354040283529160200191610bfc565b820191906000526020600020905b815481529060010190602001808311610bdf57829003601f168201915b5050505050905090565b60008060009054906101000a900463ffffffff16905090565b6000801515610c2d84610a74565b1515148015610c6757508173ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff16145b15610c7157600080fd5b6003836040518082805190602001908083835b602083101515610ca95780518252602082019150602081019050602083039250610c84565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060009054906101000a900463ffffffff16905092915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610d3657805160ff1916838001178555610d64565b82800160010185558215610d64579182015b82811115610d63578251825591602001919060010190610d48565b5b509050610d719190610d75565b5090565b610d9791905b80821115610d93576000816000905550600101610d7b565b5090565b905600a165627a7a7230582030c7f77504355c3393fd4f80d06a28c62feae9f8726741d0eeb881d87f88c57d0029', 
     gas: 3000000
   }, function(e, contract){
    console.log(e, contract);
    if (typeof contract.address != 'undefined') {
        console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })
    res.render('admin.ejs', { stockStatus: "Added Stock: " + stockToAdd + "" + amountToAdd});
})

app.get('/ValidatedUser', function(req, res){
    var value = stock_market.printStockAmount();
    console.log(value);
    var name = stock_market.printStockName();
    //var name = contract.methods.printStockName().c[0];
    res.render('Validated.ejs', { stockName: name, stockVal: value, currUser: loggedInUser});
})

app.get('/AdminSettings', function(req, res) {
    res.render('admin.ejs',{stockStatus: ""});
});

app.get('/', function(req, res) {
    res.render('index.ejs', {loginStatus: ''});
});

app.listen(5656, () => {
    console.log("Listening on port 5656")
})