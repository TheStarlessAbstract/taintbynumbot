const Counter = require("../../models/counter.js");

async function create(doc, options) {
	if (options) {
		return await Counter.create(doc, options);
	}
	return await Counter.create(doc);
}

module.exports = create;
