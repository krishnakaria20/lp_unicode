const { customers, products } = require("../utils/loadData.js");
const { calculateTotal } = require("../stage1/orderEngine.js");

function getCustomer(customerId , onCustomerFetched){
    setTimeout(() => {
        const customer = customers.find(c => c.id === customerId);

        if(!customer){
            onCustomerFetched(new Error("Customer not found"));
        }
        else{
            onCustomerFetched(null , customer);
        }
    } , 500);
}


function getProducts(productIds , onProductsFetched){
    setTimeout(() => {
        const foundProducts = [];

        for(let i=0 ; i<productIds.length ; i++){
            const productId = productIds[i];

            const product = products.find(p => p.id === productId);

            if(!product){
                onProductsFetched(new Error("Product not found : " + productId));
                return;
            }
            foundProducts.push(product);
        }

        onProductsFetched(null , foundProducts);
    } , 500);
}

function checkStock(items , productList , onStockChecked){
    setTimeout(() => {
        for(let i=0 ; i<items.length ; i++){
            const item = items[i];

            const product = productList.find(p => p.id === item.productId);
            if(product.stock<item.quantity){
                onStockChecked(new Error("Insufficient stock for : " + product.name));
                return;
            }
        }
        onStockChecked(null , true);
    } , 500);
}

function processPayment(amount , onPaymentProcessed){
    setTimeout(() => {
        if(amount<=0){
            onPaymentProcessed(new Error("Invalid payment amount"));
        }
        else{
            onPaymentProcessed(null , {status : "success" , amount : amount});
        }
    } , 500);
}

function createOrder(customerId, items, onOrderCreated) {
  getCustomer(customerId, function onCustomerFetched(err, customer) {
    if (err) {
      onOrderCreated(err);
      return;
    }

    const productIds = items.map(item => item.productId);

    getProducts(productIds, function onProductsFetched(err, foundProducts) {
      if (err) {
        onOrderCreated(err);
        return;
      }

      checkStock(items, foundProducts, function onStockChecked(err) {
        if (err) {
          onOrderCreated(err);
          return;
        }

        const totals = calculateTotal({ items: items }, foundProducts);

        processPayment(totals.total, function onPaymentProcessed(err, payment) {
          if (err) {
            onOrderCreated(err);
            return;
          }

          const newOrder = {
            id: Date.now(),
            customerId: customerId,
            items: items,
            status: 'confirmed',
            paymentStatus: 'paid'
          };

          onOrderCreated(null, newOrder);
        });
      });
    });
  });
}

module.exports = {
  getCustomer,
  getProducts,
  checkStock,
  processPayment,
  createOrder
};