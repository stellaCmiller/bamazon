/*Dependencies*/
const mysql = require ('mysql');
const inquirer = require ('inquirer');

/*Database info */
const connection = mysql.createConnection({
    host: "localhost",
    port: "3305",
    user: "root",
    password: "password",
    database: "bamazon"
});

/*Displays menu options */
function displayMenu(){
    inquirer.prompt([{
        type: "list",
        name: "menu",
        message: "Welcome Manager! What would you like to do today?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }]).then(answers => {
        switch (answers.menu){
            case "View Products for Sale":
                displayStock();
            case "View Low Inventory":
                lowInventory();
            case "Add to Inventory":
                addStock();
            case "Add New Product":
                addProduct();
        }
    })
}

//Displays full db information
function displayStock(){
    connection.query('SELECT * FROM products', function (err, res, fields) {
        if (err) throw err;
        res.forEach(e => {
            console.log(`${e.item_id} -- ${e.product_name} \n PRICE: ${e.price} STOCK: ${e.stock_quantity}`)
            console.log(`--------------------------`)
        });
        doMore();
    });
}

function lowInventory(){
    connection.query('SELECT * FROM products WHERE stock_quantity<=5', function(err, res, fields) {
        if (err) throw err;
        res.forEach(e => {
            console.log(`${e.item_id} -- ${e.product_name} \n PRICE: ${e.price} STOCK: ${e.stock_quantity}`)
            console.log(`--------------------------`)
        });
        doMore();
    })
}

function addStock(){
    inquirer.prompt([{
        type: "list",
        name: "item_id",
        message: "Please select the item_id you'd like to add more of: ",
        choices: "itemIDs"
    }])
    conenction.query('UPDATE products SET stock_quantity')
}

//Perform another action?
function doMore(){
    inquirer.prompt([{
        type: "confirm",
        name: "runagain",
        message: "Would you like the do something else?"
    }]).then(answers => {
        if (answers.runagain){
            displayMenu();
        } else {
            console.log("\n ~~ Goodbye! ~~")
            connection.end();
        }
    })
}

displayMenu();