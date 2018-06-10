var inquirer = require("inquirer");

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bamazon'
});

connection.connect(function (error) {
  if (error) throw error;
});

connection.query("SELECT item_id, product_name, price FROM products", function (error, results) {
  if (error) throw error;
  console.log("PRODUCTS FOR SALE: " + JSON.stringify(results));
  runSearch();
});

//connection.end();

function runSearch() {
  inquirer
    .prompt({
      name: "item_id",
      type: "input",
      message: "What is the item ID for the product you're interested in purchasing?"
    })
    .then(function (answer) {
      var query = "SELECT stock_quantity FROM products WHERE ?";
      connection.query(query, { item_id: answer.item_id }, function (err, res) {

        console.log("The remaining quantity is " + res[0].stock_quantity + ".");
        inventoryCheck(answer);
      });
    })
}

function inventoryCheck(id) {
  inquirer
    .prompt({
      name: "quantity",
      type: "input",
      message: "How many would you like to purchase?"
    })
    .then(function (answer) {
      //console.log("id.item_id", id.item_id);
      //console.log("answer.quantity", answer.quantity);

      var query1 = "SELECT * FROM products WHERE item_id = ?"
      connection.query(query1, [id.item_id], function (err, res) {
        //console.log(res);

        //console.log("answer", answer.quantity);
        //console.log(res[0].stock_quantity);
        if (answer.quantity < res[0].stock_quantity) {
          var query2 = "UPDATE products SET stock_quantity = " + (res[0].stock_quantity - answer.quantity) + " WHERE item_id =" + id.item_id;
          //console.log(answer.quantity);
          //console.log(id);

          connection.query(query2, function (err, result) {
            console.log("The total price of your order comes to $" + (answer.quantity * res[0].price) + ".");
            //console.log(result);
          })
        } else {
          console.log("INSUFFICIENT QUANTITY!!!!");
        }
      });
    });
}