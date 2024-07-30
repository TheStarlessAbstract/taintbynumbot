const Counter = require("../../models/counter");

async function updateOne(filter, update, options) {
	return Counter.updateOne(filter, update, options).exec();
}

module.exports = updateOne;
