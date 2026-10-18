const orders = [];

function save(order) {
    orders.push(order);
    return order;
}

function get(id) {
    return orders.find((order) => order.id === id);
}

function list() {
    return [...orders];
}

function remove(id)
{
    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) {
        return false;
    }
    orders.splice(index, 1);
    return true;
}

module.exports = { save, get, list, remove };