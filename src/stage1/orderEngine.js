const { customers, products, orders } = require('../utils/loadData');

function calculateSubtotal(order, productList) {
  let subtotal = 0;
  for (const item of order.items) {
    const product = productList.find(p => p.id === item.productId);
    subtotal += product.price * item.quantity;
  }
  return subtotal;
}

function calculateDiscount(subtotal) {
  if (subtotal >= 5000) {
    return subtotal * 0.10;
  } else if (subtotal >= 2000) {
    return subtotal * 0.05;
  } else {
    return 0;
  }
}

const calculateTax = (discountedSubtotal) => {
  return discountedSubtotal * 0.18;
};

function calculateTotal(order, productList) {
  const subtotal = calculateSubtotal(order, productList);
  const discount = calculateDiscount(subtotal);
  const discountedSubtotal = subtotal - discount;
  const tax = calculateTax(discountedSubtotal);
  const total = discountedSubtotal + tax;

  return { subtotal, discount, tax, total };
}

function generateOrderSummary(order, customerList, productList) {
  const customer = customerList.find(c => c.id === order.customerId);
  const totals = calculateTotal(order, productList);

  const itemDetails = order.items.map(item => {
    const product = productList.find(p => p.id === item.productId);
    return {
      productId: item.productId,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      lineTotal: product.price * item.quantity
    };
  });

  return {
    orderId: order.id,
    customerName: customer.name,
    status: order.status,
    paymentStatus: order.paymentStatus,
    items: itemDetails,
    subtotal: totals.subtotal,
    discount: totals.discount,
    tax: totals.tax,
    total: totals.total
  };
}

function getOrderById(orderId, orderList) {
  return orderList.find(o => o.id === orderId);
}

function getOrdersByCustomer(customerId, orderList) {
  return orderList.filter(o => o.customerId === customerId);
}

module.exports = {
  calculateSubtotal,
  calculateDiscount,
  calculateTax,
  calculateTotal,
  generateOrderSummary,
  getOrderById,
  getOrdersByCustomer
};