const inquirer = require("inquirer");
const mysql = require("mysql");

let store;
let sql;
let total;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bamazon_js"
});

connection.connect((err, response) => {
  if (err) throw err;
  showMarket();
  questions();
});

//display all products on sale .... show the whole products
//table
showMarket = () => {
  connection.query("SELECT * from products", (error, results) => {
    if (error) throw error;

    console.table(results);
    store = results;
  });
};

questions = () => {
  inquirer
    .prompt([
      {
        name: "item",
        type: "list",
        message: "please select the which item you would like to purchase.",
        choices: [
          "fruit gummies",
          "beef jerky",
          "milk",
          "vitamins",
          "shampoo",
          "chicken",
          "steak",
          "salmon",
          "broccoli",
          "carrots"
        ]
      },
      {
        name: "quantity",
        type: "input",
        message: "how many of that product would you like to purchase?"
      }
    ])
    // Use user feedback for... whatever!!
    .then(function(answer) {
      sql = "SELECT id, price, stock";
      sql += "FROM products";
      sql += "WHERE id = ?";
      connection.query(sql, answer.item, (err, result) => {
        if (answer.quanity > store[0].quant) {
          console.log(
            "We're sorry, but we do not have the sufficient quantities to fufill your order."
          );
        } else {
          console.log(
            "Thank you for shopping at our store. Your total for today is: $" +
              total
          );
        }
      });
    });
};
/*
storeChecker = answers => {
  //needs to check the users input
  //compare to the input in the table
  for (i = 0; i < store.length; i++) {
    if (answers.name === store[i].name && answers.quantity <= store[i].quant) {
      console.log(
        "Awesome! Here is your" + answers.quantity + " " + answers.name + "s"
      );
    }

    return console.log("sorry, we could not process your order");
  }
};
*/
