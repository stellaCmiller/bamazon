/*Dependencies*/
const mysql = require ('mysql');
const inquirer = require ('inquirer');

/*Global Variables*/
const stock = [];

/*Database info */
const connection = mysql.createConnection({
    host: "localhost",
    port: "3305",
    user: "root",
    password: "password",
    database: "bamazon"
});

/*Connect to the mySQL server */
connection.connect(function(err){
    if (err) throw err;
});

/*Displays items available to purchase to the customer */
function displayStock(){
    connection.query('SELECT item_id, product_name, price FROM products', function (err, res, fields) {
        if (err) throw err;
        res.forEach(e => {
            stock.push(String(e.item_id));
            console.log(`${e.item_id} -- ${e.product_name} \n PRICE: ${e.price}`)
            console.log(`--------------------------`)
        });
    });
}

function askForOrder() {
    inquirer.prompt([
        {
            type: "list",
            name: "productID",
            message: "Please select the ID of the item you'd like to purchase: ",
            choices: stock
        },
        {
            name: "quantity",
            message: "How many would you like to buy?",
            validate: value => {return (Number.isInteger(parseInt(value)) ? true : "Please enter a number");}
        }
    ]).then(answers => {
        purchase(answers);
    });
}

/*Checks user input against the database and either confirms or denies purchase*/
function purchase(item){
    connection.query('SELECT stock_quantity, product_name, price FROM products WHERE item_id='+item.productID, function (err, res, fields) {
        if (err) throw err;
        let currentStock = res[0].stock_quantity;
        if (item.quantity >= currentStock){
            console.log("Sorry, we do not have enough of that item in stock to fulfill your order. Please try again. \n");
            return askForOrder();
        } else {
            let total = item.quantity * res[0].price;
            console.log(`Nice choice! You have purchased ${item.quantity} ${res[0].product_name} for a total price of ${total}`);
            connection.query(`UPDATE products SET stock_quantity=${currentStock-item.quantity} WHERE item_id=`+item.productID, function(err, res, fields){
                if (err) throw err;
                connection.query(`UPDATE products SET product_sales = ((SELECT product_sales WHERE item_id = ${item.productID}) +(${total})) WHERE item_id = ${item.productID};`, function(e, r, f){
                    if (e) throw e;
                    console.log("Stock and sales updated");
                    logOut();
                })
            })
        }
    });
}

function logOut(){
    console.log(`\n Thanks for stopping by! Please come again :D`);
    connection.end();
}

//-----MAIN-----
console.log(`\n\n✮✮✮ Welcome to Stella's Meme Variety Shop!!✮✮✮\n`);
displayStock();
setTimeout(function(){askForOrder()}, 100);





