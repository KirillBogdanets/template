const ValidationSteps = require("./validation/Validation");
const ActionSteps = require("./action/Action");
const WaiterSteps = require("./wait/Waiter");

module.exports = function () {
    ValidationSteps.call(this);
    ActionSteps.call(this);
    WaiterSteps.call(this);
};