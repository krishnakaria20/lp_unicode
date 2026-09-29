const { getOrderById, getOrdersByCustomer, generateOrderSummary } = require('./src/stage1/orderEngine');
const { customers, products, orders } = require('./src/utils/loadData');
const{checkStock} = require('./src/stage3/callbackFlow.js');
const { processOrder } = require("./src/stage4/processOrder.js");

const order = getOrderById(1001, orders);
const summary = generateOrderSummary(order, customers, products);
console.log(summary);

const customerOrders = getOrdersByCustomer(2, orders);
console.log(customerOrders);

const isStockAvl = checkStock(order.items , products , (error , result) => {
    if (error) {
        console.log(error.message);
        return;
    }
     console.log("Stock checked :", result);
});
console.log(isStockAvl);


processOrder(1001)
    .then(order => {
        console.log(order);
    })
    .catch(error => {
        console.log(error.message);
    });