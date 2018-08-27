/*Dependencies*/
const mysql = require ('mysql');
const inquirer = require ('inquirer');
const table = require ('console.table');

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

function supervisorMenu(){
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "Welcome Supervisor! What would you like to do today?",
            choices: [
                "View Sales By Department",
                "Create New Department"
            ]
        }
    ]).then(answers => {
        switch(answers.menu){
            case "View Sales By Department":
                viewSales();
                break;
            case "Create New Department":
                addDepartment();
                break;
        }
    })
}

function viewSales(){
    connection.query(`SELECT d.department_id, d.department_name, d.over_head_costs, SUM(product_sales) AS product_sales, SUM(p.product_sales)- d.over_head_costs AS total_profit FROM departments d LEFT JOIN products p ON d.department_name = p.department_name GROUP BY department_name ORDER BY department_id;`, function(e, r, f){
        if (e) throw e;
        console.table(r);
        doMore();
    });
}

function addDepartment(){
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What's the name of the department you'd like to add?"
        },
        {
            type: "input",
            name: "overhead",
            message: "What are the overhead costs?",
            validate: value => {return (Number.isInteger(parseInt(value)) ? true : "Please enter a number");}
        }
    ]).then(answers => {
        connection.query(`INSERT INTO departments (department_name, over_head_costs) VALUES ("${answers.department}",${answers.overhead})`, function(e, r, f){
            if (e) throw e;
            console.log("Successfully updated departments!");
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
            supervisorMenu();
        } else {
            console.log("\n ~~ Goodbye! ~~")
            connection.end();
        }
    })
}

supervisorMenu();