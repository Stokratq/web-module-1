
const { randomUUID } = require("node:crypto");
const store = require("../store/orderStore");
const { validateCreateOrder } = require("../validations/orderValidation");

const DEFAULT_ORDER_STATUS = "created";

function makeOrderId() {
    return `ord-${randomUUID().slice(0, 8)}`;
}

function roundMoney(value)
{
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculateTotal(items)
{
    return roundMoney(
        items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    );
}
function normalizeItems(items) {
    return items.map((item) => ({
        name: item.name.trim(),
        quantity: item.quantity,
        price: item.price,
    }));
}

function createOrder(body) {
    const problems = validateCreateOrder(body);
    if (problems.length > 0) {
        return { problems };
    }

    const items = normalizeItems(body.items);

    const order = store.save({
        id: makeOrderId(),
        customerName: body.customerName.trim(),
        items,
        total: calculateTotal(items),
        status: DEFAULT_ORDER_STATUS,
    });

    return { order };
}
function listOrders() {
    return store.list();
}

function getOrder(id) {
    return store.get(id);
}

function deleteOrder(id) {
    return store.remove(id);
}

module.exports = { createOrder, listOrders, getOrder, deleteOrder };