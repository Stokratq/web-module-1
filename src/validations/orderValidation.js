function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function isPositiveNumber(value) {
    return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validateCreateOrder(body) {
    if (!isObject(body)) {
        return ["Request body must be a JSON object"];
    }

    const problems = [];

    if (!isNonEmptyString(body.customerName)) {
        problems.push("customerName is required");
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
        problems.push("At least one item is required");
        return problems;
    }

    body.items.forEach((item, index) => {
        if (!isObject(item)) {
            problems.push(`items[${index}] must be an object`);
            return;
        }

        if (!isNonEmptyString(item.name)) {
            problems.push(`items[${index}].name is required`);
        }
        if (!isPositiveNumber(item.quantity)) {
            problems.push(`items[${index}].quantity must be greater than zero`);
        }
        if (!isPositiveNumber(item.price)) {
            problems.push(`items[${index}].price must be greater than zero`);
        }
    });

    return problems;
}

module.exports = { validateCreateOrder};