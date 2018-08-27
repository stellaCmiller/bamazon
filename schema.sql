DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(30),
    price FLOAT(7, 2),
    product_sales FLOAT(10, 2),
    stock_quantiy INT(11)
);

ALTER TABLE products AUTO_INCREMENT = 1000;

CREATE TABLE departments(
    department_id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL,
    over_head_costs INT(11) NOT NULL
);

ALTER TABLE departments AUTO_INCREMENT = 2000;