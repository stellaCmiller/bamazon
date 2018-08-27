/*Dependencies*/
const mysql = require ('mysql');
const inquirer = require ('inquirer');

/*Global Variables */
const itemIDs = [];

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
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addStock();
                break;
            case "Add New Product":
                addProduct();
                break;
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

//Displays information of only low stock items
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

//First queries the list of item IDs to provide a list for the user, then updates stock for that ID
function addStock(){
    connection.query('SELECT item_id FROM products', function(err, res, fields) {
        if (err) throw err;
        res.forEach(e => {
            itemIDs.push(String(e.item_id));
        });
        inquirer.prompt([
            {
                type: "list",
                name: "item_id",
                message: "Please select the item_id you'd like to add more of: ",
                choices: itemIDs
            },
            {
                type: "input",
                name: "quantity",
                message: "Please input the number of units you'd like to add: ",
                validate: value => {return (Number.isInteger(parseInt(value)) ? true : "Please enter a number");}
            }
        ]).then(answers => {
            connection.query(`UPDATE products SET stock_quantity = ((SELECT stock_quantity WHERE item_id = ${answers.item_id}) + (${answers.quantity})) WHERE item_id = ${answers.item_id};`, function(err, res, fields){
                console.log("Success! You've successfully updated stock.");
                doMore();
            });
        });
    });
}

//Prompts the user to add a completely new product to the products table
function addProduct(){
    inquirer.prompt([
        {
            type: "input",
            name: "product_name",
            message: "Please enter the name of the product you'd like to add: "
        },
        {
            type: "input",
            name: "department",
            message: "Please enter the name of the department this item belongs too: "
        },
        {
            type: "input",
            name: "price",
            message: "Please enter the price of each item: ",
            validate: value => {return ((parseFloat(value)) ? true : "Please enter a number");}
        },
        {
            type: "input",
            name: "stock",
            message: "Please enter the number of items to add: ",
            validate: value => {return (Number.isInteger(parseInt(value)) ? true : "Please enter a number");}
        }
    ]).then(answers => {
        connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) 
        VALUES ("${answers.product_name}", "${answers.department}", ${answers.price}, ${answers.stock})`, function(err, res, fields) {
            if (err) throw err;
            console.log("Thank you! You've successfully added a new product.");
            doMore();
        });
    });
    
}

//Perform another action?
function doMore(){
    inquirer.prompt([{
        type: "confirm",
        name: "runagain",
        message: "Would you like to do something else?"
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