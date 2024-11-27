const Redemption = require("../../models/redemptions");

async function find(filter, projection, options) {
	return Redemption.find(filter, projection, options);
}

module.exports = find;
