DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(30),
    price FLOAT(7, 2),
    stock_quantiy INT(11)
);

ALTER TABLE products AUTO_INCREMENT = 1000;