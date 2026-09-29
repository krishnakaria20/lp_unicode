const { customers, products } = require('../utils/loadData');
const { calculateTotal } = require('../stage1/orderEngine');

function getCustomer(customerId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const customer = customers.find(c => c.id === customerId);
      if (!customer) {
        reject(new Error('Customer not found'));
      } else {
        resolve(customer);
      }
    }, 500);
  });
}

function getProducts(productIds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundProducts = [];
      for (let i = 0; i < productIds.length; i++) {
        const product = products.find(p => p.id === productIds[i]);
        if (!product) {
          reject(new Error('Product not found: ' + productIds[i]));
          return;
        }
        foundProducts.push(product);
      }
      resolve(foundProducts);
    }, 500);
  });
}

function checkStock(items, productList) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const product = productList.find(p => p.id === item.productId);
        if (product.stock < item.quantity) {
          reject(new Error('Insufficient stock for ' + product.name));
          return;
        }
      }
      resolve(true);
    }, 500);
  });
}

function processPayment(amount) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (amount <= 0) {
        reject(new Error('Invalid payment amount'));
      } else {
        resolve({ status: 'success', amount: amount });
      }
    }, 500);
  });
}

function createOrder(customerId, items) {
  let foundProducts;

  return getCustomer(customerId)
    .then(customer => {
      const productIds = items.map(item => item.productId);
      return getProducts(productIds);
    })
    .then(productsList => {
        const foundProducts = productsList;
      return checkStock(items, foundProducts);
    })
    .then(() => {
      const totals = calculateTotal({ items }, foundProducts);
      return processPayment(totals.total);
    })
    .then(payment => {
      const newOrder = {
        id: Date.now(),
        customerId: customerId,
        items: items,
        status: 'confirmed',
        paymentStatus: 'paid'
      };
      return newOrder;
    });
}

module.exports = {getCustomer,getProducts,checkStock,processPayment,createOrder};