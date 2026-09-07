const { orders, customers, products } = require('../utils/loadData');
const { calculateTotal } = require('../stage1/orderEngine');

function isOrderValid(order, customerList, productList) {
  const customer = customerList.find(c => c.id === order.customerId);
  if (!customer) {
    return false;
  }

  const itemsValid = order.items.every(item => {
    const product = productList.find(p => p.id === item.productId);
    if (!product) {
      return false;
    }
    return item.quantity > 0;
  });

  return itemsValid;
}

function getAllOrderTotals(orderList, productList) {
  return orderList.map(order => {
    const totals = calculateTotal(order, productList);
    return { orderId: order.id, total: totals.total };
  });
}

function calculateTotalRevenue(orderList, productList) {
  const orderTotals = getAllOrderTotals(orderList, productList);
  return orderTotals.reduce((sum, o) => sum + o.total, 0);
}

function calculateAverageOrderValue(orderList, productList) {
  const totalRevenue = calculateTotalRevenue(orderList, productList);
  return totalRevenue / orderList.length;
}

function getHighestValueOrder(orderList, productList) {
  const orderTotals = getAllOrderTotals(orderList, productList);

  const highest = orderTotals.reduce((max, o) => {
    if (o.total > max.total) {
      return o;
    }
    return max;
  }, orderTotals[0]);

  return orderList.find(o => o.id === highest.orderId);
}

function hasHighValueOrder(orderList, productList, threshold) {
  const orderTotals = getAllOrderTotals(orderList, productList);
  return orderTotals.some(o => o.total >= threshold);
}

function areAllOrdersValid(orderList, customerList, productList) {
  return orderList.every(order => isOrderValid(order, customerList, productList));
}

module.exports = {
  getAllOrderTotals,
  calculateTotalRevenue,
  calculateAverageOrderValue,
  getHighestValueOrder,
  hasHighValueOrder,
  areAllOrdersValid
};