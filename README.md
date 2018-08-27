# CLI Marketplace - "🅱️amazon"

Bamazon is a simple CLI app that lets customers purchase items from "Bamazon", the cool hip younger brother of amazon.com. This project uses a MySQL database to keep track of products and customer orders. In addition to purchasing from bamazon, the app features a manager view and supervisor view to perform more advanced functions such as adding more stock, creating new items to sell, and keeping track of profit margins.

## Customer View
![customer view](./readmepics/CustomerView.PNG) <br>
When you initialize the app by calling ```node BamazonCustomer.js```as a customer, you'll be shown a list of products availale for purchase along with their ID and price. You'll then be prompted to select the id of the item you'd like to purchase and how many.
<br>
![customer purchase](./readmepics/CustomerPurchase.PNG)
<br>
![complete purchase](./readmepics/completePurchase.PNG) <br>
Once you make your order, you'll be shown the total cost of your purchase and given a log out message. The products database will update, depleting the stock accordingly. If you attempt to order more items than there are available, you'll be prompted to try again: <br>
![lowstock](./readmepics/lowstockCustomer.PNG)

## Manager Views
