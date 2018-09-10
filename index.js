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
  console.log("connected as id " + connection.threadId + "\n");
  console.log("--------------------------------");
  console.log("Howdy, and welcome to Bamazon!!!");
  console.log("--------------------------------");
  showMarket();
});

//display all products on sale .... show the whole products
//table
showMarket = () => {
  connection.query("SELECT * from products", (error, results) => {
    if (error) throw error;

    store = results;

    // console.table(store);
    questions(); //put all my questions content into here
  });
};

questions = () => {
  console.table(store);
  inquirer
    .prompt([
      {
        name: "item",
        type: "list",
        message: "please enter id of the item you would like to purchase.",
        choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
      },
      {
        name: "quantity",
        type: "input",
        message: "how many of that product would you like to purchase?"
      }
    ])
    // Use user feedback for... whatever!!
    .then(function(answer) {
      let item = answer.item;

      /*if (item > 9) {
        console.log(
          "We are sorry, but there is not an item associated with that item code, please try again."
        );
        showMarket();
      } */

      if (answer.quantity <= store[item].quant) {
        total = answer.quantity * store[item].price;
        console.log("Awesome! Your total is $" + total + "!");
      }

      if (answer.quantity > store[item].quant) {
        console.log(
          "Unfortunately, we do not currently have the stock to fufil your request. We apologize for any inconvenience."
        );
      }

      inquirer
        .prompt([
          {
            name: "again",
            type: "list",
            message: "Would you like to make another purchase?",
            choices: ["yes", "no"]
          }
        ])
        // Use user feedback for... whatever!!
        .then(function(answer) {
          if (answer.again === "yes") {
            showMarket();
          } else {
            console.log(
              "Thank you for shopping at Bamazon! We hope you have a wonderful rest of your day!"
            );
            connection.end();
          }
        });
    });
};
