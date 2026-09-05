const { getOrderById, getOrdersByCustomer, generateOrderSummary } = require('./src/stage1/orderEngine');
const { customers, products, orders } = require('./src/utils/loadData');

const order = getOrderById(1001, orders);
const summary = generateOrderSummary(order, customers, products);
console.log(summary);

const customerOrders = getOrdersByCustomer(2, orders);
console.log(customerOrders);