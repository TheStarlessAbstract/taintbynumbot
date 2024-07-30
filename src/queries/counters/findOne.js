const Counter = require("../../models/counter.js");

async function findOne(query, projection, options) {
	return await Counter.findOne(query, projection, options).exec();
}

module.exports = findOne;
