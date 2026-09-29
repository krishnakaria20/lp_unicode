const fs = require('fs');
const path = require('path');

function loadJSON(fileName) {
  const filePath = path.join(__dirname, '..', '..', 'data', fileName);
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}

const customers = loadJSON('customers.json');
const products = loadJSON('products.json');
const orders = loadJSON('orders.json');

module.exports = { customers, products, orders };