const inquirer = require("inquirer");
const mysql = require("mysql");

let store;

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
    console.log("\n--------------------------");
    console.log("id |  name  |  dept  |  price  | quant ");
    console.log("--------------------------\n");

    for (i = 0; i < results.length; i++) {
      console.log(
        results[i].id +
          " " +
          results[i].name +
          " | " +
          results[i].dept +
          " | " +
          results[i].price +
          " | " +
          results[i].quant
      );
      store = results;
    }
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
    .then(answers => {
      // Use user feedback for... whatever!!
      storeChecker(answers);
    });
};

storeChecker = answers => {
  //needs to check the users input
  //compare to the input in the table
  for (i = 0; i < store.length; i++) {
    if (answers.name === store[i].name && answers.quantity <= store[i].quant) {
      console.log(
        "Awesome! Here is your" + answers.quantity + " " + answers.name + "s"
      );
    } else if (
      answers.name === store[i].name &&
      answers.quantity > store[i].quant
    ) {
      console.log(
        "We're sorry, we do not have " +
          answers.quantity +
          " of our " +
          answers.name +
          ".\n Please come again soon!"
      );
    } else {
      console.log(
        "We're sorry, but we do not have that item yet. Go to Walmart or something."
      );
    }
  }
};
