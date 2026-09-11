const { orders } = require("../utils/loadData.js");
const { calculateTotal , getOrderById } = require("../stage1/orderEngine.js");
const { getCustomer , getProducts , checkStock , processPayment } = require("../stage3/promiseFlow.js");

class CustomerNotFoundError extends Error {
    constructor(message){
        super(message);
        this.name = "CustomerNotFoundError";
    }
}

class ProductNotFoundError extends Error {
    constructor(message){
        super(message);
        this.name = "ProductNotFoundError";
    }
}

class InsufficientStockError extends Error {
    constructor(message){
        super(message);
        this.name = "InsufficientStockError";
    }
}

class InvalidOrderError extends Error {
    constructor(message){
        super(message);
        this.name = "InvalidOrderError";
    }
}

async function processOrder(orderId){
    const order = getOrderById(orderId , orders);

    if(!order){
        throw new InvalidOrderError("Order with id " + orderId + " does not exist");
    }

    try{
        let customer;
        try{
            customer = await getCustomer(order.customerId);
        }
        catch(err){
            throw new CustomerNotFoundError(err.message);
        }

        const productIds = order.items.map(item => item.productId);

        let foundProducts;
        try{
            foundProducts = await getProducts(productIds);
        }
        catch(err){
            throw new ProductNotFoundError(err.message);
        }

        try{
            await checkStock(order.items , foundProducts);
        }
        catch(err){
            throw new InsufficientStockError(err.message);
        }

        const totals = calculateTotal(order , foundProducts);

        let payment;
        try{
            payment = await processPayment(totals.total);
        }
        catch(err){
            throw new InvalidOrderError(err.message);
        }

        const processedOrder = {
            id: order.id,
            customerName: customer.name,
            items: order.items,
            subtotal: totals.subtotal,
            discount: totals.discount,
            tax: totals.tax,
            total: totals.total,
            paymentStatus: payment.status,
            status: "confirmed"
        };

        return processedOrder;
    }
    finally{
        console.log("Finished attempting to process order " + orderId);
    }
}

module.exports = {
    processOrder,
    CustomerNotFoundError,
    ProductNotFoundError,
    InsufficientStockError,
    InvalidOrderError
};