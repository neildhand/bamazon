// Then create a Node application called bamazonCustomer.js. 

var mysql = require("mysql");
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon"
});

connection.connect(function(err){
	if(err){
		throw err;
	}

	//Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
	connection.query("SELECT item_id, product_name, price FROM products", function(err, result, fields){
		if(err){
			throw err;
		}
		console.log(result);
	});
});
// The app should then prompt users with two messages.
var inquirer = require("inquirer");
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

function userPrompt() {

	connection.query("SELECT * FROM products", function(err, result, fields){
		if(err){
			throw err;
		}

	inquirer.prompt([
	{
		name: "askId",
		type: "input",
		message: "What is the ID of the product you would like to buy? \n",
		validate: function(value) {
			if(isNaN(value) === false) {
				return true;
			}
			else{
				return false;
			}
		}
	},
	{
		name: "askUnits",
		type: "input",
		message: "How many units of this product would you like to buy?",
		validate: function(value) {
			if(isNaN(value) === false){
				return true;
			}
			else{
				return false;
			}
		}
	}
	]).then(function(answer) {	


	//Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
		var chosenItem;
		for(var i = 0; i < result.length; i++){
			if(result[i].item_id == answer.askId) {
				chosenItem = result[i];
			}
		}
		console.log(chosenItem);

		// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

		// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
		if(answer.askUnits > chosenItem.stock_quantity){
			
			console.log("Sorry! We do not have enough of that item in stock to fulfil your order");

			userPrompt();
		}

		// However, if your store does have enough of the product, you should fulfill the customer's order.
		else{

			console.log("Awesome! We have your items in stock! \n");
			
			var diff = chosenItem.stock_quantity -= parseInt(answer.askUnits);

			console.log("Your order has been successfully placed");
			connection.query(
			"UPDATE products SET ? WHERE ?",
			[
				{
					stock_quantity:diff
				},
				{
					item_id:chosenItem.askId
				}
			],
			function(error) {
				if(error){
					throw error;
				}
				//console.log(result.affectedRows + " products changed");

				console.log(chosenItem);
				//console.log("Your order was successfully placed.");
				userPrompt();
			}
			);

		}


	});


	});
}


userPrompt();

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.

