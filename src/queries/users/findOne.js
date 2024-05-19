const Users = require("../../models/usernew");

async function findOne(query, projection, options) {
	return Users.findOne(query, projection, options).exec();
}

module.exports = findOne;
