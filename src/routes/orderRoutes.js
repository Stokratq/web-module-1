const express = require("express");
const service = require("../service/orderService");
const { validationProblem, notFoundProblem } = require("../errors");

const router = express.Router();

function copyItem(item)
{
    return {
        name: item.name,
        quantity: item.quantity,
        price: item.price,
    };
}
function orderResponse(order)
{
    return {
        id: order.id,
        customerName: order.customerName,
        items: order.items.map(copyItem),
        total: order.total,
        status: order.status,
    };
}
router.post("/", (req, res) => {
    const { problems, order } = service.createOrder(req.body);

    if (problems) {
        return res.status(400).json(validationProblem("Invalid order", problems));
    }

    return res
        .status(201)
        .location(`/orders/${order.id}`)
        .json(orderResponse(order));
});

router.get("/", (req, res) => {
    const orders = service.listOrders().map(orderResponse);
    res.status(200).json({ orders, count: orders.length });
});

router.get("/:id", (req, res) => {
    const order = service.getOrder(req.params.id);

    if (!order) {
        return res.status(404).json(notFoundProblem());
    }

    return res.status(200).json(orderResponse(order));
});

router.delete("/:id", (req, res) => {
    if (!service.deleteOrder(req.params.id)) {
        return res.status(404).json(notFoundProblem());
    }

    return res.status(204).send();
});

module.exports = router;
